// Your service code here
/* eslint-disable @typescript-eslint/no-explicit-any */
// Your service code here

import { Employee, EmployeeTypes, Prisma } from '@prisma/client';

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CloudinaryUploadFile } from '../product/product.interfaces';
import {
  deleteCloudinaryFiles,
  uploadToCloudinary,
} from '../product/product.utils';
import {
  employeeRelationalFields,
  employeeRelationalFieldsMapper,
  employeeSearchableFields,
} from './employee.constants';
import { IEmployeeFilterRequest } from './employee.interfaces';

const insertIntoDB = async (data: Employee): Promise<Employee> => {
  const nidImage = await uploadToCloudinary(
    data.nidImage as unknown as CloudinaryUploadFile[]
  );
  const result = await prisma.employee.create({
    data: {
      ...data,
      nidImage: nidImage,
    },
  });
  // console.log(result);

  if (!result) {
    await deleteCloudinaryFiles(
      data.nidImage as unknown as CloudinaryUploadFile[]
    );
  }

  return result;
};

const getAllFromDB = async (
  filters: IEmployeeFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Employee[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, types, joiningDate, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (types) {
    andConditions.push({
      types: {
        equals: types as EmployeeTypes,
      },
    });
  }

  if (joiningDate) {
    andConditions.push({
      joiningDate: {
        equals: new Date(joiningDate),
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (employeeRelationalFields.includes(key)) {
          const relationKey = employeeRelationalFieldsMapper[key] || key;
          return {
            [relationKey]: {
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

  const whereConditions: Prisma.EmployeeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.employee.findMany({
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
  const total = await prisma.employee.count({
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

const getByIdFromDB = async (id: string): Promise<Employee | null> => {
  const result = await prisma.employee.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Employee>
): Promise<Employee> => {
  const data = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (payload.nidImage !== undefined && payload.nidImage !== null) {
    const nidImage = await uploadToCloudinary(
      payload.nidImage as unknown as CloudinaryUploadFile[]
    );

    const result = await prisma.employee.update({
      where: {
        id,
      },
      data: {
        ...payload,
        nidImage,
      },
    });

    return result;
  } else {
    const result = await prisma.employee.update({
      where: {
        id,
      },
      data: {
        ...payload,
        nidImage: data?.nidImage as Prisma.JsonValue[], // Assuming JsonValue type
      } as Prisma.EmployeeUpdateInput,
    });

    return result;
  }
};

const deleteByIdFromDB = async (id: string): Promise<Employee> => {
  const result = await prisma.employee.delete({
    where: {
      id,
    },
  });
  return result;
};

export const EmployeeService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
