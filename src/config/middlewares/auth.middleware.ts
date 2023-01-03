import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpExceptions';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey = '';
      const verificationResponse = verify(Authorization, secretKey); // as DataStoredInToken;
      const findUser = {};
      if (findUser) {
        // req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
