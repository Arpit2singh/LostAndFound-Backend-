import express from "express"
const app = express();

app.get("/", (req, res) => {
    res.send("hey whatsup arpit");
})

app.listen(8000, () => {
    console.log("app is listening on teh port 8000")
})