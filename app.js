const express = require('express');
require('dotenv').config()
const app = express();

app.get('/',(req,res)=>{
    res.send('node')
})

const post = process.env.PORT || 8000;

app.listen(post,()=>{
    console.log('server listening on port 8000')
})

