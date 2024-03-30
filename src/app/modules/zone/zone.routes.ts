// Define your routes here
import express from 'express';
// import { ENUM_USER_ROLE } from '../../../enums/user';
// import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ZoneController } from './zone.controller';
import { ZoneValidation } from './zone.validations';

const router = express.Router();
router.get('/', ZoneController.getAllFromDB);
router.get('/:id', ZoneController.getByIdFromDB);

router.post(
  '/',
  validateRequest(ZoneValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ZoneController.insertIntoDB
);

/// I intend to explore the update course functionalities in the upcoming module.
router.patch(
  '/:id',
  validateRequest(ZoneValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ZoneController.updateOneInDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ZoneController.deleteByIdFromDB
);

export const zoneRoutes = router;
