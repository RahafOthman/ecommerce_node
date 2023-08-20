import {Router} from 'express';
import * as CoponController from './Controller/Coupon.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import * as validators from './Coupon.validation.js';
import validation from '../../Middleware/validation.js';
import {auth} from '../../Middleware/auth.middleware.js';
import { endPoint } from './Coupon.endPoints.js';
import { roles } from '../../Middleware/auth.middleware.js';
const router = Router(); 

router.post('/',auth(endPoint.create),asyncHandler(CoponController.createCoupon));

router.put('/:couponId',auth(endPoint.update), validation(validators.updateCoupon),asyncHandler(CoponController.updateCoupon));

router.get('/:couponId',auth(Object.values(roles)) ,validation(validators.getSpecificCoupon),asyncHandler(CoponController.getSpecificCoupon));

router.get('/',auth(Object.values(roles)) ,asyncHandler(CoponController.getCoupon));
router.delete('/',auth(endPoint.delete),validation(validators.deleteCoupon),asyncHandler(CoponController.deleteCoupon));


//,validation(validators.createCoupon)
export default router ; 