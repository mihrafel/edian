import express from 'express';
// Define your routes here

import validateRequest from '../../middlewares/validateRequest';
import { configureShopperImagesUpload } from '../product/product.utils';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
const router = express.Router();
router.post(
  '/create-buyer',
  validateRequest(UserValidation.createBuyer),
  UserController.createBuyer
);
router.post(
  '/create-merchant',
  validateRequest(UserValidation.createMerchant),
  UserController.createMerchant
);
router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdmin),
  UserController.createAdmin
);
router.post(
  '/create-shopper',
  configureShopperImagesUpload(),
  validateRequest(UserValidation.createShopper),
  UserController.createShopper
);

export const UserRoutes = router;
