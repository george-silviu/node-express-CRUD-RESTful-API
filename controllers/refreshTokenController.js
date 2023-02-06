const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  //look for the cookie sent with the request
  const cookies = req.cookies;

  //if we have cookies and then if one of them has 'jwt' key
  if (!cookies?.jwt) {
    return res.sendStatus(401); //Unauthorized
  }

  //store the refresh token from the cookie
  const refreshToken = cookies.jwt;

  //search for a user with the refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();

  //no user found
  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }

  //evaluate the jwt refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    //if an error occurs or found username in db is different from decoded usermame -> forbidden
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); //Forbidden
    }

    const roles = Object.values(foundUser.roles);

    //everything is ok, create a new accessToken
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    //respond with the new accessToken
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
