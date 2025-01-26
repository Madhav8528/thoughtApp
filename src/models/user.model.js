import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    
    name : {
        type : String,
        required: true,
        trim : true,
        index : true
    },

    username : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        index : true,
        unique : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },

    mobileNumber : {
        type : Integer,
        require : true,
        trim : true,
        unique : true
    },

    password : {
        type : String,
        require : [true, "Password is required"]
    },

    refreshToken : {
        type : String
    },
    
}, 
{ timestamps : true })


userSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.method.checkPassword = async function (password){

    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){

    const payload = {
        _id : this._id,
        username : this.username,
        email : this.email,
        name : this.name
    }

    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY

        }
    )
}

userSchema.method.generateRefreshToken = function(){
    const payload = {
        _id : this._id
    }

    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)