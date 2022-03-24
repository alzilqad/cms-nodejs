const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

const { body } = require("express-validator");
const userValidation = require("../middleware/user-validation");

// get all User
router.get("/", userController.getUserList);

// create new user
router.post(
  "/signup",
  userValidation.validate("createUser"),
  userController.createUser
);

// get user by id
router.get("/:id", userController.getUserById);

// update user by id
router.put(
  "/:id",
  userValidation.validate("updateUser"),
  userController.updateUser
);

// delete user by id
router.delete("/:id", userController.deleteUser);

// authenticate user
router.post(
  "/login",
  userValidation.validate("authenticateUser"),
  userController.authenticateUser
);

module.exports = router;
