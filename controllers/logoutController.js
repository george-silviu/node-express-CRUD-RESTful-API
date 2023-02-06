const User = require("../model/User");

const handleLogout = async (req, res) => {
  //On client also delete the accessToken

  //look for the cookie sent with the request
  const cookies = req.cookies;

  //if we have cookies and then if one of them has 'jwt' key
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content
  }

  //store the refresh token from the cookie
  const refreshToken = cookies.jwt;

  //search for a user with the refresh token in db
  const foundUser = await User.findOne({ refreshToken }).exec();

  //no user found
  if (!foundUser) {
    //we dont found a user but we have a cookie found
    //erase the cookie that was sent
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204); //success - no content
  }

  //delete the refresh token from db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  //clear the cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    //secure: true, //secure : true - only serves on https
  });

  //send status code 204 - No content
  res.sendStatus(204);
};

module.exports = { handleLogout };
