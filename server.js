const express = require("express");
const bodyParser = require("body-parser");

// setup the server port
const port = process.env.PORT || 8000;

// create express app
const app = express();

// parse request data content type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse request data content type application/json
app.use(bodyParser.json());

// define root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// import user routes
const userRoutes = require("./src/routes/user-route");

// create user routes
app.use("/api/v1/user", userRoutes);

//server startup
app.listen(port, (error) => {
  console.log("server strated at " + port);
});
