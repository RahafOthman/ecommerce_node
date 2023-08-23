import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';

const router =Router();

router.post('/signup',validation(validators.signupSchema),AuthController.signup)
router.post('/login' ,asyncHandler(AuthController.login))
router.get('/confirmEmail/:token',validation(validators.token),asyncHandler( AuthController.confirmEmail));
router.get('/NewconfirmEmail/:token',validation(validators.token),asyncHandler(AuthController.NewconfirmEmail));
router.patch('/sendCode',validation(validators.sendCode),asyncHandler(AuthController.sendCode));
router.patch('/forgetPassword',validation(validators.forgetPassword),
asyncHandler(AuthController.forgetPassword));


export default router;