import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createOrder = joi.object({
    address:joi.string().required(),
    phoneNumber:joi.array().items(joi.string()).required(),
    paymentType:joi.string(),
    couponName:joi.string().min(2).max(20),
    products:joi.array().items(joi.object({
        productId:generalFeilds.id.required(),
        qty:joi.number().required(),
    })),
}).required();

export const createOrderWithItemsFromCart = joi.object({
    address:joi.string().required(),
    phoneNumber:joi.array().items(joi.string()).required(),
    paymentType:joi.string(),
    couponName:joi.string().min(2).max(20),
 
}).required();

export const cancelOrder = joi.object({
    orderId: generalFeilds.id,
    resonPreject: joi.string()
}).required();

export const updateOrderStatus = joi.object({
    orderId: generalFeilds.id,
    status: joi.string(),
}).required();