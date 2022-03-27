const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");
const { validationResult } = require("express-validator");
const userAuthenticate = require("../middleware/user-authentication");
const { generateAccessToken } = require("../middleware/user-authentication");

module.exports = {
  // get all user list
  getUserList: (req, res) => {
    UserModel.getUserList((users) => {
      res.send(users);
    });
  },

  // get user by id
  getUserById: (req, res) => {
    UserModel.getUserById(req.params.id, (users) => {
      res.send(users);
    });
  },

  // create new user
  createUser: async (req, res) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10); // hashed password
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      // error messages
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      // check if all the information is provided
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        res.send(400).send({
          success: false,
          message: "Please Provide All Information",
        });
      } else {
        // check if username is unique
        UserModel.getUserByUsername(req.params.id, req.body.name, (user) => {
          if (Object.keys(user).length === 0) {
            // create user information
            const user = new UserModel(req.body);
            UserModel.createUser(user, (user) => {
              res.send({
                status: true,
                message: "User Information Successfully Recorded",
                data: user.insertId,
              });
            });
          } else {
            res
              .status(400)
              .send({ success: false, message: "Username is taken" });
          }
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  // update user by id
  updateUser: async (req, res) => {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
      req.body.password = await bcrypt.hash(req.body.password, 10); // hashed password
      console.log(req.body.password);
      // error messages
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      // check if all the information is provided
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        res
          .status(400)
          .send({ success: false, message: "Please Provide All Information" });
      } else {
        // check if username is unique
        UserModel.getUserByUsername(req.params.id, req.body.name, (user) => {
          if (Object.keys(user).length === 0) {
            // update user information
            const user = new UserModel(req.body);
            UserModel.updateUser(req.params.id, user, (user) => {
              res.send({
                status: true,
                message: "User Information Successfully Updated",
                data: user.insertId,
              });
            });
          } else {
            res
              .status(400)
              .send({ success: false, message: "Username is taken" });
          }
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  // delete user by id
  deleteUser: (req, res) => {
    UserModel.deleteUser(req.params.id, (user) => {
      res.send({
        status: true,
        message: "User Information Successfully Deleted",
        data: user.insertId,
      });
    });
  },

  // login user
  authenticateUser: (req, res) => {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      // error messages
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      // check if all the information is provided
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        res
          .status(400)
          .send({ success: false, message: "Please Provide All Information" });
      } else {
        // check if username is unique
        UserModel.authenticateUser(req.body.name, async (user) => {
          //check user exists
          if (Object.keys(user).length === 0) {
            res.status(400).send({
              success: false,
              message: "User doesn't exist",
            });
          } else {
            if (await bcrypt.compare(req.body.password, user[0].password)) {
              // if authentication is successful
              const sess = {
                id: user[0].id,
                name: user[0].name,
                type: user[0].type,
                status: user[0].status,
              };

              const accessToken = userAuthenticate.generateAccessToken(sess); // create access token
              const refreshToken = userAuthenticate.generateRefreshToken(sess); // create refresh token

              // update refresh token in the database
              UserModel.updateRefreshToken(sess.name, refreshToken, (user) => {
                res.send({
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                });
              });
            } else {
              res.send("Password is incorrect");
            }
          }
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  // access token generate
  tokenGeneration: (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    UserModel.validateRefreshToken(refreshToken, (user) => {
      if (Object.keys(user).length === 0) res.sendStatus(403);
      else {
        if (userAuthenticate.authenticateRefreshToken(refreshToken)) {
          // if authentication is successful
          const sess = {
            id: user[0].id,
            name: user[0].name,
            type: user[0].type,
            status: user[0].status,
          };

          const accessToken = generateAccessToken(sess);
          res.json({ accessToken: accessToken });
        } else {
          res.status(403).send("Token is not valid");
        }
      }
    });
  },

  // get logged in user information
  getUserInformation: (req, res) => {
    UserModel.getUserById(req.user.id, (users) => {
      res.send(users);
    });
  },

  deauthenticateUser: (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    UserModel.deauthenticateUser(refreshToken, (user) => {
      if (!user) res.sendStatus(403);
      else {
        res.send({
          status: true,
          message: "User Refresh Token is Successfully Reseted",
          data: user.insertId,
        });
      }
    });
  },
};
