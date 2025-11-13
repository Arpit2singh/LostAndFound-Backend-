import { User } from "../Models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken" 
// import dotenv from "dotenv" 

// dotenv.config({
//     path: "./.env"
// })


const verifyJWT = asyncHandler(async(req ,res ,next)=>{
 try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "") ; 
       if(!token){
           throw new ApiError(401 , "Unauthorized Request") ; 
       }
       console.log(process.env.ACCESSTOKEN , "hey jj")
       const decodeToken = jwt.verify(token , process.env.ACCESSTOKEN)  ; 
       const user = await User.findById(decodeToken?._id).select("-password -refreshToken") ; 
       if(!user){
           throw new ApiError(401 , "Invalid Access Token") ; 
       }
       req.user = user ; 
   
       next()
 } catch (error) {
    throw new ApiError(401 , error?.message || "jwt middleware error") ;
 }
})

export default verifyJWT