//here we will create a router to handle request that come to the /users path and also demonstrate how a REST API is created with NodeJS and Express
const express = require("express");
//creating a new express router
const usersRouter = express.Router();

//importing the usersControlles functions
const usersControllers = require("../../controllers/usersController");

//this  router is created to demonstrate how a CRUD operations would look
usersRouter
  .route("/")
  //get users
  .get(usersControllers.getAllUsers)
  //create new user
  .post(usersControllers.createNewUser)
  //update a user
  .put(usersControllers.updateUser)
  //delete a user by id
  .delete(usersControllers.deleteUser);

//get an employee by id
usersRouter.route("/:id").get(usersControllers.getUser);

module.exports = usersRouter;
