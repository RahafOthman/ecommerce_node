import {Router} from 'express';
import * as ProductController from './Controller/Product.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import * as validators from './Product.validation.js';
import validation from '../../Middleware/validation.js';
import reviewRouter from '../Review/Review.router.js';
import { endPoint } from './Product.endPoints.js';
const router = Router({mergeParams: true});

router.post('/',auth(roles.Admin),fileUpload(fileValidation.image).fields([
    { name:'mainImage', maxCount:1 },
    { name:'subImages', maxCount:5 }
]),asyncHandler(ProductController.createProduct));

//endPoint.update
router.patch('/:productId',auth(roles.Admin), fileUpload(fileValidation.image).fields([
    {name: 'mainImage', maxsCount:1},
    {name: 'subImages', maxCount:5}
]),validation(validators.updateProduct) ,asyncHandler(ProductController.updateProduct));

router.patch('/softDelete/:productId', auth(roles.Admin),validation(validators.softDelete) ,asyncHandler(ProductController.softDelete));
//endPoint.softDelete
router.delete('/forceDelete/:productId', auth(roles.Admin),validation(validators.forceDelete), asyncHandler(ProductController.forceDelete));
//endPoint.forceDelete
router.patch('/restore/:productId', auth(roles.Admin),validation(validators.restore), asyncHandler(ProductController.restore));
//endPoint.restore
//endPoint.softDelete
router.get('/softDelete', auth(Object.values(roles)), asyncHandler(ProductController.getSoftDeleteProducts));//soft deleted products must show for admin only 
router.get('/:productId', auth(Object.values(roles)),validation(validators.getProduct),asyncHandler(ProductController.getProduct));
router.get('/', auth(Object.values(roles)), asyncHandler(ProductController.getProducts));



router.use('/:productId/review', reviewRouter);
router.post('/:productId/addToWishList', auth(Object.values(roles)), asyncHandler(ProductController.addProductToWishList));
router.delete('/:productId/removeFromWishList', auth(Object.values(roles)), asyncHandler(ProductController.removeProductFromWishList));

export default router; 