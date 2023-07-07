const controller = require("../controllers/menuController");
const { verifyToken } = require("../middlewares/authJwt");
const router= require("express").Router();

router.post(["/menuSetup","/menuApi/menuSetup"],verifyToken,controller.initialMenu);
router.get(["/getMenuData","/menuApi/getMenuData"],verifyToken,controller.getMenuDataForDropdown);

module.exports=router;