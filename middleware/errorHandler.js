const { logEvents } = require("../middleware/logEvents");

//error handler middleware ensures that if we get an error, the server notifies the client about it
const errorHandler = (err, req, res, next) => {
  //writing the error caught on an errorLog.txt file
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  //logging the error stack
  console.error(err.stack);
  //send a server error with a message that will be displayed in the browser
  res.status(500).send(err.message);
};

module.exports = { errorHandler };
