const UserModel = require("../models/user-model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

module.exports = {
  // get all user list
  getUserList: (req, res) => {
    UserModel.getUserList((users) => {
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
        res
          .send(400)
          .send({ success: false, message: "Please Provide All Information" });
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

  // get user by id
  getUserById: (req, res) => {
    UserModel.getUserById(req.params.id, (users) => {
      res.send(users);
    });
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

  // authenticate user
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
              res.send("User is authenticated");
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
};
