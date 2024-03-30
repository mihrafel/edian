import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CloudinaryUploadFile } from '../product/product.interfaces';
import { UserService } from './user.service';

const createBuyer = catchAsync(async (req: Request, res: Response) => {
  const { buyer, user } = req.body;

  const result = await UserService.createBuyer(buyer, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});
const createMerchant = catchAsync(async (req: Request, res: Response) => {
  const { merchant, user } = req.body;

  const result = await UserService.createMerchant(merchant, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

// type shopInput = {
//   email: string;
//   address: string;
//   mobileNumber: string;
//   picture: CloudinaryUploadFile[];
//   shopName: string;
//   tradeLicense: string;
//   tradeLicensePicture: CloudinaryUploadFile[];
//   shopId: string;
// };
const createShopper = catchAsync(async (req: Request, res: Response) => {
  const {
    email,
    address,
    mobileNumber,
    shopName,
    tradeLicense,
    password,
    ward,
  } = req.body;
  // console.log(shopper);

  const shopper: any = {
    email: email,
    address: address,
    mobileNumber: mobileNumber,
    shopName: shopName,
    tradeLicense: tradeLicense,
    ward: ward,
    picture: ((req.files as { picture?: CloudinaryUploadFile[] })?.picture ||
      []) as CloudinaryUploadFile[],
    tradeLicensePicture: ((
      req.files as { tradeLicensePicture?: CloudinaryUploadFile[] }
    )?.tradeLicensePicture || []) as CloudinaryUploadFile[],
  };

  const user: any = {
    password: password,
  };

  // console.log(req.files);
  // console.log(data.shopName);
  const result = await UserService.createShopper(shopper, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shopper created successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { admin, user } = req.body;

  const result = await UserService.createAdmin(admin, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const UserController = {
  createBuyer,
  createMerchant,
  createAdmin,
  createShopper,
};
