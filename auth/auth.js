const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}

router.isAuthenticated = isAuthenticated;

// GET: Display login page
router.get('/login', (req, res) => {
  res.render('login');
});

// POST: Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'User not found. Please sign up!' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect password.' });
    }

    // Store user ID in session
    req.session.userId = user._id;

    // Explicitly save the session to prevent local race conditions
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('login', { error: 'Session save error: ' + err.message });
      }
      res.redirect('/home');
    });
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Internal Error: ' + err.message });
  }
});

// GET: Display signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST: Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'Email already in use' });
    }

    // Create a new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by the pre-save hook in the model
    });

    await user.save();

    // Store user ID in session
    req.session.userId = user._id;

    // Explicitly save the session to prevent local race conditions
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('signup', { error: 'An error occurred. Please try again.' });
      }
      res.redirect('/home');
    });
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'An error occurred. Please try again.' });
  }
});

// GET: Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;