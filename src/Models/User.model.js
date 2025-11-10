
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { Timestamp } from "mongodb";
import jwt from "jsonwebtoken"


const UserSchema = new mongoose.Schema({
    username : {
    type : String , 
    required : true ,
    unique : true  
    },
    password :{
        type : String , 
        required : true ,   
    },
    fullname : {
        type : String , 
        required : true ,
    },
    phoneNo :{
        type : Number ,
        required :true  
    },
    email :{
        type : String , 
        required :true , 
        unique :true,
    }, 
    avatar : {
     type : String , 
     required : true ,
   },
    refreshToken:{
        type : String ,
    }



} , {Timestamp : true})


UserSchema.pre("save" , async function(next){
if(!this.isModified("password")) return next() ; 
this.password = await bcrypt.hash(this.password , 10 ) ; 
next() ;
})

UserSchema.methods.isPasswordCorrect(async function(password){
       return await bcrypt.compare(password , this.password) ;  
})

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id , 
            username : this.username , 
            email : this.email ,
            fullname : this.fullname
        },
        process.env.REFRESHTOKEN  , 
        {
             expiresIn : process.env.REFRESH_TOKEN_EXPIRY ,
        }
    )
}

UserSchema.methods.generatesAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id
        } , 
        process.env.ACCESSTOKEN , 
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" ,UserSchema);