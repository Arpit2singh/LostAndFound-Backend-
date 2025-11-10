
import dotenv from "dotenv"
dotenv.config({
    path : "./.env"
})
import cors from "cors" ; 
import express, { urlencoded } from "express"
import DbLogic from "./Db/Db.js";
import cookieParser from "cookie-parser";




const app = express();



app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
    credentials:true ,
}))
app.use(cookieParser()) ; 
app.use(urlencoded({extended : true , limit : "25kb"}))
app.use(express.json({limit:"25kb"}))


//routes import 
import router from "./routes/user.routes.js";

// routes declaration
app.use("/LostFoundApi/v1/users" , router)

export default app;