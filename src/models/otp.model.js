import mongoose, { Schema } from "mongoose";


const otpSchema = new Schema({
    email : {
        type : String,
        required : true,
        trim : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        expires : '5m',
        default : Date.now,
        required : true
    }
})

export const Otp = mongoose.model("Otp", otpSchema)