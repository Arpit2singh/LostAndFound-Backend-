
import dotenv from "dotenv"
dotenv.config({
    path : "./.env"
})
import express from "express"
import DbLogic from "./Db/Db.js"
import app from "./app.js";


console.log("MONGOURL:", process.env.MONGOURL);
console.log("PORT:", process.env.PORT);




// app.get("/", (req, res) => {
//     res.send("hey whatsup arpit");
// })

DbLogic().then(

    app.listen(process.env.PORT, () => {
        console.log("mongo has been connected ")
        console.log("app is listening on teh port 8000")
    })

).catch((error) => {
    console.error("Failed to start server due to DB connection error:");
    throw error;
})