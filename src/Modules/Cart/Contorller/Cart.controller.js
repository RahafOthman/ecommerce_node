import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";

export const addProductsToCart = async(req,res,next)=>{
    const {productId, qty} = req.body ; 
   
    const product = await productModel.findById(productId);
    if(!product){
        return next(new Error('product not found',{cause: 400}));
    }
    if(product.stock < qty ){
        return next(new Error('invalid product quantity', {cause : 400}));
    }
    const cart = await cartModel.findOne({userId: req.user._id});
    if(!cart){
        const newCart = await cartModel.create({userId:req.user._id, products:[{productId, qty}]});
        return res.json({message:"success", newCart})
    }

    let ProductsMatch = false; 
    for( let i=0; i< cart.products.length; i++){
        if(cart.products[i].productId.toString() === productId){
            cart.products[i].qty = qty ; 
            ProductsMatch = true;
            break;
        }
    }
    if(!ProductsMatch){
        cart.products.push({productId, qty});
    }

    await cart.save();
    
    return res.status(200).json({message:'success', cart});
    
}

export const deleteProductsFromCart= async (req, res, next)=>{

    const {productIds} = req.body ; 

    const cart = await cartModel.updateOne({userId:req.user._id},{
        $pull:{
            products:{productId:{$in:productIds}},
        }
    });

    return res.status(200).json({message: "The Product Successfully Deleted Form Cart", cart});
}

export const clearCart = async(req,res,next)=>{

    const clearCart = await cartModel.updateOne({userId: req.user._id},{
        products: [],
    });

    return res.status(200).json({messgae: "success",clearCart});
}

export const getCart = async(req,res,next)=>{

    const cart = await cartModel.findOne({userId: req.user._id});
    return res.status(200).json({messgae: "success",cart});
}