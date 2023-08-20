import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../Services/errorHandling.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";

export const roles = {
    Admin: 'Admin',
    User: 'User'
}
export const auth =(accessRoles=[])=>{
    return asyncHandler(async (req,res,next)=>{
        const {authorization} = req.headers;
    

        if(!authorization?.startsWith(process.env.BEARERKEY)){
            return next(new Error (`invalid bearer key`, {cause: 400}));
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        if(!token){
            return next(new Error (`invalid token`, {cause: 400}));
        }
        const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
       
        if(!decoded){
            return next(new Error (`invalid token payload`, {cause: 400}));
        }
        const authUser = await userModel.findById(decoded.id).select("userName email role changePasswordTime");
        if(!authUser){
            return next(new Error (`not register account`, {cause: 401}));
        }
        if(!accessRoles.includes(authUser.role)){
            return next(new Error(`not authorized user`, {cause: 403}))
        }
       /**/ 
        if(parseInt(authUser.changePasswordTime?.getTime()/1000) > decoded.iat){
            return next(new Error('expired token, please login'), {cause: 400});
        }
      /**/
        req.user= authUser;
        return next();
    })
} 
   




