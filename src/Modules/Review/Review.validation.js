import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createReview = joi.object({
    productId: generalFeilds.id.required(),
    comment: joi.string().required(),
    rating: joi.number().required()
}).required();


export const updateReview = joi.object({
    productId: generalFeilds.id.required(),
    reviewId: generalFeilds.id.required(),
    comment: joi.string(),
    rating: joi.number(),
}).required();