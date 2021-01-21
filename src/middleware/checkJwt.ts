import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import api from '../service/api'
import UserModel from '../models/userModel';
import {JWT_SECRET} from '../constants';

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];
  console.log('!!!!!@@@@@@', authHeader);
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];

      if (!token) return api.sendError(res, 403, 'INVALID TOKEN');

      const userFromToken = <any>jwt.verify(token, JWT_SECRET);

      if (!userFromToken.userId) return api.sendError(res, 403, 'INVALID TOKEN');

      const user = await UserModel.findOneBy('id', userFromToken.userId);

      if (!user) return api.sendError(res, 403, 'INVALID TOKEN');

      next();

    } catch (e) {
      api.sendError(res, 403, 'INVALID TOKEN');
    }

  } else {
    api.sendError(res, 401, 'UNAUTHORIZED');
  }


};

export default checkJwt;
