
import api from '../service/api';
import checkJwt from '../middleware/checkJwt';
import {imageUploadMiddleware} from '../middleware/uploadMiddleware';
import userController from '../controllers/userController';
import imageController from '../controllers/imageController';

export default function configure(app) {
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

  app.get(api.composeUri('/get-user'), checkJwt, userController.getUser);
  app.post(api.composeUri('/sign-up'), userController.signUp);
  app.get(api.composeUri('/login'), userController.login);
  app.post(
    api.composeUri('/upload/image'),
    checkJwt,
    imageUploadMiddleware.single('image'),
    imageController.upload
  );

  // app.post()
};
