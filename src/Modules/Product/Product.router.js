import {Router} from 'express';
import * as ProductController from './Controller/Product.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Product.endpoints.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import * as validators from './Product.validation.js';
import validation from '../../Middleware/validation.js';
import reviewRouter from '../Review/Review.router.js';
const router = Router({mergeParams: true});


router.use('/:productId/review', reviewRouter);
router.post('/:productId/addToWishList', auth(Object.values(roles)), asyncHandler(ProductController.addProductToWishList));
router.delete('/:productId/removeFromWishList', auth(Object.values(roles)), asyncHandler(ProductController.removeProductFromWishList));


router.post('/', auth(endPoint.create),fileUpload(fileValidation.image).fields([
    { name:'mainImage', maxCount:1 },
    { name:'subImages', maxCount:5 }
]),validation(validators.createProduct),asyncHandler(ProductController.createProduct));

router.patch('/:productId',auth(endPoint.update), fileUpload(fileValidation.image).fields([
    {name: 'mainImage', maxsCount:1},
    {name: 'subImages', maxCount:5}
]),validation(validators.updateProduct) ,asyncHandler(ProductController.updateProduct));

router.patch('/softDelete/:productId', auth(endPoint.softDelete),validation(validators.softDelete) ,asyncHandler(ProductController.softDelete));
router.delete('/forceDelete/:productId', auth(endPoint.forceDelete),validation(validators.forceDelete), asyncHandler(ProductController.forceDelete));
router.patch('/restore/:productId', auth(endPoint.restore),validation(validators.restore), asyncHandler(ProductController.restore));

router.get('/softDelete', auth(endPoint.softDelete), asyncHandler(ProductController.getSoftDeleteProducts));//soft deleted products must show for admin only 
router.get('/:productId', auth(Object.values(roles)),validation(validators.getProduct),asyncHandler(ProductController.getProduct));
router.get('/', auth(Object.values(roles)), asyncHandler(ProductController.getProducts));


export default router; 