const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    //if the domain that made the request to our server is in the allowedOrigins list we let it have acces OR (in development) we dont have an origin
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //no error and origin is allowed
      callback(null, true);
    } else {
      //we have an CORS errow
      callback(new Error("Not allowed by CORS."));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
