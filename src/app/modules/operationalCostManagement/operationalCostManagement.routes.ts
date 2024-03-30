// Define your routes here
// Define your routes here
import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OperationalCostManagementController } from './operationalCostManagement.controller';
import { OperationalCostManagementValidation } from './operationalCostManagement.validations';

const router = express.Router();
router.get('/', OperationalCostManagementController.getAllFromDB);
router.get('/:id', OperationalCostManagementController.getByIdFromDB);

router.post(
  '/',
  validateRequest(OperationalCostManagementValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OperationalCostManagementController.insertIntoDB
);

/// I intend to explore the update course functionalities in the upcoming module.
router.patch(
  '/:id',
  validateRequest(OperationalCostManagementValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OperationalCostManagementController.updateOneInDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OperationalCostManagementController.deleteByIdFromDB
);

export const OperationalCostManagementRoutes = router;
