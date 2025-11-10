
import dotenv from "dotenv"
dotenv.config({
    path : "./.env"
})
import cors from "cors" ; 
import express from "express"
import DbLogic from "./Db/Db.js";




const app = express();



app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
    credentials:true ,
}))

export default app;