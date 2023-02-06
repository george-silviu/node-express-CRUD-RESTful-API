// middleware that verifies roles of the user that sends requests to our server

//pass in as many parameters as we want
const verifyRoles = (...allowedRoles) => {
  //return a middleware function
  return (req, res, next) => {
    //if we do not have a request OR if we have a request it must have roles
    if (!req?.roles) {
      return res.sendStatus(401); //Unauthorized
    }

    //grab the roles from request
    const rolesArray = [...allowedRoles];

    // console.log(rolesArray);
    // console.log(req.roles);

    //map creates a new array; for each role in the req check to see if there is one in the rolesArray, if it is return TRUE, else return FALSE
    const result = req.roles
      .map((role) => rolesArray.includes(role)) //result = [true, true false]
      .find((value) => value === true); //we need 1 true false in the result to know that the user can access the route

    if (!result) {
      //if we did not found any role
      return res.sendStatus(401); //Unauthorized
    }

    //user have access to this route, go on to the next handler
    next();
  };
};

module.exports = verifyRoles;
