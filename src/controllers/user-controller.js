const User = require("../models/user-model");
const UserModel = require("../models/user-model");

module.exports = {
  // get all user list
  getUserList: (req, res) => {
    UserModel.getUserList((users) => {
      res.send(users);
    });
  },

  // create new user
  createUser: (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
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
  },

  // get user by id
  getUserById: (req, res) => {
    UserModel.getUserById(req.params.id, (users) => {
      res.send(users);
    });
  },

  // update user by id
  updateUser: (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
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
