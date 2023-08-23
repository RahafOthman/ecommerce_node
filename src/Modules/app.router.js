
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from './Category/Category.router.js';
import CouponRouter from './Coupon/Coupon.router.js';
import BrandRouter from './Brand/Brand.router.js';
import ProductRouter from './Product/Product.router.js';
import CartRouter from './Cart/Cart.router.js';
import OrderRouter from './Order/Order.router.js';
import cors from 'cors';


import path from 'path'; 

import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');


 
const initApp=(app,express)=>{
    connectDB();
    app.use(express.json());
    app.use('/logo',(express.static('logo.png')))
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/category', CategoryRouter);
    app.use('/coupon', CouponRouter );
    app.use('/brand', BrandRouter );
    app.use('/product', ProductRouter );
    app.use('/cart', CartRouter );
    app.use('/order', OrderRouter );


    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;

//  //  app.use(async(req,res,next)=>{
    //    console.log(req.header('origin'));
    //    var whitelist = ['http://127.0.0.1:3000', 'http://example2.com'];
   //     if(!whitelist.includes(req.header('origin'))){
    //        return next( new Error('invalid origin', {cause: 403}));
    //    }
    //    next();
   // })
   

    //app.use(cors());