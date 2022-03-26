const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

const userValidation = require("../middleware/user-validation");
const userAuthenticate = require("../middleware/user-authentication");

// get all User
router.get("/", userController.getUserList);

// get user by id
router.get("/profile/:id", userController.getUserById);

// create new user
router.post(
  "/signup",
  userValidation.validate("createUser"),
  userController.createUser
);

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

// generate access token
router.post("/token", userController.tokenGeneration);

// get logged in user information
router.get(
  "/profile",
  userAuthenticate.authenticateToken,
  userController.getUserInformation
);

module.exports = router;
