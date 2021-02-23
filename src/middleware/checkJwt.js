import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import {JWT_SECRET} from '../constants';
import api from '../service/api';

const checkJwt = async (req, res, next) => {

  const authHeader = req.headers['authorization'];
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      if (!token) return api.sendError(res, 404,  'INVALID TOKEN');


      const userFromToken = jwt.verify(token, JWT_SECRET);

      if (!userFromToken.userId) return api.sendError(res, 404,  'INVALID TOKEN');

      const user = await User.findOne({
        where: {
          id: userFromToken.userId
        }
      });

      console.log('user', user);

      if (!user) return api.sendError(res, 404,  'INVALID TOKEN');

      req.user = user;

      next();

    } catch (e) {
      return api.sendError(res, 404,  'INVALID TOKEN');
    }

  } else {
    return api.sendError(res, 401,  'UNAUTHORIZED');
  }


};

export default checkJwt;
