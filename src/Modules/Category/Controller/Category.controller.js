import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import { forceDelete } from "../../Product/Controller/Product.controller.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createCategory = async(req,res, next)=>{

    const name = req.body.name.toLowerCase() ; 

    if(await categoryModel.findOne({name})){
        return next(new Error(`Duplicate category ${name}`), {cause: 409});
    }
    const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/Category`});
    const category = await categoryModel.create({name, slug: slugify(name), image:{secure_url,public_id}, createdBy: req.user._id, updatedBy: req.user._id});
    return res.status(201).json({message:"category add successfully", category});
}

export const updateCategory= async(req,res,next)=>{
    const category = await categoryModel.findById(req.params.categoryId);

    if(!category){
        return  next(new Error(`invalid category id ${req.params.categoryId}`, {cause:400}));
    }

    if(req.body.name){
        
        if(category.name == req.body.name){
            return next(new Error(`Old name match new name`, {cause: 400}));
        }
        if(await categoryModel.findOne({name: req.body.name})){
            return next(new Error('This name already exist', {cause: 409}));
        }
        
        category.name = req.body.name;
        category.slug= slugify(req.body.name);
    }

    if(req.file){
        const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/category`});
        await cloudinary.uploader.destroy(category.image.public_id);
        
        category.image = {secure_url,public_id};
    }

    category.updatedBy = req.user._id;
    await category.save();
    return res.json({message:`Category ${category.name} updated successfully` , category});
}

export const getCategory= async(req,res,next)=>{
    
    const category = await categoryModel.findById(req.params.categoryId);

    if(!category){
        return next(new Error('Category not found'));
    }

    return res.status(200).json({message:"success", category});
}

export const getAllCategory = async(req,res,next)=>{
    const categories = await categoryModel.find().populate('subcategory');
    return res.status(200).json({message:"success", categories});
}

export const deleteCategory = async(req, res,next)=>{
    //delete  brand , product , subcategory wich is depends on category id 
    //and delete reviews depends on products includes category id 
      const {categoryId} = req.body;
  
        const products = await productModel.find({categoryId});
        for(let product in products){
            await reviewModel.deleteMany(product.productId);
        }
        await productModel.deleteMany({categoryId}); 
        await brandModel.deleteMany({categoryId}) ; 
        await subCategoryModel.deleteMany({categoryId});
        const category = await categoryModel.findByIdAndDelete({_id:categoryId});

        if(!category){
            return next(new Error('This Category inValid', {cause: 400}));
        }

        return res.status(200).json({message:"Category deleted Successfully"});
}





























