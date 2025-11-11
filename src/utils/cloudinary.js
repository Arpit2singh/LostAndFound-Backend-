import { v2 as cloudinary } from "cloudinary";
import fs from "fs" 


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME , 
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_SECRET ,
})

const uploadCLoudinary = async(localPath)=>{
    console.log(localPath) ; 
    try {
        const uploadResult = await cloudinary.v2.uploader.upload(localPath , {
        public_id : "sds" , 
        resource_type : "auto"
    })

    console.log("file has been uploaded successfully") ;
    return uploadResult
    } catch (error) {
        console.error("failed while uploading on cloudinary " , error.message) ; 

        if(fs.existsSync(localPath)){  
        fs.unlinkSync(localPath) ; 
        }
        return -1 ; 
    }
};

export default uploadCLoudinary