// Define your routes here
// Define your routes here
// Define your routes here
import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AssignOrderToDPController } from './assignOrderToDP.controller';
import { AssignOrderToDPValidation } from './assignOrderToDP.validations';

const router = express.Router();
router.get('/getAllInfoFromDB', AssignOrderToDPController.getAllInfoFromDB);
router.get(
  '/getDeliveryReportsInfoFromDB',
  AssignOrderToDPController.getDeliveryReportsInfoFromDB
);
router.get(
  '/getMonitoryReportsInfoFromDB',
  AssignOrderToDPController.getMonitoryReportsInfoFromDB
);
router.get('/', AssignOrderToDPController.getAllFromDB);
router.get('/:id', AssignOrderToDPController.getByIdFromDB);

router.post(
  '/',
  validateRequest(AssignOrderToDPValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AssignOrderToDPController.insertIntoDB
);

/// I intend to explore the update course functionalities in the upcoming module.
router.patch(
  '/:id',
  validateRequest(AssignOrderToDPValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AssignOrderToDPController.updateOneInDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AssignOrderToDPController.deleteByIdFromDB
);

export const AssignOrderToDPRoutes = router;
