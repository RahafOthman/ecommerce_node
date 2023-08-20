import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import productModel from "../../../../DB/model/Product.model.js";


export const createSubcategory = async(req,res, next)=>{
    
    const { categoryId }= req.params ; 
    const  name  = req.body.name.toLowerCase() ; 

    if(await subcategoryModel.findOne({name})){
        return next(new Error(`Duplicate category ${name}`), {cause: 409});
    }
   
    const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/SubCategory`});
    const subCategory = await subcategoryModel.create({name, slug: slugify(name), image:{secure_url,public_id},
     categoryId, createdBy: req.user._id, updatedBy: req.user._id});

    return res.status(201).json({message:"SubCategory add successfully", subCategory});
}

export const updateSubCategory = async (req, res, next)=> { 
    const {categoryId , subCategoryId } = req.params; 
    const subCategory = await subcategoryModel.findOne({_id: subCategoryId, categoryId});

    if(!subCategory){
        return next(new Error(`invalid category id ${req.params.categoryId}`, {cause:400}));
    }

    if(req.body.name){
        if(subCategory.name == req.body.name){
            return next(new Error(`Old name match new name`, {cause: 400}));
        }
        if(await subcategoryModel.findOne({name: req.body.name})){
            return next(new Error('This name already exist', {cause: 409}));
        }
        subCategory.name = req.body.name; 
        subCategory.slug = slugify(req.body.name);
    }

    if(req.file){
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.APP_NAME}/SubCategory`});
        await cloudinary.uploader.destroy(subCategory.image.public_id);
        subCategory.image = {secure_url, public_id} ; 
    }
    
    subCategory.updatedBy = req.user._id;
    await subCategory.save();
    return res.json({message:`subCategory ${subCategory.name} updated successfully` , subCategory});

}

export const getSpecificSubcategory= async(req,res,next)=>{
    const {categoryId} = req.params; 

    const SubCategories = await subcategoryModel.find({categoryId});

    return res.status(200).json({message:'success', SubCategories});
}

export const getSubCategory = async(req,res,next)=>{

    const SubCategories = await subCategoryModel.find().populate({
        path:'categoryId',
        select: 'name image'
    });
    return res.status(200).json({message:"success", SubCategories});

}

export const getProducts = async(req, res, next)=>{
    const {subCategoryId }= req.params; 
    const products= await subCategoryModel.findById(subCategoryId).populate({
        path:'products',
        select:'name -subCategoryId',
        match: {isDeleted: {$eq:false}},
        populate:{path: 'reviews'}
    });

    return res.status(200).json({message:"success", products});
}

export const deleteSubCategory = async(req, res, next)=>{

    const {subCategoryId} = req.body; 

    await productModel.deleteMany({subCategoryId});

    const subcategry = await subcategoryModel.findByIdAndDelete({_id: subCategoryId});

    if(!subcategry){
        return next(new Error(`This subcategory '${subcategoryId} invalid`, {cause: 400}));
    }
    return res.status(200).json({message:"Subcategory deleted Successfully"});
}























