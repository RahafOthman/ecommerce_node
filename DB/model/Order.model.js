import mongoose, { Schema, model, Types } from "mongoose";

const orderSchema= new Schema({
    userId:{
        type:Types.ObjectId, ref:'User',
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    phoneNumber:[{
        type: String,
        required: true,
    }],
    products:[{
        productId:{type:  Types.ObjectId, ref:'Product', required: true},
        name:{type:String, required: true},
        qty:{type:Number, required: true},
        unitPrice:{type:Number, required:true},
        finalPrice:{type:Number, required: true}
    }],
    couponId:{
        type: Types.ObjectId, ref:'Coupon',
    },
    finalPrice:{
        type:Number,
        required: true,
    },
    paymentType:{
        type:String,
        default:'cash',
        enum:['cash','card'],
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending', 'approved', 'onway', 'canceled', 'delivered']
    },
    resonPreject: String,
    note: String,
    subTotal: Number , 
    updatedBy:{type: Types.ObjectId, ref:'User', required: true},

},{
    timestamps:true
});

const orderModel = mongoose.models.Order || model('Order', orderSchema);
export default orderModel ; 
