const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function (req) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    console.log('token', token);
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('No token provided');
      return req;
    }

    console.log('Token Received: ', token);

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Token verified: ', data);
      req.user = data;
      return req;
    } catch (err) {
      console.log('Token verification error: ', err.message);
      throw new GraphQLError('Invalid token');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign(payload, secret, { expiresIn: expiration });
  },
};
