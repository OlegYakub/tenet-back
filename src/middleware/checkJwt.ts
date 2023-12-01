import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import {JWT_SECRET} from '../constants';
import api from '../service/api';
import { JwtTokenData } from "../types/global.type";

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      if (!token) return api.sendError(res, 404,  'INVALID TOKEN');


      const userFromToken = jwt.verify(token, JWT_SECRET) as JwtTokenData;

      if (!userFromToken.userId) return api.sendError(res, 404,  'INVALID TOKEN');

      const user = await User.findOne({
        where: {
          id: userFromToken.userId
        }
      });

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
