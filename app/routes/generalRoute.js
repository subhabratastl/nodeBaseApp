const controller = require("../controllers/generalController");
const { verifyToken } = require("../middlewares/authJwt");
const router= require("express").Router();


  

//   router.post("/signin",controller.siginUser);
//   router.get("/signout",controller.signout);

  router.post(["/updateProfileDetails","/generalApi/updateProfileDetails"],verifyToken,controller.updateProfileDetails);
  router.post(["/passwordUpdate","/generalApi/passwordUpdate"],verifyToken,controller.updatePassword);
  router.get(["/getProfileDetails","/generalApi/getProfileDetails"],verifyToken,controller.getProfileDetails);
  router.post(["/forgetPassword","/generalApi/forgetPassword"],controller.forgetPaswrd);

  router.get(["/getRoleMenu","/generalApi/getRoleMenu"],verifyToken,controller.getMenu);
  
  module.exports=router;
