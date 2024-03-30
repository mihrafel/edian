// Your controller code here
// deliveryCharge.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
// Update this import based on your constants file
import { deliveryFilterableFields } from './deliveryCharge.constants';
import { DeliveryChargeService } from './deliveryCharge.service'; // Assuming you have a service for delivery charge operations

// Your controller code here
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DeliveryChargeService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DeliveryChargeService created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, deliveryFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await DeliveryChargeService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery charges fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DeliveryChargeService.getByIdFromDB(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery charge fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DeliveryChargeService.updateOneInDB(
    Number(id),
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery charge updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DeliveryChargeService.deleteByIdFromDB(Number(id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delivery charge deleted successfully',
    data: result,
  });
});

export const DeliveryChargeController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
