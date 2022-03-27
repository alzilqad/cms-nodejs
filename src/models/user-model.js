var db = require("./db-model");

var User = function (user) {
  this.name = user.name;
  this.password = user.password;
  this.type = user.type;
  this.status = user.status ? user.status : 1;
};

User.getUserList = () =>
  new Promise(async (resolve, reject) => {
    let sql = "SELECT * FROM user";
    const result = await db.getResults(sql);
    resolve(result);
  });

User.getUserById = (id) =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM user where user.id = '${id}'`;
    const result = await db.getResults(sql);
    resolve(result);
  });

User.getUserByUsername = (username) =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM user
                where user.name='${username}'`;
    const result = await db.getResults(sql);
    resolve(result);
  });

User.checkUsernameExist = (username) =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT count(*) as row FROM user
                where user.name='${username}'`;
    const result = await db.getResults(sql);
    resolve(result[0].row > 0);
  });

User.createUser = (user) =>
  new Promise(async (resolve, reject) => {
    let sql = `insert into user (id, name, password, type, status) 
                values('', '${user.name}', '${user.password}', '${user.type}', '${user.status}');`;
    const result = await db.execute(sql);
    resolve(result);
  });

User.updateUser = (id, user) =>
  new Promise(async (resolve, reject) => {
    let sql = `update user set 
                name='${user.name}', 
                password='${user.password}', 
                type='${user.type}', 
                status='${user.status}',
                token=NULL
                where id='${id}'`;
    const result = await db.execute(sql);
    resolve(result);
  });

User.deleteUser = (id) =>
  new Promise(async (resolve, reject) => {
    // let sql = "DELETE from user where id='" + id + "'";
    let sql = `update user set
                status='0'
                where id='${id}'`;
    const results = await db.execute(sql);
    resolve(results);
  });

User.authenticateUser = (username) =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM user where user.name='${username}'`;
    const results = await db.getResults(sql);
    resolve(results);
  });

User.validateRefreshToken = (token) =>
  new Promise(async (resolve, reject) => {
    let sql = `SELECT * FROM user 
              where user.token = '${token}'`;
    const results = await db.getResults(sql);
    resolve(results);
  });

User.updateRefreshToken = (username, token) =>
  new Promise(async (resolve, reject) => {
    let sql = `update user set 
                token='${token}'
                where user.name='${username}'`;
    const results = await db.execute(sql);
    resolve(results);
  });

User.deauthenticateUser = (token) =>
  new Promise(async (resolve, reject) => {
    let sql = `update user set 
              token=NULL
              where user.token='${token}'`;
    const results = await db.execute(sql);
    resolve(results);
  });

module.exports = User;
