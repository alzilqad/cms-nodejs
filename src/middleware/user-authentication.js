require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send("Token is not matched");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).send("Token is not valid");
      req.user = user;
      next();
    });
  },

  authenticateRefreshToken: (token) => {
    if(token == null) return false
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
      if (error) return false;
      else return true;
    });
  },

  generateAccessToken: (sess) =>
    jwt.sign(sess, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" }),

  generateRefreshToken: (sess) =>
    jwt.sign(sess, process.env.REFRESH_TOKEN_SECRET),
};
