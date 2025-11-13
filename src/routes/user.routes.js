import { registerUser , Login, LoggedOut } from "../controllers/controller.js";

import { Router } from "express";
import upload from "../Middleware/multer.middleware.js";
import verifyJWT from "../Middleware/auth.middleware.js";

const router = Router() ; 
router.route("/register").post( upload.fields([{name : "avatar" , maxCount : 1 }]) , registerUser) ;    
router.route("/Login").post(Login)
router.route("/Logout").post(  verifyJWT , LoggedOut)
export default router ;     