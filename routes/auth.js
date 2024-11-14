// routes/auth.js
const express = require('express');
const { loginUser, signUpUser, checkAuthenticUser, logout } = require('../controllers/authController');
const router = express.Router();


router.post('/login', loginUser);
router.post('/logout', logout);
router.post('/signup',signUpUser );
router.get('/check-user-auth',checkAuthenticUser );

module.exports = router;
