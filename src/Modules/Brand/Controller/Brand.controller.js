import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const createBrand= async(req,res,next)=>{
    const {categoryId} = req.body; 
    const  name  = req.body.name.toLowerCase();
    
    if(await brandModel.findOne({name})){
        return next(new Error(`Duplicate brand name`, {cause: 409}));
    }

    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{ foler: `${process.env.APP_NAME}/brand` });

    const brand= await brandModel.create({name, image:{secure_url,public_id}, categoryId, createdBy: req.user._id, updatedBy: req.user._id});
    return res.status(201).json({message: "success", brand });
}

export const updateBrand= async(req,res, next)=>{
   
    const brand = await brandModel.findById(req.params.brandId);
    if( !brand){
        return next( new Error(`invalid coupon id ${req.params.brandId}`, {couse:400}));
    }

    if(req.body.name){
        if(brand.name == req.body.name){
            return next( new Error(`old name match new name`, {couse:400}));
        }
        if(await brandModel.findOne({name:req.body.name})){
            return next( new Error(`Duplicate coupon name`, {couse:409}));
        }
        brand.name = req.body.name;
    }
   
    if(req.file){
        const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/brand`});
        await cloudinary.uploader.destroy(brand.image.public_id);
        
        brand.image = {secure_url,public_id};
    }
  
    brand.updatedBy = req.user._id;
    await brand.save();
    return res.status(200).json({message:"sucess", brand});
}

export const getAllBrands = async(req,res,next)=>{

    const {categoryId} = req.params; 

    const brands = await brandModel.find({categoryId});

    return res.status(200).json({message:'success', brands});
}

export const DeleteBrand = async(req,res,next)=>{
    const {brandId} = req.body; 

    await productModel.deleteMany({ brandId });
    const deletedBrand= await brandModel.findByIdAndDelete({_id: brandId});

    if(!deletedBrand){
        return next(new Error('This Brand inValid', {cause: 400}));
    }
    return res.status(200).json({message:"Brand Deleted Successfully"}); 
}