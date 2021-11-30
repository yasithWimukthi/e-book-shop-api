const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

require('dotenv').config()
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());


//routes
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)


mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>{
    console.log('database connected')
    const post = process.env.PORT || 8000;

    app.listen(post,()=>{
        console.log('server listening on port 8000')
    })
})
    .catch(err => {
        console.log(err);
    });



