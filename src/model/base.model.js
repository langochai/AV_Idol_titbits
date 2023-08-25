const database = require("./database.model");

class BaseModel {
  constructor() {
    this.connect = database.connect();
  }

  querySql(sql) {
    return new Promise((resolve, reject) => {
      this.connect.query(sql, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}

module.exports = BaseModel;
