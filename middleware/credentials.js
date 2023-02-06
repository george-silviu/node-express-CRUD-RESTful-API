const allowedOrigins = require("../config/allowedOrigins");

//if we do not set the Access-Control-Allow-Credentials header to true when sending the response we will get an CORS error when trying to make requests with fetch method from frontend
const credentials = (req, res, next) => {
  //get the origin that makes the request from req headers
  const origin = req.headers.origin;

  //set the Access-Control-Allow-Credentials heder to true if our request comes from an allowed origin
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }

  //go to the next middleware
  next();
};

module.exports = credentials;
