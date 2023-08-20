import couponModel from "../../../../DB/model/Coupon.model.js";

export const createCoupon= async(req,res,next)=>{

    const name = req.body.name.toLowerCase();
    let date = new Date(req.body.expireDate);
    let dateNow = new Date();
   
    if(dateNow.getTime() >= date.getTime()){
        return next(new Error('invalid date',{ cause: 400}));
    }
    if(await couponModel.findOne({name})){
        return next(new Error(`Duplicate coupon name`, {cause: 409}));
    }
    date = date.toLocaleDateString();
    const Coupon= await couponModel.create({name, amount: req.body.amount,
        expireDate: date, createdBy: req.user._id, updatedBy: req.user._id});
    return res.status(201).json({message: "success", Coupon });
}

export const updateCoupon= async(req,res, next)=>{
   
    const coupon = await couponModel.findById(req.params.couponId);
    if( !coupon){
        return next( new Error(`invalid coupon id ${req.params.couponId}`, {couse:400}));
    }

    if(req.body.name){
        if(coupon.name == req.body.name){
            return next( new Error(`old name match new name`, {couse:400}));
        }
        if( await couponModel.findOne({name:req.body.name})){
            return next( new Error(`Duplicate coupon name`, {couse:409}));
        }
        coupon.name = req.body.name;
    }
    if(req.body.amount){
        coupon.amount = req.body.amount;
    }
    
    coupon.updatedBy = req.user._id;
    await coupon.save();
    return res.status(200).json({message:"sucess", coupon});
}

export const getCoupon = async (req,res,next)=>{
    const coupons = await couponModel.find();
    return res.status(200).json({message:"success", coupons});
}

export const getSpecificCoupon = async(req,res,next)=>{
    const {couponId} = req.params; 

    const coupon = await couponModel.findById(couponId);

    return res.status(200).json({message:'success', coupon});
}

export const deleteCoupon = async(req, res,next)=>{
    const {couponId}= req.body ; 
    const coupon = await couponModel.findByIdAndDelete({_id: couponId});
    if(!coupon){
        return next(new Error(`This coupon ${coupon} invalid`, {cause: 400}));
    }
    return res.status(200).json({message:"This coupon deleted Successfully"});
}