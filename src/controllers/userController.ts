import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {JWT_SECRET} from '../constants';
import api from '../service/api';
import { User } from '../models/user.model';
import { Image } from '../models/image.model';

class UserController {

  static async signUp(req: Request, res: Response) {
    try {
      const userData = req.body.user;

      userData.password = await bcrypt.hash(userData.password, 12);

      const oldUser = await User.findOne({where: {email: userData.email}});
      if (oldUser) {
        api.sendError(res, 404,  'User with this email already exist');
        return;
      }

      const newUser = await User.create(userData);
      if (userData.photo_id) {
        await newUser.$set('images', [userData.photo_id])
      }


      // if (userData.photo_id) {
      //   await UserImage.create({
      //     user_id: newUser.id,
      //     image_id: userData.photo_id
      //   });
      // };

      res.json({message: 'success', newUser});
    } catch (e: any) {
      api.sendError(res, 404,  e.message);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {

    passport.authenticate('local', (err: any, user: User) => {
      if (err) {
        res.status(404).json(err);
        return;
      }

      if (!user) {
        res.status(404).json({code: 404, massage: 'Login error'});
        return;
      }

      const token = UserController._generateToken(user);

      // user.update({
      //   isAuthorized: true
      // });

      // user.

      // TODO remove password
      const jsonUser = user.toJSON();


      // delete jsonUser.password;

      res.json({token, user: jsonUser});
    })(req, res, next);
  }

  static async getUser(req: Request, res: Response) {
    try {
      const {email} = req.query;

      // users with avatars
//       const [user] = await connection.sequelize.query(
//           `
// SELECT
// u.name as user_name,
// u.id as user_id,
// i.path as user_avatar
// from Users u
// left JOIN user_image ui
// ON ui.user_id = u.id
// left JOIN Images i
// ON ui.image_id = i.id
// `
//       );

      // feeds
//       const [user] = await connection.sequelize.query(
//           `
// SELECT
// u.name as author_name,
// u.id as author_id,
// f.title,
// i.path as image_path,
// user_photo.path as user_avatar
// from feed f
// left JOIN Users u
// ON u.id = f.author_id
// left JOIN Images i
// ON i.id = f.photo_id
// left JOIN user_image ui
// on ui.user_id = u.id
// left JOIN Images user_photo
// on user_photo.id = ui.image_id
// `
//       );

      const user = await User.scope('withoutPassword').findOne({
        where: {email},
        include: [{
          // TODO remove any
          model: Image as any,
          through: { attributes: [] }
        }]
      });

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

  static async updateUser(req: Request, res: Response) {
    try {
      // @ts-ignore
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

  static _generateToken(user: User) {
    const payload = {
      userId: user.id
    };

    return jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})
  }

  static _verifyPassword(password: string, passwordHash: string)  {
    if (!password || !passwordHash) {
      return false;
    }
    return bcrypt.compare(password, passwordHash)
  }
}

export default UserController;
