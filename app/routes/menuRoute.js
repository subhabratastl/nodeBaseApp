const controller = require("../controllers/menuController");
const { verifyToken } = require("../middlewares/authJwt");
const router= require("express").Router();

router.post(["/menuSetup","/menuApi/menuSetup"],verifyToken,controller.initialMenu);
//router.get(["/menuSetup","/menuApi/menuSetup"],verifyToken,controller.initialMenu);

module.exports=router;