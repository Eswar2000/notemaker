// Importing packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


//Middleware functionalities
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Importing models
const User = require('./models/UserSchema');

//Database Connectivity
const dbURL = 'mongodb://localhost:27017/notemaker';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//Route handling
app.get('/', (req, res) => {
    res.send("<h2>Server running successfully</h2>");
});

app.post('/temp', (req, res) => {
    console.log("NodeJS and ReactJS are connected successfully");
});

// Route for registering new user
app.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then(async (user) => {
        try {
            if(!user){
                let new_user = new User(req.body);
                new_user.save();
                res.statusCode = 404;
                res.json({
                    "status": "User Created",
                });
            } else {
                res.statusCode = 200;
                res.json({
                    "status": "User already exists",
                });
                return;
            }
        } catch(err){
            res.statusCode = 500;
            res.json({
                "status": "Internal Server Error",
            });
        }
    });

});

//Route for login into user's dashboard
app.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then(async (user) => {
        try {
            if(!user){
                res.statusCode = 404;
                res.json({
                    status: "User Not Found",
                });
                return;
            } else {
                if(user.password === req.body.password){
                    res.statusCode = 200;
                    res.json({
                        status: "Login Successful",
                        token: user.email+"-"+user.password
                    });
                } else {
                    console.log(user.password, req.body.password, user.password === req.body.password);
                    res.statusCode = 401;
                    res.json({
                        status: "Unauthorized Login Attempt",
                    });
                    return;
                }
            }
        } catch(err){
            res.status = 500;
            res.json({
                status: "Internal Server Error",
            });
        }
    });
});

app.listen(3001);