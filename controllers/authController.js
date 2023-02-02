const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

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

    //everything worked well, allow user acces
    res.json({ success: `User ${user} is logged in.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
