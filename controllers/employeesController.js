//in user controller we handle the busines logic
const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  //get all employees from db
  const employees = await Employee.find();

  //if no employees respond with 204 - No content
  if (!employees) {
    return res.status(204).json({ message: "No employees found." });
  }

  //respond with employees
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  //check if the first and last name are sent with request
  if (!req?.body.firstname || !req.body.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required." });
  }
  try {
    //create new employee in db
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    //send the result with the new employee created
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  //check to see if the employee id that we want to update is sent
  if (!req?.body.id) {
    res.status(400).jon({ message: "ID parameter is required." });
  }

  //find an employee with the provided id
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  //if no employee found send response 204
  if (!employee) {
    return res
      .status(204) //Successs but No content
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  //if firstname and lastname were sent in the req body change the values in the user data found in db
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  //save the new employee data in database
  const result = await employee.save();

  //sending the query result to the client
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  //check to see if the employee id that we want to update is sent
  if (!req?.body.id) {
    res.status(400).jon({ message: "ID parameter is required." });
  }

  //find the user with the id specified in the request in db
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  //if no employee found send response 204
  if (!employee) {
    return res
      .status(204) //Successs but No content
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  //delete the employee with sent id
  const result = await Employee.deleteOne({ _id: req.body.id });

  //sending the result to the client
  res.json(result);
};

const getEmployee = async (req, res) => {
  //check to see if the employee id that we want to update is sent as parameter
  if (!req?.params?.id) {
    res.status(400).jon({ message: "ID parameter is required." });
  }

  //find the employee with the id specified in the request in db
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  //if no employee found send response 204
  if (!employee) {
    return res
      .status(204) //Successs but No content
      .json({ message: `No employee matches ID ${req.params.id}.` });
  }

  //sending the employee back to the client
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
