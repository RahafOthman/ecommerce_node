import {Router } from 'express';
import { auth } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Cart.endPoints.js';
import * as CartController from './Contorller/Cart.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import * as validators from './Cart.validation.js';
import validation from '../../Middleware/validation.js';
const router = Router();

router.post('/', auth(endPoint.create),validation(validators.addProductsToCart),asyncHandler(CartController.addProductsToCart));
router.patch('/deleteItem', auth(endPoint.create),asyncHandler(CartController.deleteProductsFromCart));
router.patch('/deleteCart', auth(endPoint.create),asyncHandler(CartController.clearCart));
router.get('/', auth(endPoint.create),asyncHandler(CartController.getCart));



//validation(validators.deleteProductsFromCart),

export default router ; 
