const express = require('express');
const router = express.Router();
const { postSignIn, postSignUp, getProfile, postResetPassword, postNewPassword } = require('../controllers/auth');
const validateBody = require('../middleware/validateBody');
const { userSchema, loginSchema, emailSchema, resetSchema } = require('../validators/validators');
const isAuth = require('../middleware/is-auth');
const { validate } = require('../models/User');
const passport = require('passport');

router.post('/signin', validateBody(loginSchema), postSignIn);
router.post('/signup', validateBody(userSchema) ,postSignUp);
router.post('/password-reset', validateBody(emailSchema), postResetPassword)
router.post('/new-password', validateBody(resetSchema) , postNewPassword);


router.get('/get-profile', isAuth , getProfile);

// Google Auths
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
      res.send(req.user);
    }
  );

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


module.exports = router