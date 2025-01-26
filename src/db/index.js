import mongoose from "mongoose";
import express from "express";

const app = express()
const db_name = "thoughtApp"

const dbConnect = async () => {
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL} / ${db_name}`)
        console.log(`Database connected with connection host : ${connectionInstance.connection.host}`)  
        
        app.on("error", (error) => {
            console.log("Unexpected error")
            throw error;
        })
    } catch (error) {
        console.log("Error while connecting database", error)
    }
}

export default dbConnect;