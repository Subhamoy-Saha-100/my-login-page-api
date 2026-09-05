const bcrypt = require("bcrypt");
const db = require("../config/db");

const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    res.json({
      message: "Data received successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  register
};