const express= require("express")
const bodyParser = require('body-parser');
const cors=require("cors")
const dbConnection=require("./app/models/index")
const generalApi=require("./app/routes/generalRoute")
const adminApi=require("./app/routes/adminRoute")
const menuApi=require("./app/routes/menuRoute")
var svgCaptcha = require('svg-captcha');
const session = require('express-session');
const sessionSecret=require('./app/config/authConfig')

const app=express();

const devPORT=3000
const baseUrl = process.env.BASE_URL || `http://localhost:${devPORT}`;
process.env.TZ = 'Asia/Kolkata';

var corsOptions = {
    origin: baseUrl
  };

app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: false}));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});

app.use(session({
  secret: sessionSecret.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use('/api/auth',generalApi);
app.use('/api/auth', adminApi);
app.use('/api/auth', menuApi);

require("./app/routes/adminRoute",adminApi);
require("./app/routes/generalRoute",generalApi);
require("./app/routes/menuRoute",menuApi);

// set port, listen for requests
const PORT = process.env.PORT || devPORT;
app.get("/", (req, res) => {
  console.log("dataaaa...",req.session.captcha);
  res.json({ message: "Welcome to application." });
});

app.get('/api/auth/getCaptcha', function (req, res) {
  const options = {
    size: 4,  // Number of characters in the CAPTCHA text
    charPreset: '1234567890',  // Use only numbers for the CAPTCHA text
  };
  var captcha = svgCaptcha.create(options);
   req.session.captcha = captcha.text;
   console.log('req.session.captcha @@@@@@@@@@@',req.session.captcha);
  //req.session.captcha="Hello"  
  //res.setHeader('Content-Type', 'image/svg+xml');
  let dataResponse={
    status: "000",
    message: "ok",
    responseData: captcha
  }
  res.status(200).send(dataResponse);
  //res.send(captcha.data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  //console.log('baseUrl',baseUrl);
  dbConnection.checkConnection();
});