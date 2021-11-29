const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const User = require('../models/user');
const HttpError = require('../models/http-error');

exports.signup = async (req,res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email, password,about,salt,roll,history } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.' ,
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password : hashedPassword,
        about,
        salt,
        roll,
        history
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.' + err,
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res
        .status(201)
        .json({
            userId: createdUser.id,
            email: createdUser.email,
            about:createdUser.about,
            history:createdUser.history,
            token: token });
};


exports.signin= async (req,res, next) =>{
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    //generate token
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
        // persist token as cookie
        res.cookie('token',token,{expire:new Date()+9999});
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role:existingUser.role,
        token: token
    });
}

exports.signOut = (req,res) =>{
    res.clearCookie('token');
    res.json(
        {
            message: 'Signed out successfully'
        }
    );
}