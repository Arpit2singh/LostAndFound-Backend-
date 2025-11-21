import { Product } from "../Models/Product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadCLoudinary from "../utils/cloudinary.js";

const AddProduct = asyncHandler(async (req, res) => {
    const { name , description, LostDate, LostLocation, ContactNo } = req.body;
    console.log(name);
    console.log(description);
    console.log(LostDate);
    console.log(LostLocation);
    console.log(ContactNo);
     // frontend updated but not able to upload 
    if (name === "") {
        throw new ApiError(101, "Name is empty ")
    }
    if (description === "") {
        throw new ApiError(101, "description is empty ")
    }
    if (LostDate === "") {
        throw new ApiError(101, "LostDate is empty ")
    }
    if (LostLocation === "") {
        throw new ApiError(101, "LostLocation is empty ")
    }
    if (ContactNo === "") {
        throw new ApiError(101, "ContactNo is empty ")
    }
    
    if(!req.files || !req.files.ProductPhoto[0] || !req.files.ProductPhoto){
        throw new ApiError(401 , "ProductPhoto  local path not found ")
    }

    const localPath = req.files.ProductPhoto[0].path ; 
    const ProductPhotoUrl = await uploadCLoudinary(localPath)  ; 

    if(!ProductPhotoUrl){
        throw new ApiError(401,"Product image not been uploaded") ;
    }

    const Productdata = await Product.create({
        name , 
        description ,
        LostDate ,
        LostLocation,
        ContactNo,
        ProductPhoto : ProductPhotoUrl.url ,
    })
    
     if(!Productdata){
             throw new ApiError(401 , "Product data not been uploaded ") ; 
     }

     const checkData = await Product.findOne({
        $or : [{ContactNo},{name}]
     }) ; 

     if(!checkData){
        throw new ApiError(401 , "data is not been created inside the db ") ; 

     }
     

     return res.status(201).json(new ApiResponse(201 , checkData  , "Data successfully Uplaoded")) ; 

})


const deleteProduct = asyncHandler(async(req , res)=>{
    const {id} = req.params ; 
    if(!id){
        throw new ApiError(401 , "fields are missing") ;
    }

    const productDeletion = await Product.findByIdAndDelete(id) ; 
  
    if (!productDeletion) {
        throw new ApiError(404, "Product not found or could not be deleted");
    }
    return res
        .status(200)
        .json({ success: true, message: "Product has been deleted" });

})

const updateDetails = asyncHandler(async(req,res)=>{
    const {id} = req.params ; 
    if(!id){
        throw new ApiError(401 , "fields are missing") ;
    }

    const oldProductdetails = await Product.findById(id) ; 
    const {newname , newdescription , newphoneNo} = req.body ;

    oldProductdetails.name = newname ; 
    oldProductdetails.description = newdescription ,
    oldProductdetails.newphoneNo = newphoneNo , 

    await oldProductdetails.save()

    return res.status(201).json(new ApiResponse(201 , "old data has been updated")) ;


})


export {AddProduct , updateDetails , deleteProduct} ; 