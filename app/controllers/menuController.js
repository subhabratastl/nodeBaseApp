const menuModel= require("../models/menuModel")
var jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const sessionSecret=require("../config/authConfig")

var menuController= module.exports ={

    initialMenu:async function(req,res,next){
        var params=req.body;
        params.myUserCode=req.userCode;
        if (params.op_type=="CREATE_MENU"){
            menuController.createMenu(req,res,next,params);
        }else if(params.op_type=="UPDATE_MENU"){
            menuController.updateMenu(req,res,next,params);
        }else{
            menuController.getAllMenu(req,res,next,params);
        }
    },

    createMenu:async function(req,res,next,params){
        try{
            console.log("inside create Menu")
            let result = await menuModel.menuCreateModel(params);
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
            console.log('error create menu..',err)
        }
    },

    getAllMenu:async function(req,res,next,params){
        try{
            console.log("get All Menu...@@@@@@@@@@2",params);
            let result=await menuModel.menuGetAllModel(params);

            console.log('get ALL Menu...###########333',result);

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
            console.log('error get All Menu..',err);
        }
    },

    updateMenu:async function(req,res,next,params){
        try{
            let result=await menuModel.menuUpdateModel(params);
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
            console.log('error update Menu..',err); 
        }
    }

}