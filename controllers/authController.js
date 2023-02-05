const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  //destructure the body parameters
  const { user, pwd } = req.body;

  //if user or pwd are not provided return a bad requst message
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and password are required" });
  }

  //find the user that sends the request
  const foundUser = usersDB.users.find((person) => person.username === user);

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }

  try {
    //evaluate sent pasword
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (!match) {
      return res.sendStatus(401); //Unauthorized
    }

    //create JWTs
    //generate user accessToken
    //dont pass passwords in token payload
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    //generate user refreshToken
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //save refresh token with current user in database that will help us to create a logout route and invalidate the token

    //1. filer all users that are not logging in
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    //2. add the refresh token to current user
    const currentUser = { ...foundUser, refreshToken };

    //3. create the new users array
    usersDB.setUsers([...otherUsers, currentUser]);

    //4. update the new users file
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    //send the refreshToken as a httpOnly cookie - not available to JS
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
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
