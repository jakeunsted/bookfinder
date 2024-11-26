import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import { 
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions 
} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from './database/services/user.service.ts';
import { User } from './database/models/user.model.ts';

export default interface PassportConfig {
  authenticate: (req: Request, res: Response, next: NextFunction) => void;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY as string
};

/**
 * Passport JWT strategy
 */
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await getUserById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

/**
 * Authenticate the user
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const authenticate = (
  req: Request, res: Response, next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: User) => {
    if (err) {
      console.log('Error authenticating user: ', err);
      return res.status(401).send('Unauthorized');
    }
    if (!user) {
      console.log('No user found');
      return res.status(401).send('Unauthorized');
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Generates an access token using the provided payload.
 * @param {object} payload - The payload to be signed.
 * @returns {string} - The generated access token.
 */
export const generateAccessToken = (payload: object): string => {
  return jwt.sign(
    payload, process.env.SECRET_KEY as string, { expiresIn: '1hr' }
  );
};

/**
 * Generates a refresh token using the provided payload.
 * @param {Object} payload - The payload to be signed in the refresh token.
 * @returns {string} - The generated refresh token.
 */
export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(
    payload, process.env.REFRESH_SECRET_KEY as string, { expiresIn: '6 months' }
  );
};

/**
 * Verifies the refresh token.
 * @param {string} token - The refresh token to verify.
 * @returns {object} - The decoded refresh token payload.
 */
export const verifyRefreshToken = (token: string): object => {
  const decoded = jwt.verify(
    token, process.env.REFRESH_SECRET_KEY as string
  ) as object;
  if (typeof decoded === 'object' && 'id' in decoded) {
    return { id: decoded.id };
  }
  throw new Error('Invalid token payload');
};

/**
 * Retrieves the JWT token from the request header.
 * @param {Request} req - The request object.
 * @returns {string} The JWT token extracted from the request header.
 */
export const getJwtFromHeader = (req: Request): string => {
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!token) {
    throw new Error('JWT token not found in header');
  }
  return token;
};

/**
 * Invalidate the token
 * @param {Request} req
 */
export const invalidateToken = (req: Request): void => {
  req.logout((err: Error) => {
    if (err) {
      console.error('Error logging out:', err);
    }
  });
}

/**
 * Initialize passport configuration
 * @returns {Function} - The passport initialize function.
 */
export function initialize() {
  return passport.initialize();
}