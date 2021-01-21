import express, {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import api from '../service/api';
import userModel from '../models/userModel';
import checkJwt from '../middleware/checkJwt';
import userController from '../controllers/userController';

export default function configure(app: express.Application) {
  app.get(api.composeUri('/'), (req, res) => res.send('Hello World!'));
  app.get(api.composeUri('/createdb'), (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    // connection.pool.query(sql, (err, result) => {
    //   if (err) {
    //     res.status(500).send(err);
    //     throw err;
    //   }
    //   console.log('result', result);
    //   res.send('Database created');
    // })
  });
  app.get(api.composeUri('/create-user-table'), (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(16), age int, PRIMARY KEY(id))';

    // connection.pool.query(sql, (err, result) => {
    //   if (err) {
    //     res.status(500).send(err);
    //     throw err;
    //   }
    //   console.log('result', result);
    //   res.send('user table created!');
    // })
  });

  app.get(api.composeUri('/get-user'), checkJwt,  async (req: Request, res: Response) => {
    const {email} = req.query;

    console.log('11111123123222222!!!!!!!!!');


    try {
      const user = await userModel.findOneByEmail(email);
      // const user = await userModel.findOneBy('id', '13');
      if (user) {
        res.json(user)
      } else {
        res.status(404).json({code: 404, massage: 'User is not found'})
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post(api.composeUri('/sign-up'), userController.signUp);
  app.get(api.composeUri('/login'), async (req: Request, res: Response, next: NextFunction) => {

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
      const token = userController.generateToken(user);

      res.json({token, user});
    })(req, res, next);
  })
};
