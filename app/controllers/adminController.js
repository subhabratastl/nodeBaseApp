const adminModel= require("../models/adminModel.js")
var jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");

var adminController= module.exports ={
    
    initialRole:async function(req,res,next){
        var params=req.body;
        params.createdBy=req.userCode;
        params.updatedBy=req.userCode;
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
        if(params.op_type=="USER_CREATE"){
            adminController.createUser(req,res,next,params);
        }else if(params.op_type=="USER_UPDATE"){
            adminController.updateUserDetails(req,res,next,params);
        }else{
            adminController.getUserList(req,res,next,params);
        }
    },
    createUser: async function(req,res,next,params){
        try{

            // const data = Buffer.from('example data');

            // Pass the data to the appropriate function
           // yourFunction(data);

            // const fse = require('fs-extra')
            // fse.writeFileSync('newfile.txt',req.body.profilePhoto,function(err){
            //     if(err) throw err;
            //     console.log('file created..');
            // })
            //console.log('insert creste userrr...',req.body);
            //let params=req.body;
            //params.createdBy=req.userCode;
            //params.user_code=
            let max=999999;
            let min=100000;
            params.user_codes=Math.floor(Math.random() * (max - min + 1) + min);
            console.log('user codeeee',params);
            let result= await adminModel.createUserDetails(params);
            let insertUserMaster=await adminModel.createUserDetailsMaster(params);
            let dataResponse={
                status:"000",
                message:"Create User Successfully",
                responseData:{
                    data:insertUserMaster
                }
              }
            res.status(200).send(dataResponse)
        }catch(err){
            console.log('create user..',err);
        }
    },

    updateUserDetails:async function(req,res,next,params){
        try{
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

    updateProfileDetails:async function(req,res,next,params){
        try{
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



    siginUser:async function(req,res,next){
        try{
            console.log('signin userssssssss',req.body);
            let params=req.body;
            
            let verifyUser=await adminModel.validatedUser(params)
            if(verifyUser){
                let userData=await adminModel.getUserData(params);
                console.log('userrrrrrrrrrrrrrrr',userData);
                var token = jwt.sign({data:userData[0]}, config.secret, {
                    //expiresIn: 86400, // 24 hours
                  });  
                  let dataResponse={
                    status:"000",
                    message:"signin successfully",
                    responseData:{
                        authToken:token
                    }
                  }
                  console.log('response data after sign in.....',dataResponse);
                  res.status(200).send(dataResponse);
            }else{
                let dataResponse={
                    status:false,
                    message:"Authentication failed",
                    responseData:{}
                  }
                res.status(401).send(dataResponse);
            }
        }catch(err){
            console.log('signin error',err);
        }
    },

    getUserList:async function(req,res,next,params){
        try{
            //let params=req.body;
            
            let result=await adminModel.getAllUserList(params);
            let totalRecords=await adminModel.getTotalCount();
            console.log('totalCount...',totalRecords)
            let dataResponse={
                status:"000",
                message:"get ALL User List",
                responseData:{
                    data:result,
                    num_rows:totalRecords[0].totalRecords
                }
            }
            res.status(200).send(dataResponse);

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

    createRole: async function(req,res,next){
        try{
            let params=req.body;
            params.createdBy=req.userCode;
            
            let result= await adminModel.createRoleDetails(params);
            let dataResponse={
                status:"000",
                message:"Created New Role Successfully",
                responseData:{
                    data:result
                }
              }
            res.status(200).send(dataResponse)
        }catch(err){
            console.log('create Role..',err);
        }
    },

    updateRole: async function(req,res,next,params){
        try{
            params.createdBy=req.userCode;
            let result= await adminModel.updateRoleDetails(params);
            let dataResponse={
                status:"000",
                message:"Updated Role Successfully",
                responseData:{
                    data:result
                }
              }
            res.status(200).send(dataResponse)
        }catch(err){
            console.log('create Role..',err);
        }
    },
}