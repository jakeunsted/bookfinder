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
    // For demonstration, we'll just return the jwt_payload
    return done(null, jwt_payload);
  })
);

const authenticate = passport.authenticate('jwt', { session: false });

const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

module.exports = {
  initialize: () => passport.initialize(),
  authenticate,
  generateToken
};
