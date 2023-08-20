import {Router} from 'express';
import * as userController from './Controller/User.controller.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js'
import * as validators from './User.validation.js';
const router =Router();


router.patch('/profilePic',auth,fileUpload(fileValidation.image).single('image'),
validation(validators.profilePic),userController.profilePic);

router.patch('/coverPic',auth,fileUpload(fileValidation.image).
array('image',4),userController.coverPic);

router.patch('/updatePassword',auth,validation(validators.updatePassword),userController.updatePassword);

router.get('/:id/profile',validation(validators.shareProfile),userController.shareProfile);

router.get('/wishList',auth(Object.values(roles)),userController.getWishList);



export default router;