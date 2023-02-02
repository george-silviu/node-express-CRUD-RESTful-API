//in user controller we handle the busines logic

const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  //map a new user data object
  const newUser = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
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
  data.setEmployees([...data.employees, newUser]);

  //return response with 201 status and all employees
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.employees.find((user) => user.id === parseInt(req.body.id));

  //if no user found send bad request message
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID: ${req.body.id} not found.` });
  }

  //if username and password were sent in the req body change the values in data json
  if (req.body.username) user.username = req.body.username;
  if (req.body.password) user.password = req.body.password;

  //we filter all employees and keep all, minus the one extracted earlier
  const filteredemployees = data.employees.filter(
    (user) => user.id !== parseInt(req.body.id)
  );

  //we add the newly updated user in an unsorted array
  const unsortedemployees = [...filteredemployees, user];

  //we update the employees data json and sort in asc order
  data.setEmployees(
    unsortedemployees.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  //sending the employees json as a response
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.employees.find((user) => user.id === parseInt(req.body.id));

  //if no user found send bad request message
  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID: ${req.body.id} not found.` });
  }
  //we filter all employees and keep all, minus the one extracted earlier
  const filteredemployees = data.employees.filter(
    (user) => user.id !== parseInt(req.body.id)
  );

  //update the employees json with the filtered array
  data.setEmployees([...filteredemployees]);

  //sending the employees json as a response
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  //extract the user with the id specified in the request
  const user = data.employees.find(
    (user) => user.id === parseInt(req.params.id)
  );

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
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
