//register controller is the place where a request for registering a new account will reach

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  //destructure the body parameters
  const { user, pwd } = req.body;

  //if user or pwd are not provided return a bad requst message
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and password are required" });
  }

  //check for duplicate username in database
  const duplicate = usersDB.users.find((person) => person.username === user);

  //return response 409 - conflict
  if (duplicate) return res.sendStatus(409);

  try {
    //encrypt the password - hash and salt(10 rounds) the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //store the new user
    const newUser = {
      username: user,
      password: hashedPwd,
    };

    //add the new user in simulated db
    usersDB.setUsers([...usersDB.users, newUser]);

    //overwrite with new data the json file
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    //log all the data
    console.log(usersDB.users);

    //send response with status 201 - created
    res.status(201).json({ success: `New user ${user} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
