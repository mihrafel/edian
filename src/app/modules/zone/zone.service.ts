/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Zone } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { zoneSearchableFields } from './zone.constants';
import { IZoneFilterRequest } from './zone.interfaces';

const insertIntoDB = async (data: Zone): Promise<Zone> => {
  const isAnyZone = await prisma.zone.findFirst({
    where: {
      title: data.title,
    },
  });
  if (isAnyZone) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnyZone.title} tile.`
    );
  }
  const result = await prisma.zone.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IZoneFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Zone[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(filters);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: zoneSearchableFields.map(field => ({
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

  const whereConditions: Prisma.ZoneWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.zone.findMany({
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

  const total = await prisma.zone.count({
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

const getByIdFromDB = async (id: string): Promise<Zone | null> => {
  const result = await prisma.zone.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Zone>
): Promise<Zone> => {
  const result = await prisma.zone.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Zone> => {
  const result = await prisma.zone.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ZoneService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
