import { Router } from 'express';
import * as OrderController from './Controller/Order.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import * as validators from './Order.validation.js';
import validation from '../../Middleware/validation.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Order.endPoints.js';

const router = Router({mergeParams: true}); 

router.post('/',auth(endPoint.create),validation(validators.createOrder),asyncHandler(OrderController.createOrder));
router.post('/allitemsfromcart',auth(endPoint.create),asyncHandler(OrderController.createOrderWithItemsFromCart));
router.patch('/cancel/:orderId',auth(endPoint.cancel),validation(validators.cancelOrder),asyncHandler(OrderController.cancelOrder));
router.patch('/updateorderstatus/:orderId',auth(endPoint.updateStatus),validation(validators.updateOrderStatus),asyncHandler(OrderController.updateOrderStatus));

export default router ; 







