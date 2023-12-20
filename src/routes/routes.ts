import { Express, Request, Response } from 'express';
import connection from '../db/connection';
import api from '../service/api';
import checkJwt from '../middleware/checkJwt';
import {imageUploadMiddleware} from '../middleware/uploadMiddleware';
import UserController from '../controllers/userController';
import imageController from '../controllers/imageController';
import { uploadToS3Middleware } from "../middleware/uploadToS3Middleware";

export default function configure(app: Express) {
  app.get(api.composeUri('/'), (req, res) => {
    res.send('Hello World!')
  });
  app.get(api.composeUri('/createdb'), async (req, res) => {
    try {
      await connection.sequelize.query('CREATE DATABASE nodemysql');
      res.send('Database created!')
    } catch (error) {
      api.sendError(res, 500,  '');
    }
  });
  app.get(api.composeUri('/create-user-table'), (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(16), age int, PRIMARY KEY(id))';
  });


  app.post(api.composeUri('/sign-up'), UserController.signUp);
  app.get(api.composeUri('/login'), UserController.login);
  app.post(
    api.composeUri('/upload/image'),
    checkJwt,
    // uploadToS3Middleware,
    imageUploadMiddleware.single('image'),
    imageController.upload
  );
  app.post(
    api.composeUri('/upload-image-notification'),
    checkJwt,
    imageController.notifyUsersEndpoint
  )
  app.get(api.composeUri('/get-user'), checkJwt, UserController.getUser);
  app.post(
    api.composeUri('/update-user'),
    checkJwt,
    UserController.updateUser
  )
};
