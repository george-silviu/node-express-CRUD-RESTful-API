const mongoose = require("mongoose");

//create a new mongoose schema
const Schema = mongoose.Schema;

//define the employees schema
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
