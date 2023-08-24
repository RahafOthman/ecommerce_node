import moment from "moment/moment.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import createInvoice  from"../../../../src/Services/pdf.js";
import { sendEmail } from "../../../Services/sendEmail.js";

export const createOrder = async(req, res, next)=>{
   
    const {products, address, phoneNumber, paymentType, couponName}= req.body;
    const finalProductsList = [];
    const productIds = [] ; 
    let subTotal = 0 ; 
    if(couponName){

        const coupon = await couponModel.findOne({name:couponName.toLowerCase()});
        if(!coupon){
            return next(new Error('invalid coupon name', {cause: 400}));
        }

        let now = moment();
        let expireDate = moment(coupon.expireDate,'DD/MM/YYYY');
        const diffDate = expireDate.diff(now, 'days');

        if(diffDate <= 0 ){
            return next(new Error('coupon is expired',{cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error('coupon already used',{cause: 400}));
        }

        req.body.coupon = coupon ; 
    }

    for(const product of products){

        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock:{$gte:product.qty},
            isDeleted: false
        });
        if(!checkProduct){
            return next(new Error(`the product invalid ${checkProduct}`,{cause: 400}));
        }

        product.name = checkProduct.name ; 
        product.unitPrice = checkProduct.finalPrice ; 
        product.finalPrice = product.qty * checkProduct.finalPrice ; 
        subTotal += product.finalPrice;
        productIds.push(product.productId);
        finalProductsList.push(product);
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phoneNumber,
        products:finalProductsList,
        subTotal,
        couponId: req.body.coupon?._id,
        paymentType,
        finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount | 0)/ 100 )),
        status: (paymentType == 'card')? 'approved' : 'pending',
        updatedBy: req.user._id
    });

    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}});
    }
    for( const product of products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock: -product.qty}});
    }
   
    await cartModel.updateOne({userId:req.user._id},{
        $pull:{
            products:{productId:{$in:productIds}},
        }
    });
    const invoice = {
        shipping: {
          name: req.user.userName,
          address: "Betunia",
          city: "Ramallah",
        state:"west Bank",
         country: "Palestine"
        },
        items: order.products,
        subTotal,
        total: order.finalPrice,
        invoice_nr: order._id
    };
      
    createInvoice(invoice, "invoice.pdf");
    await sendEmail(req.user.email, 'Ecommerce - invoice', 'welcome', {
      path:'invoice.pdf',
       contentType: 'application/pdf'
    });
    return res.status(201).json({message:'order added successfully',order});
}

export const createOrderWithItemsFromCart = async(req,res,next)=>{

    const { address, phoneNumber, paymentType, couponName}= req.body;
    const finalProductsList = [];
    const productIds = [] ; 
    let subTotal  = 0 ;
    const cart = await cartModel.findOne({userId: req.user._id});
    
    if(!cart?.products?.length){
        return next(new Error("Cart Empty", {cause:400}));
    }
    req.body.products = cart.products ; 
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName.toLowerCase()});

        if(!coupon){
            return next(new Error('invalid coupon name', {cause: 400}));
        }

        let now = moment();
        let expireDate = moment(coupon.expireDate,'DD/MM/YYYY');
      
       // const diffDate = now.diff(expireDate, 'days');
        const diffDate = expireDate.diff(now, 'days');

        if(diffDate <= 0 ){
            return next(new Error('coupon is expired',{cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error('coupon already used',{cause: 400}));
        }
        req.body.coupon = coupon ; 
    }

    for(let product of req.body.products){
      
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock:{$gte:product.qty},
            isDeleted: false
        });
   
        if(!checkProduct){
            return next(new Error(`the product invalid ${checkProduct}`,{cause: 400}));
        }
       

        product = product.toObject();
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.finalPrice ; 
        product.finalPrice = product.qty * checkProduct.finalPrice ; 
        subTotal += product.finalPrice;
        productIds.push(product.productId);
        finalProductsList.push(product);
    }
    

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phoneNumber,
        products:finalProductsList,
        subTotal,
        couponId: req.body.coupon?._id,
        paymentType,
        finalPrice: (subTotal - (subTotal * ((req.body.coupon?.amount | 0)/ 100 ))),
        status: (paymentType == 'card')? 'approved' : 'pending',
        updatedBy: req.user._id
    });

    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}});
    }
    for( const product of  req.body.products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock: -product.qty}});

    }
    
    await cartModel.updateOne({userId:req.user._id},{products:[]});
    return res.status(201).json({message:'order added successfully',order});

};

export const cancelOrder = async(req,res,next)=>{
    const {orderId} = req.params;

    const {resonPreject} = req.body;
    const order = await orderModel.findOne({_id:orderId, userId:req.user._id});
  
    if(!order || order.status != 'pending' || order.paymentType!= 'cash'){
        return next(new Error("can't cancel this order",{cause:400}));
    }
    await orderModel.updateOne({_id:order._id},{status: 'canceled', resonPreject, updatedBy:req.user._id})
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock:product.qty}});
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{$pull:{userBy:req.user._id}});
    }
    return res.status(200).json({message:"Order canceled Successfully"});
}

export const updateOrderStatus = async(req,res,next)=>{
    const {orderId} = req.params;
    const {status} = req.body;
    const order = await orderModel.findOne({_id:orderId});
    if(!order || order.status == 'delivered'){
        return next(new Error(`this order not found or the order status is ${order.status}`,{cause:400}));
    }
    const orderStatus = await orderModel.updateOne({_id:order._id}, {status, updatedBy: req.user._id});

    if(!orderStatus.matchedCount){
        return next(new Error('fail to change status',{cause:400}));
    }
    return res.status(200).json({message:"Order status updated Successfully"});
}