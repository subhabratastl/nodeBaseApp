// const userController = require("../controllers/userController");
// const { verifyToken } = require("../middlewares/authJwt");
// const router= require("express").Router();

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.use('/api/auth', router);

//   //router.get("/userDetails",verifyToken,userController.getUserDetails);
//   router.put("/userUpdate",verifyToken,userController.updateUserDetails);
// };