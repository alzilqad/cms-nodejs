const mysql = require("mysql");

var getConnection = () => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "127.0.0.1",
      database: "user",
      user: "root",
      password: "",
    });

    connection.connect((err) => {
      if (err) {
        console.error("error connecting: " + err.stack);
        return;
      }
      console.log("connected as id " + connection.threadId);
    });

    resolve(connection);
  });
};

module.exports = {
  getResults: async (sql) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
        }
      });

      connection.end((err) => {
        console.log("connection end...");
      });
    });
  },

  execute: async (sql) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
      connection.query(sql, (error, status) => {
        if (status && !error) {
          resolve(true);
        } else {
          console.log(error);
        }
      });

      connection.end((err) => {
        console.log("connection end...");
      });
    });
  },
};
