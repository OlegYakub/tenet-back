import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import UserModel from '../models/userModel';
import connection from '../db/connection';
import {JWT_SECRET} from '../constants';
import api from '../service/api';

class UserController {

  static async signUp(req, res) {
    try {
      const {user} = req.body;

      user.password = await bcrypt.hash(user.password, 12);
      let sql = 'INSERT INTO users SET ?';

      await connection.query(sql, [user]);
      res.json(user);
    } catch (e) {
      api.sendError(res, 404,  e.message);
    }
  }

  static async login(req, res, next) {

    passport.authenticate('local', (err, user) => {
      if (err) {
        res.status(404).json(err);
        return null;
      }

      if (!user) {
        res.status(404).json({code: 404, massage: 'Login error'});
        return null;
      }

      delete user.password;
      const token = UserController.generateToken(user);

      res.json({token, user});
    })(req, res, next);
  }

  static async getUser(req, res) {
    try {
      const {email} = req.query;
      console.log('email', email);

      const user = await UserModel.findOneByEmail(email);
      // const user = await userModel.findOneBy('id', '13');
      if (user) {
        res.json(user)
      } else {
        res.status(404).json({code: 404, massage: 'User is not found'})
      }
    } catch (err) {
      res.status(500).send(err);
    }
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

  static generateToken(user) {
    const payload = {
      userId: user.id
    };

    return jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})
  }
}

export default UserController;
