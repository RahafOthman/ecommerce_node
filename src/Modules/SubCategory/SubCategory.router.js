import { Router } from 'express';
import * as SubcategoryController from './Controller/SubCategory.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import * as validators from './SubCategory.validation.js';
import validation from '../../Middleware/validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { endPoint } from './SubCategory.endPoints.js';

const router = Router({mergeParams: true}); 

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'), validation(validators.createSubcategory),
asyncHandler(SubcategoryController.createSubcategory));

router.put('/:subCategoryId',auth(endPoint.update) ,fileUpload(fileValidation.image).single('image'), validation(validators.updateSubcategory),
asyncHandler(SubcategoryController.updateSubCategory));

router.get('/',auth(Object.values(roles)),asyncHandler(SubcategoryController.getSpecificSubcategory));

router.get('/all',auth(Object.values(roles)),asyncHandler(SubcategoryController.getSubCategory)); 
router.get('/:subCategoryId/products',auth(Object.values(roles)),asyncHandler(SubcategoryController.getProducts)); 
router.delete('/',auth(endPoint.delete),asyncHandler(SubcategoryController.deleteSubCategory)); 


export default router ; 







