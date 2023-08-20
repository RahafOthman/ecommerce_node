import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createReview = async(req, res, next)=>{
    const { productId } = req.params;
    const { comment, rating } = req.body ; 
    const order = await orderModel.findOne({
        userId: req.user._id,
        status: 'delivered',
        "products.productId" : productId
    });

    if(!order){
        return next(new Error("You Can't review the product before recevie it ",{cause: 400}));
    }

    const reviewCheck = await reviewModel.findOne({createdBy: req.user._id, productId });
    if(reviewCheck){
        return next(new Error("The Order already reviewed by you", {cause: 400}));
    }

    const review = await reviewModel.create({
        createdBy: req.user._id,
        orderId: order._id,
        productId,
        comment,
        rating
    });

    return res.status(200).json({message: "The product reviewed successfully", review});
}

export const updateReview = async(req, res, next)=>{

    const {productId, reviewId} = req.params; 
    
    const updatedReview = await reviewModel.findByIdAndUpdate({_id: reviewId,productId, createdBy: req.user._id},req.body,
        {new:true});
    return res.json({message:"review updated successfully", updatedReview});

}