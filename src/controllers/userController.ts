import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import {Strategy as LocalStrategy} from 'passport-local';
import UserModel, {User} from '../models/userModel';
import connection from '../db/connection';
import {JWT_SECRET} from '../constants';

class UserController {

  static async signUp(req: Request, res: Response) {
    const {user} = req.body;

    user.password = await bcrypt.hash(user.password, 12);
    let sql = 'INSERT INTO users SET ?';

    await connection.query(sql, [user]);
    res.json(user);
  }

  static getLocalStrategy() {
    return new LocalStrategy(
      {usernameField: 'email'},
      async (email, password, done) => {
        try {
          const user = await UserModel.findOneByEmail(email, false);

          if (!user) {
            return done({
              code: 404,
              massage: 'Email or password is worng'
            }, false);
          }
          const correctPassword = await UserModel.verifyPassword(password, user?.password);
          if (!correctPassword) {
            return done({
              code: 404,
              massage: 'Email or password is worng'
            }, false);
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    );
  }

  static generateToken(user: User) {
    const payload: {userId: number} = {
      userId: user.id
    };

    return jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})
  }
}

export default UserController;
