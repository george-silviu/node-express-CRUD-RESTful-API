//register controller is the place where a request for registering a new account will reach
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  //destructure the body parameters
  const { user, pwd } = req.body;

  //if user or pwd are not provided return a bad requst message
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and password are required" });
  }

  //check for duplicate username in database
  //put .exec() at the end on the query only when using async-await
  const duplicate = await User.findOne({ username: user }).exec();

  //return response 409 - conflict
  if (duplicate) return res.sendStatus(409);

  try {
    //encrypt the password - hash and salt(10 rounds) the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user in database
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    //send response with status 201 - created
    res.status(201).json({ success: `New user ${user} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
