import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import otpgenerator from "otp-generator";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import jwt from "jsonwebtoken";

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
        throw new ApiError(400, "Otp is not valid, please register again!!")
    }
    
    return res.status(200)
        .json( new ApiResponse(200, "User verified successfully!") )
})

const loginUser = asyncHandler( async (req, res) => {
    
    const {email, password} = req.body
    if(!email || !password){
        throw new ApiError(400, "Enter the details to login")
    }

    const user = await User.findOne({
        email : email
    })
    if(!user){
        throw new ApiError(401, "No user found with these details, Kindly register!")
    }

    const isPasswordValid = await user.checkPassword(password)
    if(!isPasswordValid){
        throw new ApiError(402, "Password is not valid")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        secure : true,
        httpOnly : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( new ApiResponse(200,{user : { loggedInUser, accessToken, refreshToken }}, "User logged in successfully!"))

})

const logoutUser = asyncHandler( async (req, res) => {
    
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset : {refreshToken : 1}
        },
        {
            new : true
        }
    )

    const options = {
        secure : true,
        httpOnly : true
    }

    res.status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json( new ApiResponse(200, {}, "User logged out successfully!") )
})

const newRefreshToken = asyncHandler( async (req, res) => {
    
    const incomingToken = req.cookie?.refreshToken || req.body.refreshToken
    if(!incomingToken){
        throw new ApiError(401, "No refresh token found from user.")
    }

    const decodedToken = await jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError(500, "Something went wrong with token")
    }

    const user = await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(400, "User does'nt have cookies")
    }

    if(incomingToken !== user.refreshToken){
        throw new ApiError(401, "User cannot be authenticated by cookies")
    }

    const options = {
        secure : true,
        httpOnly : true
    }

    const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(user?._id)

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json( new ApiResponse(200, {refreshToken : {accessToken, newRefreshToken}},
          "New refresh token generated successfully!"))
})

const resetPassword =  asyncHandler( async (req, res) => {
    
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(402, "Kindly login to reset the password")
    }

    const isPasswordValid = await user.checkPassword(currentPassword)
    if(!isPasswordValid){
        throw new ApiError(400, "Enter a valid password to change")
    }
    
    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res.status(200)
    .json( new ApiResponse(200, {}, `Password changed from${currentPassword} to ${newPassword} successfully!`) )

})

const getUser = asyncHandler( async (req, res) => {
    
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(402, "Please login to get user")
    }

    return res.status(201)
    .json( new ApiResponse(200, user, "User fetched successfully!"))
})

export { generateOtpforRegistration,
         verifyOtpandRegister,
         loginUser,
         logoutUser,
         newRefreshToken,
         resetPassword,
         getUser
 }