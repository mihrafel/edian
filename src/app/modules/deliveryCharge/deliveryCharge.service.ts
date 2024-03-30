// Your service code here
// deliveryCharge.service.ts

import { DeliveryChargeMappingBase, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IDeliveryChargeFilterRequest } from './deliveryCharge.interfaces';

const insertIntoDB = async (data: Partial<any>): Promise<any> => {
  // Extract relevant data from the input

  // Check if it's a flat charge
  if (data.name === 'Flat') {
    // Create the DeliveryChargeMappingBase entry with flat charge
    const createdMappingBase = await prisma.deliveryChargeMappingBase.create({
      data: {
        name: data.name,
        flatCharge: data.flatCharge || 0, // Set flat charge to 0 if not provided
      },
    });

    return createdMappingBase;
  }

  if (data.name === 'Cost') {
    const createdMappingBaseWithSlabs =
      await prisma.deliveryChargeMappingBase.create({
        data: {
          name: data.name,
          orderCostSlabs: {
            create: data.orderCostSlabs?.map(
              (slab: { fromCost: any; toCost: any; deliveryCharge: any }) => ({
                fromCost: slab.fromCost,
                toCost: slab.toCost,
                deliveryCharge: slab.deliveryCharge,
              })
            ),
          },
        },
      });

    return createdMappingBaseWithSlabs;
  }
  if (data.name === 'Weight') {
    const createdMappingBaseWithSlabs =
      await prisma.deliveryChargeMappingBase.create({
        data: {
          name: data.name,
          orderVolumeSlabs: {
            create: data.orderVolumeSlabs?.map(
              (slab: {
                fromWeight: any;
                toWeight: any;
                deliveryCharge: any;
              }) => ({
                fromWeight: slab.fromWeight,
                toWeight: slab.toWeight,
                deliveryCharge: slab.deliveryCharge,
              })
            ),
          },
        },
      });

    return createdMappingBaseWithSlabs;
  }

  // If not a flat charge, create the entry with slabs
};

const getAllFromDB = async (
  filters: IDeliveryChargeFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<DeliveryChargeMappingBase[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm /* other filters */ } = filters;
  const andConditions: string | any[] = [];

  // Your filtering conditions logic here

  const whereConditions: Prisma.DeliveryChargeMappingBaseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.deliveryChargeMappingBase.findMany({
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
      orderCostSlabs: true,
      orderVolumeSlabs: true,
    },
  });

  const total = await prisma.deliveryChargeMappingBase.count({
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
  id: number
): Promise<DeliveryChargeMappingBase | null> => {
  const result = await prisma.deliveryChargeMappingBase.findUnique({
    where: {
      id,
    },
    include: {
      orderCostSlabs: true,
      orderVolumeSlabs: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: number,
  payload: Partial<any>
): Promise<any> => {
  // Check if the ID is provided
  if (!id) {
    throw new Error('ID is required for updating.');
  }

  // Extract relevant data from the input
  const { name, flatCharge, orderCostSlabs, orderVolumeSlabs } = payload;

  // Check if it's a flat charge update
  if (name === 'Flat') {
    // Update the DeliveryChargeMappingBase entry with flat charge
    const updatedMappingBase = await prisma.deliveryChargeMappingBase.update({
      where: { id },
      data: {
        name: name,
        flatCharge: flatCharge || 0, // Set flat charge to 0 if not provided
      },
    });

    return updatedMappingBase;
  }

  // Check if it's an update with order cost slabs
  if (name === 'Cost' && orderCostSlabs) {
    const data = await prisma.orderCostSlab.deleteMany({
      where: {
        mappingBaseId: id,
      },
    });
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order cost not found');
    }
    const updatedMappingBaseWithSlabs =
      await prisma.deliveryChargeMappingBase.update({
        where: { id }, // Provide the where argument with the id
        data: {
          name: name,
          orderCostSlabs: {
            create: orderCostSlabs.map(
              (slab: {
                fromWeight: any;
                toWeight: any;
                deliveryCharge: any;
              }) => ({
                fromWeight: slab.fromWeight,
                toWeight: slab.toWeight,
                deliveryCharge: slab.deliveryCharge,
              })
            ),
          },
        },
        include: {
          orderCostSlabs: true,
        },
      });
    return updatedMappingBaseWithSlabs;
  }

  // Check if it's an update with order volume slabs
  if (name === 'Weight' && orderVolumeSlabs) {
    const data = await prisma.orderVolumeSlab.deleteMany({
      where: {
        mappingBaseId: id,
      },
    });
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order volume not found');
    }
    const updatedMappingBaseWithSlabs =
      await prisma.deliveryChargeMappingBase.update({
        where: { id }, // Provide the where argument with the id
        data: {
          name: name,
          orderVolumeSlabs: {
            create: orderVolumeSlabs.map(
              (slab: {
                fromWeight: any;
                toWeight: any;
                deliveryCharge: any;
              }) => ({
                fromWeight: slab.fromWeight,
                toWeight: slab.toWeight,
                deliveryCharge: slab.deliveryCharge,
              })
            ),
          },
        },
        include: {
          orderVolumeSlabs: true,
        },
      });
    return updatedMappingBaseWithSlabs;
  }

  // If not a flat charge update or slabs update, throw an error for unsupported cases
  throw new Error('Invalid data provided for updating.');
};

const deleteByIdFromDB = async (
  id: number
): Promise<DeliveryChargeMappingBase> => {
  const result = await prisma.$transaction(async transactionClient => {
    const mapping =
      await transactionClient.deliveryChargeMappingBase.findUnique({
        where: {
          id: id,
        },
      });

    if (!mapping) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Unable to find delivery charge mapping'
      );
    }

    let deleteResult;

    if (mapping.name === 'Flat') {
      deleteResult = await transactionClient.deliveryChargeMappingBase.delete({
        where: {
          id: id,
        },
      });
    } else {
      // Delete related slabs based on the type of mapping
      const deleteSlabsResult = await (mapping.name === 'Weight'
        ? transactionClient.orderVolumeSlab.deleteMany({
            where: {
              mappingBaseId: id,
            },
          })
        : transactionClient.orderCostSlab.deleteMany({
            where: {
              mappingBaseId: id,
            },
          }));

      // Delete the mapping itself
      deleteResult = await transactionClient.deliveryChargeMappingBase.delete({
        where: {
          id: id,
        },
      });
    }

    return deleteResult;
  });

  return result;
};

export const DeliveryChargeService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
