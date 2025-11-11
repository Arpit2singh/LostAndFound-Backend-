

import mongoose from "mongoose"

import { DbName } from "../constans.js"




const DbLogic = async ()=>{
    try {
        console.log(process.env.MONGOURL)
        console.log(DbName)
       const dbconnection =  await mongoose.connect(`${process.env.MONGOURL}/${DbName}`)

       
      
        console.log("Data base has been connected successfully ") 
       console.log("Host:", dbconnection.connection.host);
        return dbconnection;
       }

    catch (error) {
         console.log("error is occurred in DataBase Connection")
        console.log("not able to execute the Db Logic ") ; 
        throw error  ;
    }
}

export default DbLogic