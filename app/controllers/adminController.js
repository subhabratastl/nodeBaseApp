const adminModel= require("../models/adminModel.js")
var jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const sessionSecret=require("../config/authConfig")
var cryptoJs = require("crypto-js");

var adminController= module.exports ={
    
    initialRole:async function(req,res,next){
        var params=req.body;
        params.createdBy=req.userCode;
        params.updatedBy=req.userCode;
        params.myRoleCode=req.roleCodeData;
        //console.log("roleeeeeeeeeeeeeeeeeeee",req.body);
        if (params.op_type=="ROLE_CREATE"){
            adminController.createRole(req,res,next);
        }else if(params.op_type=="ROLE_UPDATE"){
            adminController.updateRole(req,res,next,params);
        }
    },

    intialUser:async function(req,res,next){
        var params=req.body;
        params.createdBy=req.userCode;
        params.updatedBy=req.userCode;
        params.myRoleCode=req.roleCodeData;
        if(params.op_type=="USER_CREATE"){
            adminController.createUser(req,res,next,params);
        }else if(params.op_type=="USER_UPDATE"){
            adminController.updateUserDetails(req,res,next,params);
        }else{
            adminController.getUserList(req,res,next,params);
        }
    },

    initialResource:async function(req,res,next){
        var params=req.body;
        params.myUserCode=req.userCode;
        if(params.op_type=="CREATE_RESOURCE"){
            adminController.createResouce(req,res,next,params);
        }else if(params.op_type=="UPDATE_RESOURCE"){
            adminController.updateResouce(req,res,next,params);
        }else{
            adminController.getResouceData(req,res,next,params);
        }
    },

    initalMenuVsRole:async function(req,res,next){
        var params=req.body;
        params.myUserCode=req.userCode;
        if(params.op_type=="ADD_MENU_MAPPING"){
            adminController.addMenuVsRole(req,res,next,params);
        }else if(params.op_type=="UPDATE_MENU_MAPPING"){
            adminController.updateMenuVsRole(req,res,next,params);
        }else{
            adminController.getMenuVsRole(req,res,next,params);
        }
    },
    createUser: async function(req,res,next,params){
        try{
            let max=999999;
            let min=100000;
            params.user_codes=Math.floor(Math.random() * (max - min + 1) + min);
            console.log('user codeeee',params);
            let result= await adminModel.createUserDetails(params);
            if(result.success){
                let insertUserMaster = await adminModel.createUserDetailsMaster(params);
                if(insertUserMaster.success){
                    let dataResponse = {
                        status: "000",
                        message: "Create User Successfully",
                        responseData: {
                            data: insertUserMaster
                        }
                    }
                res.status(200).send(dataResponse)
                }else{
                    let dataResponse = {
                        status: false,
                        message: result.data,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }  
            }else{
                let dataResponse = {
                    status: false,
                    message: result.data,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
            
        }catch(err){
            console.log('create user..',err);
        }
    },

    updateUserDetails:async function(req,res,next,params){
        try{
            console.log('user update...controllerss...',params)
            let result= await adminModel.UserUpdateDetails(params); 
            let dataResponse={
                status:"000",
                message:"Updated user details Successfully",
                responseData:{
                    data:result
                }
              }
            res.status(200).send(dataResponse)
        }catch(err){
            console.log('create Role..',err);
        }
    },

    // updateProfileDetails:async function(req,res,next,params){
    //     try{
    //         console.log("paramssss... update profile",params);
    //         let result= await adminModel.UserUpdateDetails(params); 
    //         let dataResponse={
    //             status:"000",
    //             message:"Updated user details Successfully",
    //             responseData:{
    //                 data:result
    //             }
    //           }
    //         res.status(200).send(dataResponse)
    //     }catch(err){
    //         console.log('create Role..',err);
    //     }
    // },



    // siginUser:async function(req,res,next){
    //     try{

    //         console.log('req.body...',req.body);
    //         let key='STL-2023-REACT-VS-NODE';
    //         let encryptText = req.body.bodyData;

    //         const paramsData = cryptoJs.AES.decrypt(encryptText, key).toString(cryptoJs.enc.Utf8);
    //         const params=JSON.parse(paramsData);
    //         console.log('decrypted....',params);
    //           //return decrypted.toString(CryptoJS.enc.Utf8);
    //         const userCaptcha = params.captcha; // Assuming the user input is submitted in the 'captcha' field
    //         //console.log('user Captcha ####################',req.session,"req.session.captcha",req.session.captcha);
    //         // Compare the user's input with the stored CAPTCHA text
    //         if (userCaptcha === params.sessionCaptcha) {
    //             // CAPTCHA verification successful
    //             // Continue with the login process
    //             //console.log('signin userssssssss', req.body);
                

    //             let verifyUser = await adminModel.validatedUser(params)
    //             if (verifyUser) {
    //                 console.log('verify userssssss......')
    //                 let userData = await adminModel.getUserData(params);
    //                 console.log('userrrrrrrrrrrrrrrr', userData);
    //                 var token = jwt.sign({ data: userData[0] }, config.secret, {
    //                     //expiresIn: 86400, // 24 hours
    //                 });
    //                 let dataResponse = {
    //                     status: "000",
    //                     message: "signin successfully",
    //                     responseData: {
    //                         authToken: token
    //                     }
    //                 }
    //                 console.log('response data after sign in.....', dataResponse);
    //                 const ciperText=JSON.stringify({dataResult:cryptoJs.AES.encrypt(JSON.stringify(dataResponse),key).toString()});
    //                 res.status(200).send(ciperText);
    //             } else {
    //                 let dataResponse = {
    //                     status: false,
    //                     message: "Authentication failed",
    //                     responseData: {}
    //                 }
    //                 const ciperText=JSON.stringify({dataResult:cryptoJs.AES.encrypt(JSON.stringify(dataResponse),key).toString()});
    //                 res.status(200).send(ciperText);
    //                 //res.status(200).send(dataResponse);
    //             }
    //         } else {
    //             let dataResponse = {
    //                 status: false,
    //                 message: "Captcha verification failed, Try again",
    //                 responseData: {}
    //             }
    //             res.status(200).send(dataResponse);
    //             // CAPTCHA verification failed
    //             // Handle the error or display an error message
    //         }
            
    //     }catch(err){
    //         console.log('signin error',err);
    //     }
    // },

    siginUser:async function(req,res,next){
        try{
            let params = req.body;

            const userCaptcha = params.captcha; // Assuming the user input is submitted in the 'captcha' field
            if (userCaptcha === params.sessionCaptcha) {
                let verifyUser = await adminModel.validatedUser(params)
                if (verifyUser) {
                    console.log('verify userssssss......')
                    let userData = await adminModel.getUserData(params);
                    console.log('userrrrrrrrrrrrrrrr', userData);
                    var token = jwt.sign({ data: userData[0] }, config.secret, {
                        //expiresIn: 86400, // 24 hours
                    });
                    let dataResponse = {
                        status: "000",
                        message: "signin successfully",
                        responseData: {
                            authToken: token
                        }
                    }
                    res.status(200).send(dataResponse);
                } else {
                    let dataResponse = {
                        status: false,
                        message: "Authentication failed",
                        responseData: {}
                    }
                    
                    res.status(200).send(dataResponse);
                }
            } else {
                let dataResponse = {
                    status: false,
                    message: "Captcha verification failed, Try again",
                    responseData: {}
                }
                res.status(200).send(dataResponse);
                // CAPTCHA verification failed
                // Handle the error or display an error message
            }
            
        }catch(err){
            console.log('signin error',err);
        }
    },

    getUserList:async function(req,res,next,params){
        try{
            //let params=req.body;
            let result=await adminModel.getAllUserList(params);
            if(result.success){
                let totalRecords=await adminModel.getTotalCount(params);
                if(totalRecords.success){
                    let dataResponse={
                        status:"000",
                        message:"get ALL User List",
                        responseData:{
                            data:result.data,
                            num_rows:totalRecords.data[0].totalRecords
                        }
                    }
                    res.status(200).send(dataResponse); 

                }else{
                    let dataResponse={
                        status:false,
                        message:totalRecords.data,
                        responseData:{}
                    }
                    res.status(200).send(dataResponse);
                }
                
            }else{
                let dataResponse={
                    status:false,
                    message:result.data,
                    responseData:{}
                }
                res.status(200).send(dataResponse);
            }
        }catch(err){
            console.log("get User List controller..",err)
        }
    },

    signout:function(req,res,next){
        try{
            console.log('signout...');
            delete req.headers['authorization'];
            let dataResponse={
                status:"000",
                message:"Sign Out successfully",
                responseData:{}
            }
            res.status(200).send(dataResponse);
         }catch(err){
            console.log(err);
        }
    },

    getAllRoles:async function(req,res,next){
        try{
            let params=req.body;
            params.myRoleCode=req.roleCodeData;
            let result=await adminModel.getAllRoles(params);
            let dataResponse={
                status:"000",
                message:"get ALL Roles Details",
                responseData:{
                    data:result,
                    num_rows:result.length
                }
            }
            res.status(200).send(dataResponse);  

        }catch(err){
            console.log(err);
        }
    },

    createRole: async function (req, res, next) {
        try {
            let params = req.body;
            params.createdBy = req.userCode;
            let result
            if (params.myRoleCode !== 'SADMIN' && params.role_code == 'SADMIN') {
                let dataResponse = {
                    status: false,
                    message: 'Data not inserted Properly',
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            } else {
                result = await adminModel.createRoleDetails(params);


                if (result.success) {
                    let dataResponse = {
                        status: "000",
                        message: result.message,
                        responseData: {
                            data: result.data
                        }
                    }
                    res.status(200).send(dataResponse)
                } else {
                    let dataResponse = {
                        status: false,
                        message: result.message,
                        responseData: {}
                    }
                    res.status(200).send(dataResponse)
                }
            }
        } catch (err) {
            console.log('create Role..', err);
        }
    },

    updateRole: async function(req,res,next,params){
        try{
            params.createdBy=req.userCode;
            let result= await adminModel.updateRoleDetails(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:{
                        data:result.data
                    }
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse={
                    status:false,
                    message:result.message,
                    responseData:{}
                  }
                res.status(200).send(dataResponse)
            }
            
        }catch(err){
            console.log('create Role..',err);
        }
    },
    activeDeactiveUser: async function (req, res, next) {
        try {
            console.log("active and deactive usersss..");
            let params=req.body;
            params.updatedBy = req.userCode;
            await adminModel.updateUserStatus(params);
            let dataResponse = {
                status: "000",
                message: "Updated User Successfully",
                responseData: {}
            }
            res.status(200).send(dataResponse)

        } catch (err) {
            console.log('active deactive ..', err);
        }
    },
    activeDeactiveRole: async function (req, res, next) {
        try {
            console.log("active and deactive Role..");
            let params=req.body;
            params.updatedBy = req.userCode;
            await adminModel.updateRoleStatus(params);
            let dataResponse = {
                status: "000",
                message: "Updated Role Successfully",
                responseData: {}
            }
            res.status(200).send(dataResponse)

        } catch (err) {
            console.log('active deactive ..', err);
        }
    },
    getUsersCount: async function (req, res, next) {
        try {
            console.log('inside getUser Count');
            let result = await adminModel.getUserCountModel();
            let dataResponse = {
                status: "000",
                message: "get Users Count",
                responseData: Object.assign({}, ...result)
            }
            res.status(200).send(dataResponse)
            //console.log('result..getuserCount',result);

        } catch (err) {
            console.log('get User count.', err);
        }
    },
    getGroupWiseUsersCount:async function(req,res,next){
        try{
            console.log('Group Wise count');
            let result= await adminModel.getGroupWiseUsersCountModel();
            let dataResponse = {
                status: "000",
                message: "get Group Wise Users Count",
                responseData: result
            }
            res.status(200).send(dataResponse)
        }catch(err){
            console.log('getGroupWiseUsersCount',err);
        }
    },

    createResouce: async function (req, res, next, params) {
        try {
            console.log('create Resoursessssss....', params);
            let max = 99999;
            let min = 10000;
            params.resourceCode = Math.floor(Math.random() * (max - min + 1) + min);
            console.log('user codeeee', params);
            let result = await adminModel.createResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('get error create resource', err);
        }

    },

    getResouceData: async function (req, res, next, params) {
        try {
            console.log('get resource..', params);
            let result = await adminModel.getResourceModel(params);
            if (result.success) {
                let dataResponse = {
                    status: "000",
                    message: result.message,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }

        } catch (err) {
            console.log('error get Resource data', err);
        }
    },
    updateResouce: async function(req,res,next,params){
        try{
            params.myUserCode=req.userCode;
            let result= await adminModel.updateResouceModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:{}
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log('create Role..',err);
        }
    },
    addMenuVsRole:async function(req,res,next,params){
        try{
            let result=await adminModel.addMenuVsRoleModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:{}
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log("Add menuVsRole..",err);
        }
    },

    getMenuVsRole:async function (req,res,next,params){
        try{
            let result=await adminModel.getRoleVsMenuModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:result.data
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log("getMenuVsRole ::",err)
        }
    },

    updateMenuVsRole:async function (req,res,next,params){
        try{
            console.log('updateMenuVsRole ::::',params)
            let result=await adminModel.updateMenuVsRoleModel(params);
            if(result.success){
                let dataResponse={
                    status:"000",
                    message:result.message,
                    responseData:{}
                  }
                res.status(200).send(dataResponse)
            }else{
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
        }catch(err){
            console.log("getMenuVsRole ::",err)
        }
    },
    

    roleWiseAllMenu: async function (req,res,next,params) {
        try {
            console.log('reqqqqqqqqquesttttt', req.roleCode);
            var params;
            params.roleCode = req.roleCode;
            let result = await roleWiseAllMenuModel(params)
            if (result.success) {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: result.data
                }
                res.status(200).send(dataResponse)
            } else {
                let dataResponse = {
                    status: false,
                    message: result.message,
                    responseData: {}
                }
                res.status(200).send(dataResponse)
            }
            console.log('dataaaaaaaa$$$$$')

        } catch (err) {
            console.log('roleWiseAllMenu ::', err);
        }
    }

}