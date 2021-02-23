import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {JWT_SECRET} from '../constants';
import api from '../service/api';
import User from '../models/userModel';
import Image from '../models/imageModel';


class UserController {

  static async signUp(req, res) {
    try {
      const userData = req.body.user;

      userData.password = await bcrypt.hash(userData.password, 12);

      const oldUser = await User.findOne({where: {email: userData.email}});
      if (oldUser) {
        api.sendError(res, 404,  'User with this email already exist');
        return null;
      }

      await User.create(userData);

      res.json({message: 'success'});
    } catch (e) {
      console.log('e', e);

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

      const token = UserController._generateToken(user);

      user.update({
        isAuthorized: true
      });

      const jsonUser = user.toJSON();

      delete jsonUser.password;

      res.json({token, user: jsonUser});
    })(req, res, next);
  }

  static async getUser(req, res) {
    try {
      const {email} = req.query;

      const user = await User.scope('withoutPassword').findOne({where: {email}});
      const userImage = await Image.findOne({where: {id: user.imageId}});

      if (user) {
        res.json({user})
      } else {
        res.status(404).json({code: 404, massage: 'User is not found'})
      }
    } catch (err) {
      console.log('err', err);

      res.status(500).send(err);
    }
  }

  static async updateUser(req, res) {
    try {
      req.user.update(req.body);
      res.json({message: 'OK'});
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static getLocalStrategy() {
    return new LocalStrategy(
      {usernameField: 'email'},
      async (email, password, done) => {
        try {
          const user = await User.findOne({where: {email}});

          if (!user) {
            return done({
              code: 404,
              massage: 'Email or password is worng'
            }, false);
          }
          const correctPassword = await UserController._verifyPassword(password, user?.password);
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

  static _generateToken(user) {
    const payload = {
      userId: user.id
    };

    return jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})
  }

  static _verifyPassword(password, passwordHash)  {
    if (!password || !passwordHash) {
      return false;
    }
    return bcrypt.compare(password, passwordHash)
  }
}

export default UserController;
