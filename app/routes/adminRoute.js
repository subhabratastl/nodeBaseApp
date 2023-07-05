const controller = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/authJwt");
const router= require("express").Router();

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.use('/api/auth', router);

  router.post(["/signin","/adminApi/signin"],controller.siginUser);
  router.post(["/userSetup","/adminApi/userSetup"],verifyToken,controller.intialUser);
  //router.get("/userDetails",verifyToken,controller.getUserDetails);
  router.post(["/getUserList","/adminApi/getUserList"],verifyToken,controller.intialUser);
  //router.post(["/updateUserDetails","/adminApi/updateUserDetails"],verifyToken,controller.intialUser);
  router.get(["/signout","/adminApi/signout"],verifyToken,controller.signout);

  router.get(["/getAllRole","/adminApi/getAllRole"],verifyToken,controller.getAllRoles);
  router.post(["/roleSetup","/adminApi/roleSetup"],verifyToken,controller.initialRole);
  router.post(["/updateUserStatus","/adminApi/updateUserStatus"],verifyToken,controller.activeDeactiveUser);
  router.post(["/updateRoleStatus","/adminApi/updateRoleStatus"],verifyToken,controller.activeDeactiveRole);

  router.get(["/getUsersCount","/adminApi/getUsersCount"],verifyToken,controller.getUsersCount);
  router.get(["/getGroupUsersCount","/adminApi/getGroupUsersCount"],verifyToken,controller.getGroupWiseUsersCount);
  router.post(["/resource","/adminApi/resource"],verifyToken,controller.initialResource);
  router.get(["/resource","/adminApi/resource"],verifyToken,controller.initialResource);

  router.get(["/subha","/adminApi/subha"],controller.roleWiseAllMenu);

  router.post(["/menuVsRole","/adminApi/menuVsRole"],verifyToken,controller.initalMenuVsRole);
  
  
  module.exports=router;
//};