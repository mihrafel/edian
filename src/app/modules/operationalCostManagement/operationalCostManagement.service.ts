import { IOperationalCostManagementFilterRequest } from './operationalCostManagement.interfaces';

// Your service code here
// Your service code here
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OperationalCostManagement, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { operationalCostManagementSearchableFields } from './operationalCostManagement.constants';

const insertIntoDB = async (
  data: OperationalCostManagement
): Promise<OperationalCostManagement> => {
  data.amount = Number(data.amount);
  const result = await prisma.operationalCostManagement.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IOperationalCostManagementFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<OperationalCostManagement[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: operationalCostManagementSearchableFields.map(field => ({
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

  const whereConditions: Prisma.OperationalCostManagementWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.operationalCostManagement.findMany({
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

  const total = await prisma.operationalCostManagement.count({
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

const getByIdFromDB = async (
  id: string
): Promise<OperationalCostManagement | null> => {
  const result = await prisma.operationalCostManagement.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<OperationalCostManagement>
): Promise<OperationalCostManagement> => {
  payload.amount = Number(payload.amount);
  const result = await prisma.operationalCostManagement.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (
  id: string
): Promise<OperationalCostManagement> => {
  const result = await prisma.operationalCostManagement.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OperationalCostManagementService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
