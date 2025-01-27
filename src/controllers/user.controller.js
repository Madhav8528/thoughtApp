import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import otpgenerator from "otp-generator";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";

const generateAccessandRefreshToken = async (userId) => {
    
    try {
        
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(401, "Unable to find user of this userId")
        }

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        if(!accessToken || !refreshToken){
            throw new ApiError(400, "Something went wrong while generating access and refresh token")
        }

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave : false })
        
        return { accessToken, refreshToken }

    } catch (error) {
        
        console.log("Something went wrong in token generation!!", error)

    }
}

const generateOtpforRegistration = asyncHandler(async (req, res) => {
    
    const { username, name, email, mobileNumber, password } = req.body

    if([username, name, email, mobileNumber, password].some(
        (itr) => { return itr.trim() === "" })){
        throw new ApiError(502, "Please enter all the details correctly to continue.")
    }
    
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(408, "User already existed")
    }
   

    const otp = otpgenerator.generate(6,
                { digits : true, 
                  upperCaseAlphabets : false,
                  lowerCaseAlphabets : false,
                specialChars : false })
    
    const OTP = await Otp.create({
        email,
        otp
    })
    if(!OTP){
        throw new ApiError(400, "Somethingwent wrong with Otp")
    }

    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "madhavv8528@gmail.com",
            pass : process.env.GMAIL_PASS
        }
    })

    const otpMail = await transporter.sendMail({
        from : "madhavv8528@gmail.com",
        to : email,
        subject : "OTP Verification for DailyThought",
        text : `Your Otp for registration is ${otp}`
    })
    if(!otpMail){
        throw new ApiError(501, "Error while sending Otp to email")
    }


    const user = await User.create(
        {
            username,
            name,
            mobileNumber,
            email,
            password
        }
    )

    const createdUser = await User.findById(user._id).select( "-password -refreshToken" )
    if(!createdUser){
        throw new ApiError(401, "Error while registering user")
    }

    return res.status(200)
    .json( new ApiResponse(200, {createdUser, otpMail}, "This user can now be directed to otp verification"))
})

const verifyOtpandRegister = asyncHandler( async (req, res) => {
    
    const { otp } = req.body
    const { email } = req.params
    if(!otp){
        throw new ApiError(401, "Plaese provide the Otp to verify")
    }

    const otpRecord = await Otp.findOne({
        otp : otp
    })
    //console.log(otpRecord);
    
    if(!otpRecord || !otpRecord.email === email){

        const deletUser = await User.findOneAndDelete({
            email : email
        })
        throw new ApiError(400, "Otp is not valid")
    }
    
    return res.status(200)
        .json( new ApiResponse(200, "User verified successfully!") )
} )


export { generateOtpforRegistration,
         verifyOtpandRegister
 }