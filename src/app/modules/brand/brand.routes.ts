// Define your routes here

import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BrandController } from './brand.controller';
import { BrandValidation } from './brand.validations';

const router = express.Router();
router.get('/', BrandController.getAllFromDB);
router.get('/:id', BrandController.getByIdFromDB);

router.post(
  '/',
  validateRequest(BrandValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BrandController.insertIntoDB
);

/// I intend to explore the update course functionalities in the upcoming module.
router.patch(
  '/:id',
  validateRequest(BrandValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BrandController.updateOneInDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BrandController.deleteByIdFromDB
);

export const brandRoutes = router;
