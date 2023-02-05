//this middleware will check that with each req a valid JWT is sent
//apply this to all routes that need protection

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  //grab the authorization header from the requesst
  const authHeader = req.headers["authorization"];

  //if no header sent response - Unauthorized
  if (!authHeader) res.sendStatus(401);

  console.log(authHeader); //Bearer token

  //grab the token from the authHeader
  const token = authHeader.split(" ")[1];

  //verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //Forbidden - we received the token but something was not right with it
    //set the request user as username decoded value
    req.user = decoded.username;
    //let request pass to next middleware
    next();
  });
};

module.exports = verifyJWT;
