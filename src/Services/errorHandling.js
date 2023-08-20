
export const asyncHandler = (fn)=>{
    return(req, res, next)=>{
        fn(req,res,next).catch(err=>{
           return next(new Error(err,{cause:500}));
        })
    }
}

export const globalErrorHandel = (err,req,res,next)=>{
    if(err){
        if(process.env.MOOD =='Dev'){
            return res.status(err.cause || 500).json({message:"catch error", stack: err.stack});
        }
        return res.status(err.cause || 500).json({message: "error catch"});
    }
}