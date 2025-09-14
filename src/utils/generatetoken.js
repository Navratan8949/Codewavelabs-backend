const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

console.log("JWT Secret Key:", process.env.JWT_SECRET_KEY);

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY);
  return token;
};

module.exports = generateToken;
