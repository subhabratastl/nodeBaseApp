const express= require("express")
const bodyParser = require('body-parser');
const cors=require("cors")
const dbConnection=require("./app/models/index")
const generalApi=require("./app/routes/generalRoute")
const adminApi=require("./app/routes/adminRoute")

const app=express();
//app.use(bodyParser.json());
const devPORT=3000
const baseUrl = process.env.BASE_URL || `http://localhost:${devPORT}`;
process.env.TZ = 'Asia/Kolkata';
//console.log('baseUrl',baseUrl);
var corsOptions = {
    origin: baseUrl
  };

app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

// parse requests of content-type - application/json
//app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

// app.use(
//   cookieSession({
//     name: "STL-Session",
//     secret: "COOKIE_SECRET", // should use as secret environment variable
//     httpOnly: true
//   })
// );

// routes
//require("./app/routes/adminRoute.js")(app);

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});
app.use('/api/auth',generalApi);
app.use('/api/auth', adminApi);

require("./app/routes/adminRoute",adminApi);
require("./app/routes/generalRoute",generalApi);

// set port, listen for requests
const PORT = process.env.PORT || devPORT;
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  //console.log('baseUrl',baseUrl);
  dbConnection.checkConnection();
});