import { User } from "../Models/User.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadCLoudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const GenerateAcessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId) ; 
        const accessToken =  user.generatesAccessToken() ; 
        const refreshToken =  user.generateRefreshToken() ;
        user.refreshToken = refreshToken ; 
        await user.save({validateBeforeSave : false}) ; 
        return {refreshToken , accessToken }  ;

    } catch (error) {
        throw new ApiError(500 , "something went wrong while generating the token")  ; 
    }
}

// 

const registerUser = asyncHandler(async (req, res)=>{
    // get the details from the frontend  
    // check the details in the database ; 
    // is the user is already exists return the error user already exists  
    // check the files if they exists then 
    //  uplaod it on the cloudinary  
    //  they create the object of the form data uplaod it on the databse with the function name create  
    //  this after uplaoding then check again in the database then  remove the password and refreshToken form the response 
    //  check the user creation 
    // return response 
    
    const {username , password , email , phoneNo , fullname} = req.body ; 
   console.log(username) ;
   console.log(email) ; 
   console.log(password) ; 
   console.log(fullname) ; 
   console.log(phoneNo) ;

     if (username === "") {
      throw new ApiError(101, "userName is empty ")
   }
   if (email === "") {
      throw new ApiError(101, "email is empty ")
   }
   if (password === "") {
      throw new ApiError(101, "password is empty ")
   }
   if (fullname === "") {
      throw new ApiError(101, "fullName is empty ")
   }

   const existedUser = await User.findOne({
    $or : [{username} , {email}] 
   })

   if(existedUser){
    throw new ApiError(401 , "user already exists ") ; 
   }else{
     console.log("user not found proceding the further steps") 

   }

if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
  return res.status(400).json({ message: "Avatar file missing" });
}

const avatarLocalPath = req.files.avatar[0].path;
console.log(avatarLocalPath, "dsn")
   
   if(!avatarLocalPath){
      throw new ApiError(400 , "Avatar file is required avatarlocalpath") ; 
   }
   
    

   const avatar = await uploadCLoudinary(avatarLocalPath) ; 
   
   const user = await User.create({
         fullname  , 
         username , 
         email , 
         phoneNo , 
         password , 
         avatar : avatar.url , 

   })

   const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
   ) ; 

   if(!userCreated){
    throw new ApiError(401 , "user Already exists") ; 

   }

   return res.status(201).json(new ApiResponse(201 , userCreated , "User has been created Successfuly")) ; 


    
})

const Login = asyncHandler(async(req,res)=>{
    const {email ,  password , username} = req.body  ; 
    console.log(email) ; 
    console.log(password) ; 
    console.log(username) ; 
    if(!username || !password) {
      throw new ApiError(401 , "Fields are missing ") ; 

    }
    const checkuser = await User.findOne({
      $or : [{username} , {email}] 
    }) 

    if(!checkuser) {
      throw new ApiError(401  , "user not found") ; 
    }

    const isPasswordcorrect = await checkuser.isPasswordCorrect(password)  ; 
    if(!isPasswordcorrect) {
      throw new ApiError(401 , "Passsword is incorrect") ; 
    }
    else{
       console.log("proceeding with to generate the id and password") ; 
    }

    const {accessToken , refreshToken } = await GenerateAcessAndRefreshToken(checkuser._id) ; 

    const LoggedInuser = await User.findById(checkuser._id).select("-password -refreshToken") ; 
    
    const options = {
      httpOnly : true  , 
      secure : true  ,
    }

    return res.status(201).cookie("accessToken" , accessToken , options).cookie("refreshToken" , refreshToken , options).json(
       new ApiResponse(201 , {
         user : LoggedInuser , accessToken , refreshToken

       } , "user LoggedIn SuccessFully") 
    )

})


const LoggedOut = asyncHandler(async(req ,res)=>{
   const LoggedInuser = await User.findByIdAndUpdate(req.user._id , {
      $set : {
         refreshToken : undefined
      }
   },
   {
      new  : true 
   } 
   )

const options = {
   httpOnly : true  ,
   secure : true  
}

res.status(201).clearCookie("accessToken" , options).clearCookie("refreshToken", options).json(
   new ApiResponse(201 , "Logged Out successfully") 
)
})


const refreshAccessToken = asyncHandler(async(req ,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ; 
   if(!incomingRefreshToken){
      throw new ApiError(401 , "Unauthorized Token , access denied") ; 
   }

   try {
      const decodeToken  =  jwt.verify(incomingRefreshToken , process.env.REFRESHTOKEN)  ;
      const user = await User.findById(decodeToken?._id);  
      const options = {
         httpOnly : true , 
         secure :true  
      }
   
      const {refreshToken , accessToken } = await GenerateAcessAndRefreshToken(user._id) ; 
   
      return res.status(201).cookie("refreshToken" , refreshToken , options).cookies("accessToken" , accessToken , options).json(new ApiResponse(201 , {accessToken , refreshToken : refreshToken} , "accessToken refreshed"))
      
   } catch (error) {
      throw  new ApiError(401 , "invalid refresh token") ;
   }
})



export  {GenerateAcessAndRefreshToken , registerUser , Login , LoggedOut , refreshAccessToken} ; 