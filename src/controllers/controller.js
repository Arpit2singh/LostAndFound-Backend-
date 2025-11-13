import { User } from "../Models/User.model.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadCLoudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";


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


export  {GenerateAcessAndRefreshToken , registerUser} ; 