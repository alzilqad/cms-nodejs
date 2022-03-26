var db = require("./db-model");

var User = function (user) {
  this.name = user.name;
  this.password = user.password;
  this.type = user.type;
  this.status = user.status ? user.status : 1;
};

User.getUserList = (callback) => {
  let sql = "SELECT * FROM user";
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.getUserById = (id, callback) => {
  let sql = `SELECT * FROM user where user.id = '${id}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.getUserByUsername = (id, username, callback) => {
  let sql = `SELECT * FROM user 
              where user.id!='${id}' 
              and user.name='${username}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.createUser = (user, callback) => {
  let sql = `insert into user (id, name, password, type, status) 
              values('', '${user.name}', '${user.password}', '${user.type}', '${user.status}');`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.updateUser = (id, user, callback) => {
  let sql = `update user set 
              name='${user.name}', 
              password='${user.password}', 
              type='${user.type}', 
              status='${user.status}'
              where id='${id}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.deleteUser = (id, callback) => {
  // let sql = "DELETE from user where id='" + id + "'";
  let sql = `update user set
              status='0'
              where id='${id}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.authenticateUser = (username, callback) => {
  let sql = `SELECT * FROM user where user.name='${username}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.validateRefreshToken = (token, callback) => {
  let sql = `SELECT * FROM user 
              where user.token = '${token}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

User.updateRefreshToken = (username, token, callback) => {
  let sql = `update user set 
              token='${token}'
              where user.name='${username}'`;
  db.getResults(sql, function (results) {
    callback(results);
  });
};

module.exports = User;
