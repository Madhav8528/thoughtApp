import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";



const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({ limit : "20kb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended : true, limit : "20kb" }))




//routes for controllers

import userRoutes from "./routes/user.routes.js";
import thoughtRoutes from "./routes/thought.routes.js";

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/thought", thoughtRoutes)

export { app };