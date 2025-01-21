import express from "express";
import dotenv from "dotenv";

dotenv.config(
    { src : "./.env" }
)

const app = express()

app.listen(process.env.PORT || 7000, () => {
   console.log(`App is listening on port : ${process.env.PORT || 7000}`);
})

export { app };