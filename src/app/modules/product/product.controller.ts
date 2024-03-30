/* eslint-disable no-undef */
// Your controller code here
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { productFilterableFields } from './product.constants';
import { CloudinaryUploadFile, ProductInput } from './product.interfaces';
import { ProductService } from './product.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // Insert into the database using your ProductService
  const userId = req?.user?.userId;
  const data: ProductInput = {
    ...req.body,
    userId: userId,
    productImages: req.files as CloudinaryUploadFile[], // Assuming req.files is of type File[] or undefined
  };

  const result = await ProductService.insertIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});
const insertExcelIntoDB = catchAsync(async (req: Request, res: Response) => {
  // Insert into the database using your ProductService

  const fileInfo = req?.file;
  const userId = req?.user?.userId;

  // console.log(fileInfo);

  const result = await ProductService.insertExcelIntoDB(fileInfo, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ProductService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(req.body);
  const result = await ProductService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertExcelIntoDB,
};
