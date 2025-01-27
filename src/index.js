import { app } from "./app.js";
import dbConnect from "./db/index.js";
import dotenv from "dotenv";

dotenv.config(
    { src : "./.env" }
)


dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 7000, ()=>{
        console.log("App is listening on port : ", process.env.PORT);
       })
})
.catch((error)=>{
    console.log(error);
    //throw error 
})