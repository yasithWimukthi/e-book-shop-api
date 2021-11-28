const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');

require('dotenv').config()
const app = express();

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



