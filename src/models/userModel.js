import bcrypt from 'bcrypt';
import TableModel from './tableModel';

class UserModel extends TableModel {
  constructor() {
    super('user')
  }

  async findOneByEmail(email, noPassword = true) {
    let sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    let res = null;

    const users = await this.query(sql, [email]);

    if (users.length) {
      res = users[0];

      if (noPassword && res) {
        delete res.password
      }
    };
    return res;
  };

  async findOneBy(field, value, noPassword = true) {
    let sql = `SELECT * FROM users WHERE ${field} = ? LIMIT 1`;
    let res = null;

    const users = await this.query(sql, [value]);

    if (users.length) {
      res = users[0];

      if (noPassword && res) {
        delete res.password
      }
    };
    return res;
  };

  async verifyPassword(password, passwordHash) {
    if (!password || !passwordHash) {
      return false;
    }
    return bcrypt.compare(password, passwordHash)
  }
}

const userModel = new UserModel();
export default userModel;
