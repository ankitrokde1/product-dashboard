let dbConnect = require("../config");
let mongoose = require("mongoose");

let adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("Admin", adminSchema);
