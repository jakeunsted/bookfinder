const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const userService = require('./database/services/user.service');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};

/**
 * Passport JWT strategy
 */
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await userService.getUserById(jwt_payload.id);
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
 * @param {Next} next 
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
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
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1hr' });
};

/**
 * Generates a refresh token using the provided payload.
 * @param {Object} payload - The payload to be signed in the refresh token.
 * @returns {string} - The generated refresh token.
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '24hr' });
};

/**
 * Verifies the refresh token.
 * @param {string} token - The refresh token to verify.
 * @returns {object} - The decoded refresh token payload.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_SECRET_KEY);
};

/**
 * Retrieves the JWT token from the request header.
 * @param {Object} req - The request object.
 * @returns {string} The JWT token extracted from the request header.
 */
const getJwtFromHeader = (req) => {
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

/**
 * Invalidate the token
 * @param {request} req
 */
const invalidateToken = (req) => {
  req.logout();
}

module.exports = {
  initialize: () => passport.initialize(),
  authenticate,
  invalidateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getJwtFromHeader
};
