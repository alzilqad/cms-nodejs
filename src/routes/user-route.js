const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

const userValidation = require("../middleware/user-validation");
const userAuthenticate = require("../middleware/user-authentication");

// get all User
router.get("/", userAuthenticate.isAdmin, userController.getUserList);

// get user by id
router.get("/profile/:id", userAuthenticate.isAdmin, userController.getUserById);

// create new user
router.post(
  "/signup",
  userAuthenticate.isAdmin, 
  userValidation.validate("createUser"),
  userController.createUser
);

// update user by id
router.put(
  "/:id",
  userAuthenticate.isAdmin, 
  userValidation.validate("updateUser"),
  userController.updateUser
);

// delete user by id
router.delete("/:id", userAuthenticate.isAdmin, userController.deleteUser);

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
