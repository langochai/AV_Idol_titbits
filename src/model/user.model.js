const BaseModel = require("./base.model");

class SignInModel extends BaseModel {
  async checkSignIn(username, password) {
    let sql = `select * from users
        where username = '${username}' and password = '${password}'`;
    return await this.querySql(sql);
  }

  async addUser(
    userSignInName,
    userPassword,
    userName,
    userEmail,
    userAge,
    userPhoneNum
  ) {
    let sql = `INSERT INTO users(username, password, name, email, age, phone, role)
        SELECT '${userSignInName}', '${userPassword}', '${userName}', '${userEmail}', '${userAge}', '${userPhoneNum}', '0'
        FROM dual
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = '${userSignInName}');`;
    return await this.querySql(sql);
  }

  async getAllUser() {
    let sql = `SELECT * FROM USERS`;
    return await this.querySql(sql);
  }

  async deleteUser(id) {
    let sql = `DELETE FROM USERS WHERE ID = ${id}`;
    return await this.querySql(sql);
  }
}

module.exports = new SignInModel();
