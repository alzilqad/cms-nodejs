const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");
const { validationResult } = require("express-validator");
const userAuthenticate = require("../middleware/user-authentication");
const { generateAccessToken } = require("../middleware/user-authentication");

module.exports = {
  // get all user list
  getUserList: async (req, res) => {
    const users = await UserModel.getUserList();
    res.send(users);
  },

  // get user by id
  getUserById: async (req, res) => {
    const user = await UserModel.getUserById(req.params.id);
    res.send(user);
  },

  // create new user
  createUser: async (req, res) => {
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
        res.sendStatus(400).send({
          success: false,
          message: "Please Provide All Information",
        });
      } else {
        // check if username is unique
        const exist = await UserModel.checkUsernameExist(req.body.name);
        if (exist) {
          res
            .status(400)
            .send({ success: false, message: "Username is taken" });
        } else {
          // create user information
          req.body.password = await bcrypt.hash(req.body.password, 10); // hashed password
          const user = new UserModel(req.body);
          const result = await UserModel.createUser(user);

          if (!result) res.sendStatus(403);
          else {
            res.send({
              status: true,
              message: "User Information Successfully Recorded",
            });
          }
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  // update user by id
  updateUser: async (req, res, next) => {
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
        const exist = await UserModel.checkUsernameExist(req.body.name);
        if (exist) {
          res
            .status(400)
            .send({ success: false, message: "Username is taken" });
        } else {
          // create user information
          req.body.password = await bcrypt.hash(req.body.password, 10); // hashed password
          const user = new UserModel(req.body);
          const result = await UserModel.updateUser(req.params.id, user);

          if (!result) res.sendStatus(403);
          else {
            res.send({
              status: true,
              message: "User Information Successfully Updated",
            });
          }
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  // delete user by id
  deleteUser: async (req, res) => {
    const result = await UserModel.deleteUser(req.params.id);
    if (!result) res.sendStatus(403);
    else {
      res.send({
        status: true,
        message: "User Information Successfully Deleted",
      });
    }
  },

  // login user
  authenticateUser: async (req, res, next) => {
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
        const user = await UserModel.authenticateUser(req.body.name);
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
            const result = await UserModel.updateRefreshToken(
              sess.name,
              refreshToken
            );
            if (!result) res.sendStatus(403);
            else {
              res.send({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            } 
          } else {
            res.send("Password is incorrect");
          }
        }
      }
    } catch (error) {
      return next(error);
    }
  },

  // access token generate
  tokenGeneration: async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const user = await UserModel.validateRefreshToken(refreshToken);
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
  },

  // get logged in user information
  getUserInformation: async (req, res) => {
    const user = await UserModel.getUserById(req.user.id);
    res.send(user);
  },

  deauthenticateUser: async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const result = await UserModel.deauthenticateUser(refreshToken);
    if (!result) res.sendStatus(403);
    else {
      res.send({
        status: true,
        message: "User Refresh Token is Successfully Reseted",
      });
    }
  },
};
