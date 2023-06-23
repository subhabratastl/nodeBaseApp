const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models");

verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  console.log('tokennnnn',token);
  if (!token) {
    let dataResponse={
      status:"false",
      message:"No token provided!",
      responseData:{}
    }
    return res.status(403).send(dataResponse);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    console.log('verifyyyyy');
    if (err) {
      let dataResponse={
        status:"false",
        message:"Unauthorized!",
        responseData:{}
      }
      return res.status(401).send(dataResponse);
    }
    console.log('decodedddd 1st verify..',decoded);
    req.userCode= decoded.data.user_code;
    console.log('decode data....reqqqqq',req.userCode);
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;