import {Router} from 'express';
import * as CategoryController from './Controller/Category.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import fileUpload, {fileValidation} from '../../Services/multerCloudinary.js';
import SubCategory from '../SubCategory/SubCategory.router.js';
import * as validators from './Category.validation.js';
import validation from '../../Middleware/validation.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Category.endPoints.js'; 
import { roles } from "../../Middleware/auth.middleware.js";

const router = Router(); 

router.use('/:categoryId/subCategory', SubCategory);

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image') ,
validation(validators.createCategory),
asyncHandler(CategoryController.createCategory));

router.put('/:categoryId',auth(endPoint.update), fileUpload(fileValidation.image).single('image'),
 validation(validators.updateCategory),
asyncHandler(CategoryController.updateCategory));

router.get('/:categoryId',auth(Object.values(roles)), validation(validators.getCategory), asyncHandler(CategoryController.getCategory));
router.get('/',auth(Object.values(roles)) ,asyncHandler(CategoryController.getAllCategory));

router.delete('/', auth(endPoint.delete), asyncHandler(CategoryController.deleteCategory));

export default router ; 