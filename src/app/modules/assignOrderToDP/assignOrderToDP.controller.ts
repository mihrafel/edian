// Your controller code here
// Your controller code here
// Your controller code here
// Your controller code here
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import pick from '../../../shared/pick';
import { assignOrderToDPFilterableFields } from './assignOrderToDP.constants';
import { AssignOrderToDPService } from './assignOrderToDP.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AssignOrderToDPService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assign Order To DP created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, assignOrderToDPFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await AssignOrderToDPService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AssignOrderToDP fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssignOrderToDPService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AssignOrderToDP fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssignOrderToDPService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AssignOrderToDP updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AssignOrderToDPService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AssignOrderToDP deleted successfully',
    data: result,
  });
});

const getAllInfoFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, assignOrderToDPFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await AssignOrderToDPService.getAllInfoFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getDeliveryReportsInfoFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, assignOrderToDPFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AssignOrderToDPService.getDeliveryReportsInfoFromDB(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);
const getMonitoryReportsInfoFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, assignOrderToDPFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AssignOrderToDPService.getMonitoryReportsInfoFromDB(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const AssignOrderToDPController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  getByIdFromDB,
  deleteByIdFromDB,
  getAllInfoFromDB,
  getDeliveryReportsInfoFromDB,
  getMonitoryReportsInfoFromDB,
};
