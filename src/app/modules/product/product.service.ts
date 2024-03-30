/* eslint-disable @typescript-eslint/no-explicit-any */
// Your service code here
import { Product } from '@prisma/client';
import slugify from 'slugify';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import prisma from '../../../shared/prisma';
import {
  productRelationalFields,
  productRelationalFieldsMapper,
  productSearchableFields,
} from './product.constants';
import {
  IProductFilterRequest,
  ProductInput,
  ProductWhereInput,
} from './product.interfaces';
import {
  deleteCloudinaryFiles,
  deleteExcelFromCloudinary,
  uploadFileToCloudinary,
  uploadToCloudinary,
} from './product.utils';

import csvtojsonV2 from 'csvtojson';
const insertIntoDB = async (data: ProductInput): Promise<Product> => {
  const { title, price, discount } = data;
  // console.log(data);
  const baseSlug = slugify(title, { lower: true });
  // Check if the base slug already exists in the database
  let existingProduct = await prisma.product.findFirst({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
  });

  // If there is an existing product, append a count to the base slug
  let slugCount = 1;
  let uniqueSlug = baseSlug;

  while (existingProduct) {
    slugCount += 1;
    uniqueSlug = `${baseSlug}-${slugCount}`;

    existingProduct = await prisma.product.findFirst({
      where: {
        slug: {
          startsWith: uniqueSlug,
        },
      },
    });
  }

  // Set the unique slug in the data object
  data.slug = uniqueSlug;

  const productImages = await uploadToCloudinary(data.productImages);
  let afterDiscountPrice: number | undefined;

  if (discount !== undefined) {
    const discountedAmount = (Number(discount) / 100) * Number(price);
    afterDiscountPrice = Number(price) - discountedAmount;
  }

  let totalPrice: number | undefined;

  if (afterDiscountPrice !== undefined) {
    // Simplified condition
    totalPrice = afterDiscountPrice + Number(data.vat);
  } else {
    totalPrice = Number(data.price) + Number(data.vat);
  }

  const result = await prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: Number(price),
      category: { connect: { id: data.categoryId } },
      stock: Number(data.stock),
      unit: data.unit,
      productImages: productImages.map(url => ({ url })),
      productTags: Array.isArray(data.productTags)
        ? data.productTags
        : [data.productTags],
      discount: Number(discount),
      afterDiscountPrice: afterDiscountPrice,
      user: { connect: { id: Number(data.userId) } },
      vat: Number(data.vat),
      totalPrice: totalPrice,
    },
  });
  // console.log(result);

  if (!result) {
    await deleteCloudinaryFiles(data.productImages);
  }

  return result;
};

const insertExcelIntoDB = async (data: any, userId: any) => {
  const fileInfo = await uploadFileToCloudinary(data);

  // Download the file from Cloudinary
  const fileBuffer = await fetch(fileInfo.secure_url).then(res =>
    res.arrayBuffer()
  );

  // Convert the ArrayBuffer to a Buffer
  const buffer = Buffer.from(fileBuffer);

  // Convert the CSV buffer to JSON using csvtojson
  const jsonArray = await csvtojsonV2().fromString(buffer.toString());
  let totalPrice = 0;
  // Map through the jsonArray
  const formattedJsonArray = await Promise.all(
    jsonArray.map(async (item: any) => {
      const { afterDiscountPrice, price, vat } = item;

      if (afterDiscountPrice !== undefined) {
        totalPrice = Number(afterDiscountPrice) + Number(vat);
      } else {
        totalPrice = Number(price) + Number(vat);
      }
      // console.log(item.categoryId);
      const productImages = JSON.parse(item.productImages || '[]');
      // ... Other transformations
      const baseSlug = slugify(item.title, { lower: true });
      let existingProduct = await prisma.product.findFirst({
        where: {
          slug: {
            startsWith: baseSlug,
          },
        },
      });

      // If there is an existing product, append a count to the base slug
      let slugCount = 1;
      let uniqueSlug = baseSlug;

      while (existingProduct) {
        slugCount += 1;
        uniqueSlug = `${baseSlug}-${slugCount}`;

        existingProduct = await prisma.product.findFirst({
          where: {
            slug: {
              startsWith: uniqueSlug,
            },
          },
        });
      }

      return {
        ...item,
        slug: uniqueSlug,
        price: parseInt(item.price),
        categoryId: item.categoryId,
        // category: { connect: { id: item.categoryId } },
        stock: Number(item.stock),
        unit: item.unit,
        sell: Number(parseInt(item.sell)),
        productImages: productImages,
        productTags: Array.isArray(item.productTags)
          ? item.productTags
          : [item.productTags],
        discount: Number(parseInt(item.discount)),
        afterDiscountPrice: Number(parseInt(item.afterDiscountPrice)),
        orderId: null,
        userId: Number(userId),
        vat: Number(parseInt(item.vat)),
        totalPrice: Number(totalPrice),
      };
    })
  );

  // Wrap the array in an object with the 'data' property
  const prismaData = { data: formattedJsonArray };

  // Use the wrapped array with 'createMany'
  const result = await prisma.product.createMany(prismaData);

  if (!result) {
    await deleteExcelFromCloudinary(fileInfo.public_id);
  }

  return result;
};

const getAllFromDB = async (
  filters: IProductFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, minPrice, maxPrice, productTags, ...filterData } =
    filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (minPrice !== undefined) {
    andConditions.push({
      price: { gte: Number(minPrice) },
    });
  }

  if (maxPrice !== undefined) {
    andConditions.push({
      price: { lte: Number(maxPrice) },
    });
  }
  if (productTags && productTags.length > 0) {
    andConditions.push({
      productTags: {
        hasEvery: Array.isArray(productTags) ? productTags : [productTags],
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (productRelationalFields.includes(key)) {
          return {
            [productRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    include: {
      category: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      slug: id,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  data: Partial<ProductInput>
): Promise<Product> => {
  const { title, price, discount } = data;
  // console.log(data);
  //@ts-ignore
  const baseSlug = slugify(title, { lower: true });
  // Check if the base slug already exists in the database
  let existingProduct = await prisma.product.findFirst({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
  });

  // If there is an existing product, append a count to the base slug
  let slugCount = 1;
  let uniqueSlug = baseSlug;

  while (existingProduct) {
    slugCount += 1;
    uniqueSlug = `${baseSlug}-${slugCount}`;

    existingProduct = await prisma.product.findFirst({
      where: {
        slug: {
          startsWith: uniqueSlug,
        },
      },
    });
  }

  // Set the unique slug in the data object
  data.slug = uniqueSlug;

  data.discount = !isNaN(Number(data.discount)) ? Number(data.discount) : 0;
  // data.price = !isNaN(Number(data.price)) ? Number(data.price) : 0;
  //@ts-ignore
  // const productImages = await uploadToCloudinary(data.productImages);
  let afterDiscountPrice: number | undefined;

  if (discount !== undefined) {
    const discountedAmount = (Number(discount) / 100) * Number(price);
    afterDiscountPrice = Number(price) - discountedAmount;
  }
  const result = await prisma.product.update({
    where: {
      slug: id,
    },
    data: {
      ...data,
      price: Number(price),
      afterDiscountPrice: Number(afterDiscountPrice),
      vat: Number(data.vat),
    },
    include: {
      category: true,
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Product> => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return result;
};

export const ProductService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertExcelIntoDB,
};
