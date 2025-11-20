import { registerUser , Login, LoggedOut } from "../controllers/controller.js";

import { Router } from "express";
import upload from "../Middleware/multer.middleware.js";
import verifyJWT from "../Middleware/auth.middleware.js";
import { AddProduct, deleteProduct, updateDetails } from "../controllers/Product.controller.js";

const router = Router() ; 
router.route("/register").post( upload.fields([{name : "avatar" , maxCount : 1 }]) , registerUser) ;    
router.route("/Login").post(Login)
router.route("/Logout").post(  verifyJWT , LoggedOut)
router.route("/AddProduct").post(upload.fields([{name : "ProductPhoto" , maxCount:1}]) ,AddProduct);
router.route("/deleteProduct/:id").delete(deleteProduct)
router.route("/updateDetails/:id").put(updateDetails)
export default router ;     