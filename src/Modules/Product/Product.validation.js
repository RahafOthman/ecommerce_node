import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createProduct = joi.object({
    name:joi.string().min(2).max(20).required(),
  //  mainImage: generalFeilds.file.required(),
    description:joi.string().min(2).max(50),
    stock:joi.number().min(1),
    price: joi.number().min(1),
    discount: joi.number(),
    finalPrice: joi.number(),
   // colors:joi.array().string(),
    sizes: joi.string(),
    subImages: generalFeilds.file,
    isDeleted: joi.boolean(),
    categoryId:generalFeilds.id ,
    subCategoryId: generalFeilds.id ,
    brandId: generalFeilds.id ,
}).required();

export const updateProduct = joi.object({
    productId: generalFeilds.id ,
    categoryId:generalFeilds.id ,
    subCategoryId: generalFeilds.id ,
    brandId: generalFeilds.id ,
    name:joi.string().min(2).max(20),
    file: generalFeilds.file,
}).required();

export const softDelete = joi.object({
    productId: generalFeilds.id ,
}).required();

export const forceDelete = joi.object({
    productId: generalFeilds.id ,
}).required();

export const restore = joi.object({
    productId: generalFeilds.id ,
}).required();

export const getProduct = joi.object({
    productId: generalFeilds.id ,
}).required();