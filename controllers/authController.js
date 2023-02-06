const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  //destructure the body parameters
  const { user, pwd } = req.body;

  //if user or pwd are not provided return a bad requst message
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and password are required" });
  }

  //find the user that sends the request in db
  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }

  try {
    //evaluate sent pasword
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (!match) {
      return res.sendStatus(401); //Unauthorized
    }

    //get the roles values codes inside the roles variable
    const roles = Object.values(foundUser.roles);

    //create JWTs
    //generate user accessToken
    //dont pass passwords in token payload
    //we also store user role codes with the payload
    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5min" }
    );

    //generate user refreshToken
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //save refresh token with current user in database that will help us to create a logout route and invalidate the token
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //send the refreshToken as a httpOnly cookie - not available to JS
      sameSite: "None", //enable requests from domains with other address than server address
      //secure: true, //secure : true - only serves on https !when working with POSTMAN or other rest api request service this option must be commented; It should be uncommented when working with chrome or in production
      maxAge: 24 * 60 * 60 * 1000, //1 day in ms
    });

    //send the refreshToken and accessToken to user
    //store accessToken in application memory for security
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
