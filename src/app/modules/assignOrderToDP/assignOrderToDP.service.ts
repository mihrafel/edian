// Your service code here

// Your service code here
// Your service code here
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssignOrderToDP, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import moment from 'moment';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { assignOrderToDPSearchableFields } from './assignOrderToDP.constants';
import {
  IAssignOrderToDPFilterRequest,
  ICombinedFilterRequest,
} from './assignOrderToDP.interfaces';

const insertIntoDB = async (
  data: AssignOrderToDP
): Promise<AssignOrderToDP> => {
  data.deliveryTimeCommitted = Number(data.deliveryTimeCommitted);

  const checkOrder = await prisma.order.findUnique({
    where: {
      id: data.orderId,
    },
  });
  if (!checkOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Id not found');
  }
  const checkEmployee = await prisma.employee.findUnique({
    where: {
      id: data.employeeId,
    },
  });
  if (checkEmployee) {
    if (checkEmployee.types !== 'DP') {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Employee types not a delivery person'
      );
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Employee Id not found');
  }
  const result = await prisma.assignOrderToDP.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IAssignOrderToDPFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AssignOrderToDP[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: assignOrderToDPSearchableFields.map(field => ({
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

  const whereConditions: Prisma.AssignOrderToDPWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.assignOrderToDP.findMany({
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

  const total = await prisma.assignOrderToDP.count({
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

const getByIdFromDB = async (id: string): Promise<AssignOrderToDP | null> => {
  const result = await prisma.assignOrderToDP.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<any>
): Promise<AssignOrderToDP> => {
  payload.deliveryTimeCommitted = Number(payload.deliveryTimeCommitted);
  const findData = await prisma.assignOrderToDP.findUnique({
    where: {
      id: id,
    },
  });
  const orderInfo = await prisma.order.findUnique({
    where: {
      id: findData?.orderId,
    },
  });
  if (payload.status && payload.status === 'ASSIGNING') {
    return await prisma.$transaction(async transactionClient => {
      let orderTime: string | undefined;

      if (orderInfo?.createdAt && orderInfo?.createdAt) {
        // Extract date and time using moment.js formatting options
        orderTime = moment(orderInfo?.createdAt).format('YYYY-MM-DD HH:mm:ss'); // Adjust format as needed
      }
      const updateOrder = await transactionClient.order.update({
        where: {
          id: orderInfo?.id,
        },
        data: {
          status: payload.status,
        },
      });

      if (!updateOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update order');
      }
      const result = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          orderId: payload.orderId || findData?.orderId,
          employeeId: payload.employeeId || findData?.employeeId,
          deliveryTimeCommitted:
            payload?.deliveryTimeCommitted || findData?.deliveryTimeCommitted,
          deliveryCompletionTime: '0',
          orderTime: orderTime,
        },
      });
      let assigningTime: string | undefined;

      if (result?.createdAt && result?.createdAt) {
        // Extract date and time using moment.js formatting options
        assigningTime = moment(result?.createdAt).format('YYYY-MM-DD HH:mm:ss'); // Adjust format as needed
      }
      const results = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          orderId: payload.orderId || findData?.orderId,
          employeeId: payload.employeeId || findData?.employeeId,
          deliveryTimeCommitted:
            payload?.deliveryTimeCommitted || findData?.deliveryTimeCommitted,
          deliveryCompletionTime: '0',
          orderTime: result.orderTime,
          assigningTime: assigningTime,
        },
      });

      return results;
    });
  }
  if (payload.status && payload.status === 'INPROGRESS') {
    return await prisma.$transaction(async transactionClient => {
      const updateOrder = await transactionClient.order.update({
        where: {
          id: orderInfo?.id,
        },
        data: {
          status: payload.status,
        },
      });

      if (!updateOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update order');
      }
      let progressTime: string | undefined;

      // Extract date and time using moment.js formatting options
      progressTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); // Adjust format as needed

      const results = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          inProgressTime: progressTime,
        },
      });

      return results;
    });
  }
  if (payload.status && payload.status === 'RECEIVED') {
    await prisma.$transaction(async transactionClient => {
      const updateOrder = await transactionClient.order.update({
        where: {
          id: orderInfo?.id,
        },
        data: {
          status: payload.status,
        },
      });

      if (!updateOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update order');
      }
      let orderInProgressMinutes: string | undefined;

      if (findData?.createdAt) {
        // Use optional chaining to access properties safely
        const findDataInProgressTime = findData?.inProgressTime;
        if (!findDataInProgressTime) {
          console.log('Error: findData.inProgressTime is missing or invalid');
          return; // Handle the case where inProgressTime is missing
        }

        // Calculate duration in milliseconds
        const duration = moment.duration(
          Date.now() - new Date(findDataInProgressTime).getTime()
        ); // Use findDataInProgressTime.getTime()

        // Format the duration
        orderInProgressMinutes = `${Math.round(duration.asMinutes())} minutes`;
      }

      let recievedTimeMinutes: string | undefined;

      // Extract date and time using moment.js formatting options
      recievedTimeMinutes = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'); // Adjust format as needed

      const results = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          orderReceivedTime: recievedTimeMinutes,
          orderInProgressMinutes: orderInProgressMinutes,
        },
      });

      console.log(results);

      return results;
    });
  }
  if (payload.status && payload.status === 'DELIVERED') {
    await prisma.$transaction(async transactionClient => {
      const result = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          orderId: payload.orderId || findData?.orderId,
          employeeId: payload.employeeId || findData?.employeeId,
          deliveryTimeCommitted:
            payload?.deliveryTimeCommitted || findData?.deliveryTimeCommitted,
          deliveryCompletionTime: '0',
        },
      });
      let deliveryCompletionTime: string | undefined;
      if (findData?.createdAt && result?.updatedAt) {
        const duration = moment.duration(
          result?.updatedAt.getTime() - findData.createdAt.getTime()
        );
        deliveryCompletionTime = `${Math.round(
          duration.asMinutes()
        )} min ${Math.round(duration.asSeconds())} seconds`;
      }
      console.log(deliveryCompletionTime);

      let deliveryTimeMinutes: string | undefined;

      // Extract date and time using moment.js formatting options
      deliveryTimeMinutes = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      let deliveryDurationFromReceive: string | undefined;

      if (findData?.createdAt) {
        // Use optional chaining to access properties safely
        const orderReceivedTime = findData?.orderReceivedTime;
        if (!orderReceivedTime) {
          console.log('Error: orderReceivedTime is missing or invalid');
          return; // Handle the case where inProgressTime is missing
        }

        // Calculate duration in milliseconds
        const duration = moment.duration(
          Date.now() - new Date(orderReceivedTime).getTime()
        ); // Use findDataInProgressTime.getTime()

        // Format the duration
        deliveryDurationFromReceive = `${Math.round(
          duration.asMinutes()
        )} minutes`;
      }

      let orderExcutionTime: string | undefined;

      if (findData?.assigningTime) {
        // Use optional chaining to access properties safely
        const orderAssigningTime = findData?.assigningTime;
        if (!orderAssigningTime) {
          console.log('Error: orderAssigningTime is missing or invalid');
          return; // Handle the case where inProgressTime is missing
        }

        // Calculate duration in milliseconds
        const duration = moment.duration(
          Date.now() - new Date(orderAssigningTime).getTime()
        ); // Use findDataInProgressTime.getTime()

        // Format the duration
        orderExcutionTime = `${Math.round(duration.asMinutes())} minutes`;
      }

      const results = await transactionClient.assignOrderToDP.update({
        where: {
          id,
        },
        data: {
          orderId: payload.orderId || findData?.orderId,
          employeeId: payload.employeeId || findData?.employeeId,
          deliveryTimeCommitted:
            payload?.deliveryTimeCommitted || findData?.deliveryTimeCommitted,
          deliveryCompletionTime: deliveryCompletionTime,
          orderDeliveredTime: deliveryTimeMinutes,
          deliveryDurationFromRecieveMinutes: deliveryDurationFromReceive,
          orderExcutionTimeMinutes: orderExcutionTime,
        },
      });

      const updateOrder = await transactionClient.order.update({
        where: {
          id: orderInfo?.id,
        },
        data: {
          status: payload.status,
        },
      });

      if (!updateOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update order');
      }

      return results;
    });
  }
  const result = await prisma.assignOrderToDP.update({
    where: {
      id,
    },
    data: {
      orderId: payload.orderId || findData?.orderId,
      employeeId: payload.employeeId || findData?.employeeId,
      deliveryTimeCommitted:
        payload?.deliveryTimeCommitted || findData?.deliveryTimeCommitted,
      deliveryCompletionTime: '0',
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<AssignOrderToDP> => {
  const result = await prisma.assignOrderToDP.delete({
    where: {
      id,
    },
  });
  return result;
};

const getAllInfoFromDB = async (
  filters: ICombinedFilterRequest, // Combined filter interface
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, userId, status, isCashOnDelivery, ...filterData } =
    filters;
  const andConditions: string | any[] = [];

  // ... (search and filter logic similar to the previous versions)

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      assignOrderToDPs: {
        select: {
          employeeId: true,
          deliveryTimeCommitted: true,
          deliveryCompletionTime: true,
          // ...other fields you need
        },
      }, // Include the related AssignOrderToDP record
      user: {
        include: {
          buyer: true, // Include buyer details for customer information
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
    data: result.map(item => ({
      orderId: item.id,
      customerName: item.user?.buyer?.username ?? '',
      address: item.user?.buyer?.address ?? '',
      phoneNumber: item.user?.buyer?.mobileNumber ?? '',
      orderStatus: item.status,
      dpId: item.assignOrderToDPs?.[0]?.employeeId ?? '', // Handle potential null values
      deliveryTimeCommitted:
        item.assignOrderToDPs?.[0]?.deliveryTimeCommitted ?? 0,
      deliveryCompletionTime:
        item.assignOrderToDPs?.[0]?.deliveryCompletionTime ?? 0,
      // Add other desired fields from Order and AssignOrderToDP models
    })),
  };
};
const getDeliveryReportsInfoFromDB = async (
  filters: ICombinedFilterRequest, // Combined filter interface
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, userId, status, isCashOnDelivery, ...filterData } =
    filters;
  const andConditions: string | any[] = [];

  // ... (search and filter logic similar to the previous versions)

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      assignOrderToDPs: {
        select: {
          employee: true,
          employeeId: true,
          deliveryTimeCommitted: true,
          deliveryCompletionTime: true,
          orderTime: true,
          assigningTime: true,
          inProgressTime: true,
          orderInProgressMinutes: true,
          orderReceivedTime: true,
          orderDeliveredTime: true,
          deliveryDurationFromRecieveMinutes: true,
          orderExcutionTimeMinutes: true,

          // ...other fields you need
        },
      },
      // Include the related AssignOrderToDP record
      // Employee: true, // Include
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
    data: result.map(item => ({
      orderId: item.id,
      dpId: item.assignOrderToDPs?.[0]?.employeeId ?? '', // Handle potential null values
      dpName: item.assignOrderToDPs?.[0]?.employee.name ?? '', // Handle potential null values
      orderTime: item.assignOrderToDPs?.[0]?.orderTime ?? 0,
      assigningTime: item.assignOrderToDPs?.[0]?.assigningTime ?? 0,
      inProgressTime: item.assignOrderToDPs?.[0]?.inProgressTime ?? 0,
      orderInProgressMinutes:
        item.assignOrderToDPs?.[0]?.orderInProgressMinutes ?? 0,
      orderReceivedTime: item.assignOrderToDPs?.[0]?.orderReceivedTime ?? 0,
      orderDeliveredTime: item.assignOrderToDPs?.[0]?.orderDeliveredTime ?? 0,
      deliveryDurationFromRecieveMinutes:
        item.assignOrderToDPs?.[0]?.deliveryDurationFromRecieveMinutes ?? 0,
      orderExcutionTimeMinutes:
        item.assignOrderToDPs?.[0]?.orderExcutionTimeMinutes ?? 0,
      // Add other desired fields from Order and AssignOrderToDP models
    })),
  };
};
const getMonitoryReportsInfoFromDB = async (
  filters: ICombinedFilterRequest, // Combined filter interface
  options: IPaginationOptions
): Promise<IGenericResponse<any[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, userId, status, isCashOnDelivery, ...filterData } =
    filters;
  const andConditions: string | any[] = [];

  // ... (search and filter logic similar to the previous versions)

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      orderItems: {
        select: {
          order: true,
          orderId: true,
          product: true,
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
    data: result.map(item => ({
      orderId: item.orderItems?.[0]?.orderId ?? '',
      vat: item.orderItems?.[0]?.product.vat ?? '',
      totalPrice: item.orderItems?.[0]?.product.totalPrice ?? '',
    })),
  };
};

export const AssignOrderToDPService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  getAllInfoFromDB,
  getDeliveryReportsInfoFromDB,
  getMonitoryReportsInfoFromDB,
};
