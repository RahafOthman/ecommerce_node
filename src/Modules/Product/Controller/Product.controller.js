import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import userModel from "../../../../DB/model/User.model.js";
import { pegenation } from "../../../Services/pegenation.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createProduct = async(req, res, next)=>{
    const {price ,discount ,categoryId, subCategoryId, brandId} = req.body; 
    
    const name = req.body.name.toLowerCase();
    if(await productModel.findOne({name})){
        return next(new Error('This product already exist', {cause:409}))
    }
    const checkCategory = await subCategoryModel.findOne({_id:subCategoryId,categoryId}); 
    if(!checkCategory){
        return next(new Error('invalid category or subcategory', {cause:400}));
    }
    const checkBrand = await brandModel.findOne({_id: brandId});
    if(!checkBrand){
        return next(new Error('invalid Brand',{cause: 400}));
    }
    const {secure_url, public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path, {folder: `${process.env.APP_NAME}/Products`});
    const finalPrice = price - (price *( ( discount || 0)/100) );
    const subImages = [];
    if(req.files.subImages){
        for(const file of req.files.subImages){
            const {secure_url, public_id}= await cloudinary.uploader.upload( file.path, {folder: `${process.env.APP_NAME}/Products/subImages`});
            subImages.push({secure_url, public_id});
        }
    }
    
    const product = await productModel.create({name, slug:slugify(name), price, discount, finalPrice, mainImage:{secure_url,public_id}, subImages,
        categoryId, subCategoryId, brandId, 
        createdBy: req.user._id, updatedBy: req.user._id});
    if(!product){
        return next(new Error('fail to add new product', {cause:400}));
    }
    return res.json({message:"Product add successfully",product});
}

export const updateProduct= async(req,res,next)=>{
    const { productId } = req.params;
    const { price, discount, categoryId, subCategoryId, brandId} = req.body ; 
    const product = await productModel.findById(productId);

    if(!product){
        return next(new Error('this product does not exist', {cause: 400}));
    }
 
    if(categoryId && subCategoryId){
        const checkSubcategory = await subCategoryModel.findOne({_id: subCategoryId, categoryId});
        if(checkSubcategory){
            product.categoryId = categoryId;
            product.subCategoryId = subCategoryId ; 
        }else{
            return next(new Error('category ID or subCateory ID not Fount', {cause:400}));
        }
    }else if(subCategoryId){
        const checkSubcategory = await subCategoryModel.findOne({_id: subCategoryId, categoryId: product.categoryId});
        if(checkSubcategory){
            product.subCategoryId = subCategoryId;
        }else{
            return next(new Error('subcategory ID not found',{cause: 400}));
        }
    }

    if(brandId){
        const checkBrand = await brandModel.findById({_id:brandId});
        if(checkBrand){
            product.brandId = brandId;
        }else{
            return next(new Error('Brand ID not fount'));
        }
    }

    if(req.body.name){
        if(product.name == req.body.name){
            return next(new Error(`Old name match new name`, {cause: 400}));
        }
        if(await productModel.findOne({name: req.body.name})){
            return next(new Error('This name already exist', {cause: 409}));
        }
        
        product.name = req.body.name;
        product.slug= slugify(req.body.name);
   
    }
    if(req.body.description){
        product.description = req.body.description;
    }
    if(req.body.stock){
        product.stock = req.body.stock ; 
    }
    if(req.body.colors){
        product.colors = req.body.colors; 
    }
    if(req.body.sizes){
        product.sizes = req.body.sizes ; 
    }
    if(price && discount){
        product.price = price;        
        product.discount = discount;
        product.finalPrice = price - (price *( ( discount || 0)/100) );
    }else if(price){
        product.price = price;
        product.finalPrice = price - ( price * (product.discount / 100));
    }else if(discount){
        product.discount = discount;
        product.finalPrice = product.price - ( product.price * ( (discount) / 100));
    }
   
    if(req.files.mainImage?.length){
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path, {folder: `${process.env.APP_NAME}/Products`});
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        product.mainImage = {secure_url, public_id};
    } 
   
    if(req.files.subImages?.length){
        const subImages = [];
        for(const file of req.files.subImages){

            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder: `${process.env.APP_NAME}/Products/subImages`});
            subImages.push({secure_url,public_id});   
        }
         
        for (const file of product.subImages){
            await cloudinary.uploader.destroy(file.public_id);
        }
        product.subImages = subImages;
    }

    product.updatedBy = req.user._id; 
    const updatedProduct = await product.save();
    if(!updatedProduct){
        return next(new Error('Faild to updated product', {cause: 400}));
    }
    return res.json({message: "Product updated successfully", updatedProduct});
}

