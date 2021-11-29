const express = require('express');
const router = express.Router();


const {signup, signin, signOut} = require('../controllers/user');

router.post('/signup',signup)
router.post('/signin',signin)
router.get('/signout',signOut)

module.exports = router;