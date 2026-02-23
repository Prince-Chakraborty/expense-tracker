const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL + '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
      );
      await user.update({ refreshToken });
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(frontendUrl + '/auth/callback?token=' + accessToken + '&refresh=' + refreshToken + '&user=' + encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })));
    } catch (error) {
      res.redirect(process.env.FRONTEND_URL + '/login?error=oauth_failed');
    }
  }
);

module.exports = router;