export const softDelete = async(req, res, next)=>{
    const { productId } = req.params;
    const product = await productModel.findOneAndUpdate({_id:productId, isDeleted: false}, {isDeleted: true}, {new: true});
    if(!product){
        return next(new Error('product not found', {cause: 400}));
    }
    return res.status(200).json({message:"product successfully deleted", product});
}

export const forceDelete= async(req, res, next)=>{
    const { productId } = req.params;
    await reviewModel.deleteMany({productId});
    const product = await productModel.findOneAndDelete({_id:productId, isDeleted: true});
    if(!product){
        return next(new Error('product not found', {cause: 400}));
    }
   return res.status(200).json({message:"product successfully deleted", product});
}

export const restore = async(req, res, next)=>{
    const { productId } = req.params;
    const product = await productModel.findOneAndUpdate({_id:productId, isDeleted: true}, {isDeleted: false}, {new: true});
    if(!product){
        return next(new Error('product not found', {cause: 400}));
    }
    return res.status(200).json({message:"product successfully restored", product});
}

export const getSoftDeleteProducts = async(req, res, next)=>{

    const products = await productModel.find({isDeleted:true});
    return res.status(200).json({message:"success", products });
    
}

export const getProduct = async(req, res, next)=>{
    const {productId}= req.params; 
    const product= await productModel.findById(productId).populate({
        path:'reviews',
        select: 'comment rating'
    });
    if(!product){
        return next(new Error('product not found',{cause: 400}));
    }

    return res.status(200).json({message:"success", product});
}

export const getProducts = async(req,res,next)=>{
 
    let {page, size} = req.query ; 
    const {skip} = pegenation(page,size);
  
    //fillter 
    const excQueryParams = ['page', 'size', 'sort', 'search'];
    const filterQuery = {...req.query};
    excQueryParams.map(params=>{
        delete filterQuery[params]; 
    });
    const query = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match => `$${match}`));

    const mongoQuery = productModel.find(query).populate('reviews').limit(size).skip(skip).sort(req.query.sort?.replace(',',' '));
    
    //search 
    if(req.query.search){
    const products = await mongoQuery.find({
        $or: [
            {name:{$regex: req.query.search, $options: 'i'}},
            {description:{$regex: req.query.search, $options: 'i'}},
        ]
    });
    req.body.products = products ; 
    }else{
        const products = await mongoQuery ; 
        req.body.products = products ; 
    }

    const products = req.body.products ; 
    if(!products){
        return next(new Error('products not found',{cause: 400}));
    }
    return res.json({message:"success", products});
}

export const addProductToWishList = async(req, res,next)=>{
    const {productId} = req.params; 
   
    const product = await productModel.findById({_id: productId});
    if(!product){
        return next(new Error('This is product in valid', {cause: 400}));
    }
    const user= await userModel.findById({_id:req.user._id});
    user.wishList.push(productId);
    await user.save();
    return res.json(user) ; 
}

export const removeProductFromWishList = async(req, res,next)=>{
    const {productId} = req.params; 
   
    const product = await productModel.findById({_id: productId});
    if(!product){
        return next(new Error('This is product in valid', {cause: 400}));
    }
    const user= await userModel.findById({_id:req.user._id});

    user.wishList.pop(productId);
    await user.save(); 
    return res.json(user) ; 
}
