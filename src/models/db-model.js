const mysql = require("mysql");

var getConnection = function (callback) {
  const connection = mysql.createConnection({
    host: "127.0.0.1",
    database: "user",
    user: "root",
    password: "",
  });

  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });

  callback(connection);
};

module.exports = {
  getResults: function (sql, callback) {
    getConnection(function (connection) {
      connection.query(sql, function (error, results) {
        if (!error) {
			callback(results);
		  } else {
			console.log(error);
		  }
      });

      connection.end(function (err) {
        console.log("connection end...");
      });
    });
  },
  execute: function (sql, callback) {
    getConnection(function (connection) {
      connection.query(sql, function (error, status) {
        if (status) {
          callback(true);
        } else {
          callback(false);
        }
      });

      connection.end(function (err) {
        console.log("connection end...");
      });
    });
  },
};
