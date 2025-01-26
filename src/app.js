import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config(
    { src : "./.env" }
)

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({ limit : "20kb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended : true, limit : "20kb" }))

app.listen(process.env.PORT || 7000, () => {
   console.log(`App is listening on port : ${process.env.PORT || 7000}`);
})

export { app };