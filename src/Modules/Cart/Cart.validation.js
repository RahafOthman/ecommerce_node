import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const addProductsToCart = joi.object({
    productId: generalFeilds.id.required(),
    qty: joi.number().integer().required(),
    
}).required();


export const deleteProductsFromCart = joi.object({
    productIds: joi.array().items(generalFeilds.id)
}).required();