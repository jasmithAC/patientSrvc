const express = require('express');
const path=require('path');
const moongoose=require("mongoose");
const bodyParser = require("body-parser");

const { json } = require('express');
const { nextTick } = require('process');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');


const app = express();
const PORT=process.env.PORT ||5001;

//var jsonParser=bodyParser.json();

const config={
    authRequired: false,
    auth0Logout: true,
    secret:'db615577d9efc97b5ab424e7cdc7430e2c3647fe897cd980dc0f27ca2fa073f3',
    baseURL:'http://localhost:5000',
    clientID: 'nz6kUR2kiIxFvF55ntPlQvqueg5FHtE3',
    issuerBaseURL: 'https://dev-8m7lp7gpu0lsfpiy.us.auth0.com'
};

moongoose.connect("mongodb://localhost:27017/plookoon");



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.listen(PORT,()=>console.log(`listening on port ${PORT}`));
app.use(express.json());
app.use(auth(config));
app.use(bodyParser.json()); //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true})); //to support URL-encoded bodies

//================================= The Party Starts Here =================================


app.get('/patient/:id',function(req,res){
    res.json({stub_data:"you patient object json here"});
})