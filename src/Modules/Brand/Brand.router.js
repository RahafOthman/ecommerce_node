import {Router} from 'express';
import * as BrandController from './Controller/Brand.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import * as validators from './Brand.validation.js';
import fileUpload, {fileValidation} from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Brand.endPoints.js';

const router = Router(); 

router.post('/',auth(endPoint.create) ,fileUpload(fileValidation.image).single('image'), validation(validators.createBrand), 
asyncHandler(BrandController.createBrand));

router.get('/:categoryId',auth(endPoint.get) , asyncHandler(BrandController.getAllBrands));


router.put('/:brandId',auth(endPoint.update),fileUpload(fileValidation.image).single('image'), validation(validators.updateBrand),
asyncHandler(BrandController.updateBrand));

router.delete('/',auth(endPoint.delete) , asyncHandler(BrandController.DeleteBrand));


export default router ; 