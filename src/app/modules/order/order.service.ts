import { OrderStatus, Prisma } from '@prisma/client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Order } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  orderRelationalFields,
  orderRelationalFieldsMapper,
  orderSearchableFields,
} from './order.constants';
import { IOrderFilterRequest, OrderInput } from './order.interfaces';

const insertIntoDB = async (data: OrderInput): Promise<Order> => {
  const productPrices = await Promise.all(
    data.orderItems.map(item =>
      prisma.product
        .findUnique({ where: { id: item.productId } })
        .then(product => {
          if (product?.afterDiscountPrice && product.afterDiscountPrice !== 0) {
            return product.afterDiscountPrice;
          } else {
            return product?.price;
          }
        })
    )
  );

  // Calculate expected total amount
  const expectedTotalAmount = data.orderItems.reduce((acc, item, index) => {
    const itemPrice = productPrices[index];
    if (!itemPrice) {
      throw new Error('Failed to retrieve price for product:');
    }
    return acc + item.quantity * itemPrice;
  }, 0);

  // Check total amount consistency
  if (expectedTotalAmount !== data.totalAmount) {
    throw new Error(
      'Total amount mismatch: Calculated total does not match the provided totalAmount.'
    );
  }

  const amount = expectedTotalAmount + data.platformCharge;

  // Create the order with calculated total

  const result = await prisma.order.create({
    data: {
      ...data,
      platformCharge: data.platformCharge,
      totalAmount: amount,
      orderItems: {
        create: data.orderItems.map(item => ({
          quantity: item.quantity,
          product: {
            connect: { id: item.productId },
          },
        })),
      },
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IOrderFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, userId, status, isCashOnDelivery, ...filterData } =
    filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (userId !== undefined) {
    andConditions.push({
      userId: Number(userId), // No need for 'equals' here
    });
  }

  if (status !== undefined) {
    andConditions.push({
      status: OrderStatus.PENDING, // No need for 'equals' here
    });
  }

  if (isCashOnDelivery !== undefined) {
    andConditions.push({
      isCashOnDelivery: isCashOnDelivery, // No need for 'equals' here
    });
  }

  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach(key => {
      if (orderRelationalFields.includes(key)) {
        andConditions.push({
          [orderRelationalFieldsMapper[key]]: {
            id: (filterData as any)[key],
          },
        });
      } else {
        andConditions.push({
          [key]: (filterData as any)[key], // No need for 'equals' here
        });
      }
    });
  }

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
    include: {
      orderItems: {
        include: {
          product: true, // Include product details for each order item
        },
      },
      user: {
        include: {
          buyer: true,
        },
      },
    },
  });
  const total = await prisma.order.count({
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

const getByIdFromDB = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Order>
): Promise<Order> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Order> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OrderService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
