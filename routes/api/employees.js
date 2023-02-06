//here we will create a router to handle request that come to the /users path and also demonstrate how a REST API is created with NodeJS and Express
const express = require("express");
//creating a new express router
const router = express.Router();

//importing the usersControlles functions
const employeesControllers = require("../../controllers/employeesController");

//import roles list
const ROLES_LIST = require("../../config/roles_list");

//import middleware that verifies the role of user making the request
const verifyRoles = require("../../middleware/verifyRoles");

//this  router is created to demonstrate how a CRUD operations would look
router
  .route("/")
  .get(employeesControllers.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesControllers.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesControllers.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesControllers.deleteEmployee);

//get an employee by id
router.route("/:id").get(employeesControllers.getEmployee);

module.exports = router;
