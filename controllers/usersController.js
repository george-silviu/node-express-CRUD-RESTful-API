//in user controller we handle the busines logic

const data = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const getAllUsers = (req, res) => {
  res.json(data.users);
};

const createNewUser = (req, res) => {
  //map a new user data object
  const newUser = {
    id: data.users[data.users.length - 1].id + 1 || 1,
    username: req.body.username,
    password: req.body.password,
  };

  //check to see if username and password were provided
  if (!newUser.username || !newUser.password) {
    return res
      .status(400)
      .json({ message: "username and password are required." });
  }

  //add the newUser to the data json
  data.setUsers([...data.users, newUser]);

  //return response with 201 status and all users
  res.status(201).json(data.users);
};

const updateUser = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.users.find((user) => user.id === parseInt(req.body.id));

  //if no user found send bad request message
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID: ${req.body.id} not found.` });
  }

  //if username and password were sent in the req body change the values in data json
  if (req.body.username) user.username = req.body.username;
  if (req.body.password) user.password = req.body.password;

  //we filter all users and keep all, minus the one extracted earlier
  const filteredUsers = data.users.filter(
    (user) => user.id !== parseInt(req.body.id)
  );

  //we add the newly updated user in an unsorted array
  const unsortedUsers = [...filteredUsers, user];

  //we update the users data json and sort in asc order
  data.setUsers(
    unsortedUsers.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  //sending the users json as a response
  res.json(data.users);
};

const deleteUser = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.users.find((user) => user.id === parseInt(req.body.id));

  //if no user found send bad request message
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID: ${req.body.id} not found.` });
  }
  //we filter all users and keep all, minus the one extracted earlier
  const filteredUsers = data.users.filter(
    (user) => user.id !== parseInt(req.body.id)
  );

  //update the users json with the filtered array
  data.setUsers([...filteredUsers]);

  //sending the users json as a response
  res.json(data.users);
};

const getUser = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.users.find((user) => user.id === parseInt(req.params.id));

  //if no user found send bad request message
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID: ${req.params.id} not found.` });
  }
  //sending the extracted user as response
  res.json(user);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
};
