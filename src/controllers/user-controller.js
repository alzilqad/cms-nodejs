const UserModel = require("../models/user-model");
const { validationResult } = require("express-validator");

module.exports = {
  // get all user list
  getUserList: (req, res) => {
    UserModel.getUserList((users) => {
      res.send(users);
    });
  },

  // create new user
  createUser: (req, res) => {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }
      
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        res
          .send(400)
          .send({ success: false, message: "Please Provide All Information" });
      } else {
        const user = new UserModel(req.body);
        UserModel.createUser(user, (user) => {
          res.send({
            status: true,
            message: "User Information Successfully Recorded",
            data: user.insertId,
          });
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
  updateUser: (req, res) => {
    try {
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        res
          .send(400)
          .send({ success: false, message: "Please Provide All Information" });
      } else {
        const user = new UserModel(req.body);
        UserModel.updateUser(req.params.id, user, (user) => {
          res.send({
            status: true,
            message: "User Information Successfully Updated",
            data: user.insertId,
          });
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
};
