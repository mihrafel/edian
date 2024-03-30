import express from 'express';
import { configureEmployeeImagesUpload } from '../product/product.utils';
import { EmployeeController } from './employee.controller';
const router = express.Router();

// Define your routes here
router.get(
  '/',
  // validateRequest(UserValidation.createAdmin),
  EmployeeController.getAllFromDB
);
router.get(
  '/:id',
  // validateRequest(UserValidation.createAdmin),
  EmployeeController.getByIdFromDB
);

router.post(
  '/',
  // validateRequest(UserValidation.createAdmin),
  configureEmployeeImagesUpload(),
  EmployeeController.insertIntoDB
);
router.patch(
  '/:id',
  // validateRequest(UserValidation.createAdmin),
  configureEmployeeImagesUpload(),
  EmployeeController.updateOneInDB
);
router.delete(
  '/:id',
  // validateRequest(UserValidation.createAdmin),
  EmployeeController.deleteByIdFromDB
);

export const EmployeeRoutes = router;
