import { registerUser , Login } from "../controllers/controller.js";

import { Router } from "express";
import upload from "../Middleware/multer.middleware.js";

const router = Router() ; 
router.route("/register").post( upload.fields([{name : "avatar" , maxCount : 1 }]) , registerUser) ;    
router.route("/Login").post(Login)
export default router ;     