import {Router} from 'express';
import * as reviewController from './Controller/Review.controller.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Review.endPoints.js';
import { asyncHandler } from '../../Services/errorHandling.js';
const router = Router({mergeParams: true}); 

router.post('/', auth(endPoint.create), asyncHandler(reviewController.createReview));
router.patch('/:reviewId', auth(endPoint.update), asyncHandler(reviewController.updateReview));



export default router ; 