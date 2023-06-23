// const userModel= require("../models/userModel.js")

// var userController= module.exports ={
//     getUserDetails:async function(req,res,next){
//         try{
//             let params=req.body;
            
//             let result=await adminModel.getUserData(params);
//             let dataResponse={
//                 status:"000",
//                 message:"get User Details",
//                 responseData:{
//                     data:result,
//                     num_rows:result.length
//                 }
//             }
//             res.status(200).send(dataResponse);

//         }catch(err){
//             console.log("get User Data controller..",err)
//         }
//     },
// }