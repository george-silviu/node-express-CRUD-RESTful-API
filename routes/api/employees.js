//here we will create a router to handle request that come to the /users path and also demonstrate how a REST API is created with NodeJS and Express
const express = require("express");
//creating a new express router
const router = express.Router();

//importing the usersControlles functions
const employeesControllers = require("../../controllers/employeesController");

//this  router is created to demonstrate how a CRUD operations would look
router
  .route("/")
  .get(employeesControllers.getAllEmployees)
  .post(employeesControllers.createNewEmployee)
  .put(employeesControllers.updateEmployee)
  .delete(employeesControllers.deleteEmployee);

//get an employee by id
router.route("/:id").get(employeesControllers.getEmployee);

module.exports = router;
