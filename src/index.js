import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import connection from './db/connection';
import corsMiddleware from './middleware/corsMiddleware';
import UserController from './controllers/userController';
import configureRoutes from './routes/routes';
import api from './service/api';

const port = 3001;

class App {
  constructor() {
    this.app = express();
    this.init();

  }

  init() {
    connection.init();

    this.app.use(bodyParser.json());
    this.app.use(corsMiddleware);

    this.app.use(api.composeUri('public'), express.static('public'));


    this.app.use(passport.initialize());
    passport.use(UserController.getLocalStrategy());

    configureRoutes(this.app);
  }
}

const app = new App();

app.app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
