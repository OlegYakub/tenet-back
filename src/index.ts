import express from 'express';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import connection from './db/connection';
import corsMiddleware from './middleware/corsMiddleware';
import UserController from './controllers/userController';
import configureRoutes from './routes/routes';
import api from './service/api';
import { initCronJobs } from "./service/cron";
import  "./service/sendgrid";

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(api.composeUri('public'), express.static('public'));
app.use(passport.initialize());
// app.use(fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
// }));
passport.use(UserController.getLocalStrategy());

configureRoutes(app);

console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY);

const start = async () => {
    try {
        await connection.checkConnection();
        initCronJobs();
        app.listen(PORT, () => console.log(`Server started 1 on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start();