import express from 'express';
import passport from 'passport';
import fileUpload from 'express-fileupload';

import bodyParser from 'body-parser';
import connection from './db/connection';
import corsMiddleware from './middleware/corsMiddleware';
import UserController from './controllers/userController';
import configureRoutes from './routes/routes';
import api from './service/api';
// import AWS from 'aws-sdk';

// AWS.config.update({
//     accessKeyId: 'YOUR_ACCESS_KEY',
//     secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
//     region: 'YOUR_REGION',
// });

const PORT = 3001;
const app = express();

app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(api.composeUri('public'), express.static('public'));
app.use(passport.initialize());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
passport.use(UserController.getLocalStrategy());

configureRoutes(app);

const start = async () => {
    try {
        await connection.checkConnection();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start();