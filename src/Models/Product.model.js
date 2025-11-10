
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { Timestamp } from "mongodb";



const ProductSchema = new mongoose.Schema({
    productName : {
    type : String , 
    required : true ,
    unique : true  
    },
    productDetails :{
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
    productPhoto : {
     type : String , 
     required : true ,
   }



} , {Timestamp : true})

export const Product = mongoose.model("ProductSchema" ,ProductSchema);