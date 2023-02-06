require("dotenv").config();
const express = require("express");
//create a new express application
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3663;

//Connect to MongoDB
connectDB();

//custom requests logger middleware
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//3rd party middleware for handling Cross Origin Reource Sharing
app.use(cors(corsOptions));

//built-in middelware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json parsing
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//built-in middleware to serve public static files
app.use(express.static(path.join(__dirname + "/public")));

//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

//from this line bellow all requests will pass through this middleware
app.use(verifyJWT);

app.use("/employees", require("./routes/api/employees"));

//serving the 404 with app.all
app.all("*", (req, res) => {
  //send status code 404
  res.status(404);
  //send a html, or a json or a text based on what the client accepts
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    req.type("txt").send("404 not found");
  }
});

//custom error handling middleware
app.use(errorHandler);

//we listen for requests only if the connection to database is ok
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  //express will listen for requests at provided port
  app.listen(PORT, () => {
    console.log(`Express server is listening at port: ${PORT}`);
  });
});
