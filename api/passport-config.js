const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    // Here you can fetch the user from your database if needed

    return done(null, jwt_payload); // just generates a token
  })
);

const authenticate = passport.authenticate('jwt', { session: false });

/**
 * Generate a JWT token
 * @param {*} payload 
 * @param {*} expiresIn 
 * @returns 
 */
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Invalidate the token
 */
const invalidateToken = (req) => {
  req.logout();
}

module.exports = {
  initialize: () => passport.initialize(),
  authenticate,
  generateToken,
  invalidateToken
};
