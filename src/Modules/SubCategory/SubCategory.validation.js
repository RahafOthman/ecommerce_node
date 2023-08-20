import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createSubcategory = joi.object({
    categoryId: generalFeilds.id, 
    name:joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required(),
}).required();

export const updateSubcategory = joi.object({
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    name:joi.string().min(2).max(20),
    file: generalFeilds.file,
}).required();

export const getSpecificSubcategory = joi.object({
    categoryId: generalFeilds.id,
}).required();

export const getSubcategory = joi.object({
    categoryId: generalFeilds.id,
}).required();

export const getProducts = joi.object({
    subCategoryId: generalFeilds.id,
}).required();

export const deleteSubCategory = joi.object({
    subCategoryId: generalFeilds.id,
}).required();