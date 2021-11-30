const User = require('../models/user');
const HttpError = require("../models/http-error");

exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if (err || !user){
            return next(
                new HttpError('User not found', 400)
            );
        }

        req.profile = user;
        next();
    });
}