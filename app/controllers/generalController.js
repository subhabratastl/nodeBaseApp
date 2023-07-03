const generalModel=require('../models/generalModel')
var jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
var nodemailer          = require('nodemailer');
var generalConfig=require("../config/generalConfig.json")
const moment = require('moment');
const otpGenerator = require('otp-generator')




var transporter = nodemailer.createTransport({
    // host: generalConfig.stl_mail_host,
    // port: generalConfig.stl_mail_port,
    // secure: generalConfig.stl_secure, 
    service: 'gmail',
    auth: {
        user: generalConfig.stl_mail_user, 
        pass: generalConfig.stl_mail_pass
    }
});

var generalController=module.exports={
    
    // initalFunction:async function(req,res,next){
    //     var params=req.body;
    //     params.myUserCode=req.userCode;
    //     //params.updatedBy=req.userCode;

    //     if(params.op_type=="EDIT_PROFILE" ){
    //         generalController.updateProfileDetails(req,res,next,params);
    //     }else{
    //         generalController.getProfileDetails(req,res,next,params);
    //     }

    // },
    updateProfileDetails: async function (req, res, next) {

        console.log('update profile....');
        try {
            var params = req.body;
            params.myUserCode = req.userCode;

            console.log('update profile....', params);
            if ('updateProfilePhoto' in params) {
                console.log('if for profile..');
                let resultData = await generalModel.UpdateProfilePhoto(params);
                let result={};
                let finalResult;
                if(resultData.affectedRows==1 || resultData.affectedRows==0){
                    console.log("if case affectedRows...")
                     result = await generalModel.getProfile(params);
                     finalResult={
                         "user_name":result[0].user_name,
                         "profile_photo":result[0].profile_photo
                     }
                     
                }
                console.log('resulttttt...',finalResult);
                let dataResponse = {
                    status: "000",
                    message: "Updated profile details Successfully",
                    responseData: finalResult
                }
                res.status(200).send(dataResponse)
            } else {
                console.log('else for profile..@@@@@@@@@@@@@@@2')
                let result= await generalModel.UpdateProfileDetails(params);
                //console.log() 
                let dataResponse={
                    status:"000",
                    message:"Updated profile details Successfully",
                    responseData:{}
                  }
                res.status(200).send(dataResponse)

            }

        } catch (err) {
            console.log('Update Profile..', err);
        }
    },

    getProfileDetails:async function(req,res,next){
        try{
            var params=req.body;
            params.myUserCode=req.userCode;
            let result=await generalModel.getProfile(params);
            let dataResponse={
                status:"000",
                message:"get User Data",
                responseData:Object.assign({}, ...result)
            }
            res.status(200).send(dataResponse);
        }catch(err){
            console.log("get profile details..",err);
        }
    },

    updatePassword:async function(req,res,next){
        try{
            var params=req.body;
            params.myUserCode=req.userCode;
            // let passwordMatch=await generalModel.getPassword(params);
            // console.log('passweorddddd',passwordMatch[0].password_match);
            // if(params.oldPassword==)
            console.log('password... entry');
                let passwordMatch=await generalModel.getPassword(params);
                if(passwordMatch){
                    let passwordUpdate=await generalModel.passwordUpdate(params); 
                    let dataResponse={
                        status:"000",
                        message:"Password change successfully",
                        responseData:{}
                    }
                    res.status(200).send(dataResponse)
                }else{
                    let dataResponse={
                        status:false,
                        message:"Old password not match with our database"
                      }
                    res.status(200).send(dataResponse)
                    }
            
        }catch(err){
            console.log("Password change..",err);
        }
    },

    forgetPaswrd:async function(req,res,next){
        console.log("forget Password....................");
        try{
            let params=req.body;
            if(params.op_type=='GET_OTP' || params.op_type=='RESEND_OTP'){
                console.log('enterrrrr otp');
                const currentTime = moment();
                const newTime = currentTime.add(5, 'minutes');
                params.expirTime=newTime.format('YYYY-MM-DD HH:mm:ss');
                params.otp=parseInt(otpGenerator.generate(6, { upperCaseAlphabets: false,lowerCaseAlphabets:false ,specialChars: false, }));
                let otpGet=await generalModel.otpSend(params);
                let sendEmail=await generalController.getDataForSendOTPtoEmail(params);
                console.log('sendEmail............',sendEmail);
                let dataResponse={
                    status:"000",
                    message:"OTP Send to your register Email Id",
                    responseData:Object.assign({}, ...sendEmail)
                }
                res.status(200).send(dataResponse)
            }else if (params.op_type=='VERIFY_OTP'){
                console.log('Verify otp');
                console.log('paramsssss....verify',params);
                const verifyOtp=await generalModel.verifyOtpFromMail(params);
                console.log('verify otp after model............',verifyOtp);
                if(verifyOtp[0].Otp_match==1 && verifyOtp[0].expire_status==1){
                    let dataResponse={
                        status:"000",
                        message:"OTP Verified Successfully",
                        responseData:{}
                    }
                    res.status(200).send(dataResponse)
                }else{
                    let dataResponse={
                        status:false,
                        message:"OTP  Not Verified, Please try again",
                        responseData:{}
                    }
                    res.status(200).send(dataResponse)
                }
            }else if (params.op_type=='PASSWORD_CHANGE'){
                console.log('params....',params);
                    await generalModel.passwordUpdate(params)
                    let dataResponse={
                        status:"000",
                        message:"Password change successfully",
                        responseData:{}
                    }
                    res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log('forget password.. ',err);
        }

    },

    getDataForSendOTPtoEmail:async function(params){
        try{
            let result=await generalModel.getDataForEmail(params);
            const mailOptions = {
                from: generalConfig.stl_mail,
                to: result[0].email_id,
                subject: 'STL- OTP Send',
                text: `Test OTP .${params.otp}`
              };

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log('Error:', error);
                  return {success:false,data:'OTP not send'}
                } else {
                  console.log('Email sent:', info.response);
                  return result;
                }
              });
            console.log('email get from DB..',result);
        }catch(err){
            console.log('get data for email',err)
        }
       
    },
    

}