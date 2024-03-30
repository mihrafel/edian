// Your service code here
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Brand, Prisma, Zone } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBrandFilterRequest } from './brand.interfaces';
import { brandSearchableFields } from './brand.constants';

const insertIntoDB = async (data: Brand): Promise<Brand> => {
  const isAnyBrand = await prisma.brand.findFirst({
    where: {
      title: data.title,
    },
  });
  if (isAnyBrand) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnyBrand.title} title.`
    );
  }
  const result = await prisma.brand.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IBrandFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Zone[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(filters);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: brandSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.BrandWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.brand.findMany({
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

  const total = await prisma.brand.count({
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

const getByIdFromDB = async (id: string): Promise<Brand | null> => {
  const result = await prisma.brand.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Brand>
): Promise<Brand> => {
  const result = await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Brand> => {
  const result = await prisma.brand.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BrandService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
