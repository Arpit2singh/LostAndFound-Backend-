import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name:{
        type : String , 
        required : true ,
    },
    description:{
        type : String , 
        required : true ,
    },
    LostDate:{
        type : String , 
        required : true ,
    },
    LostLocation:{
        type : String , 
        required : true ,
    },
    ProductPhoto:{
        type : String , 
        required : true ,
    }

})

export const Product = mongoose.model("Product" , ProductSchema)