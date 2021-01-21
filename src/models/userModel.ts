import bcrypt from 'bcrypt';
import TableModel from './tableModel';

export interface User {
  email: string,
  password?: string,
  name: string,
  age: number,
  id: number
}

class UserModel extends TableModel {
  constructor() {
    super('user')
  }

  async findOneByEmail(email: any, noPassword: boolean = true): Promise<User | null>{
    let sql: string = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    let res: User | null = null;

    const users: User[] = await this.query(sql, [email]);

    if (users.length) {
      res = users[0];

      if (noPassword && res) {
        delete res.password
      }
    };
    return res;
  };

  async findOneBy(field: string, value: string, noPassword: boolean = true): Promise<User | null>{
    let sql: string = `SELECT * FROM users WHERE ${field} = ? LIMIT 1`;
    let res: User | null = null;

    console.log('field', field);
    console.log('value', value);

    const users: User[] = await this.query(sql, [value]);

    if (users.length) {
      res = users[0];

      if (noPassword && res) {
        delete res.password
      }
    };
    return res;
  };

  async verifyPassword(password: string | undefined, passwordHash: string | undefined) {
    if (!password || !passwordHash) {
      return false;
    }
    return bcrypt.compare(password, passwordHash)
  }
}

const userModel = new UserModel();
export default userModel;
