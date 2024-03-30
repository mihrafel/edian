// Define your routes here
// deliveryCharge.routes.ts

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DeliveryChargeController } from './deliveryCharge.controller';
import { DeliveryChargeValidation } from './deliveryCharge.validations';

const router = express.Router();

router.get('/', DeliveryChargeController.getAllFromDB);
router.get('/:id', DeliveryChargeController.getByIdFromDB);

router.post(
  '/',
  validateRequest(DeliveryChargeValidation.create),
  // Add authentication middleware if needed
  DeliveryChargeController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(DeliveryChargeValidation.update),
  // Add authentication middleware if needed
  DeliveryChargeController.updateOneInDB
);

router.delete(
  '/:id',
  // Add authentication middleware if needed
  DeliveryChargeController.deleteByIdFromDB
);

export const DeliveryChargeRoutes = router;
