// Importing packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');


//Middleware functionalities
const app = express()
app.use(cors());
// app.use(
//     cors({
//         origin: 'http://localhost:3000', // Allow the frontend origin
//         credentials: true,              // Allow cookies and credentials
//     })
// );

// app.options('*', cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


//Importing models
const User = require('./models/UserSchema');
const Note = require('./models/NoteSchema');

//Database Connectivity
const dbURL = 'mongodb://localhost:27017/notemaker';

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Support Functions - Later moved to middlewares or services
const createAuthToken = (user) => {
    const payload = {
        email: user.email,
        name: user.name
    };

    let jwt_token = jwt.sign(payload, 'my-secret-key', {expiresIn: '1h'});
    return jwt_token;
}

const authenticateUser = (req, res, next) => {
    const auth_token = req.headers["authorization"]?.split(' ')[1];
    if(!auth_token){
        res.statusCode = 401;
        res.json({
            "status": "Unauthorized user activity found!",
        });
        return;
    }

    jwt.verify(auth_token, 'my-secret-key', (err, decoded) => {
        if(err) {
            res.statusCode = 403;
            res.json({
                "status": "Invalid user credentials used!",
            });
            return;
        }

        req.user = decoded;
        next();
    })
}


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
                let {name, phone, email, password} = req.body;
                let hashed_pass = await bcryptjs.hash(password, 10);
                
                let new_user = new User({name, phone, email, password: hashed_pass});
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
                let credential_match = await bcryptjs.compare(req.body.password, user.password);
                if(credential_match){
                    let token = createAuthToken(user);
                    res.statusCode = 200;
                    res.json({
                        status: "Login Successful",
                        jwt: token
                    });
                } else {
                    res.statusCode = 401;
                    res.json({
                        status: "Unauthorized Login Attempt",
                    });
                    return;
                }
            }
        } catch(err){
            res.statusCode = 500;
            res.json({
                status: "Internal Server Error",
            });
        }
    });
});

//Route to fetch all users except the one in the headers
app.get('/share-user', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            User.find({$and: [{email: {$ne: req.user.email}}, {name: {$ne: 'admin'}}]}).select({name: 1, email: 1, _id: 1}).then(async (userlist) => {
                if(userlist && userlist.length !== 0){
                    res.statusCode = 200;
                    res.json({
                        users: userlist
                    })
                } else {
                    res.statusCode = 404;
                    res.json({
                        status: "No users found to share"
                    });
                }
            })
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
    })
})

//Route to fetch all notes (owned or being shared with)
app.get('/all-notes', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            Note.find({$or: [{'owner': req.user.email}, {shared: {$in: [req.user.email]}}]}).then(async (notes) => {
                if(notes.length !== 0){
                    res.statusCode = 200;
                    res.json({
                        notes: notes
                    });
                    return;
                } else {
                    res.statusCode = 404;
                    res.json({
                        status: "No notes found"
                    });
                }
            });
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
        
    });
})

//Route to fetch only owned notes
app.get('/note', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            Note.find({owner: req.user.email}).then(async (notes) => {
                if(notes.length !== 0){
                    res.statusCode = 200;
                    res.json({
                        notes: notes
                    });
                    return;
                } else {
                    res.statusCode = 404;
                    res.json({
                        status: "No notes found"
                    });
                }
            });
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
        
    });
});

//Route to delete a note by its ID
app.delete('/note/:id', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            let note_id = new mongoose.Types.ObjectId(req.params.id);
            Note.findOneAndDelete({owner: req.user.email, _id: note_id}, (err, note) => {
                if(err){
                    res.statusCode = 500;
                    res.json({
                        status: "Error deleting note",
                    });
                    return;
                } else if(note){
                    res.statusCode = 200;
                    res.json({
                        status: "Note deleted",
                    });
                } else {
                    res.statusCode = 404;
                    res.json({
                        status: "Note not found",
                    });
                }
            });
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
        
    });
});

//Route to update a note by its ID
app.put('/note/:id', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            let note_id = new mongoose.Types.ObjectId(req.params.id);
            Note.findByIdAndUpdate(note_id, req.body , (err, note) => {
                if(err){
                    res.statusCode = 500;
                    res.json({
                        status: "Error updating the note",
                    });
                    return;
                } else if(note){
                    res.statusCode = 200;
                    res.json({
                        status: "Note updated",
                    });
                } else {
                    res.statusCode = 404;
                    res.json({
                        status: "Note not found",
                    });
                }
            });
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
        
    });
});


//Route to add a simple note
app.post('/note', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            let newNote = {
                type: req.body.type,
                title: req.body.title,
                owner: req.user.email,
                shared: [],
            };

            if(req.body.type === 'default'){
                newNote['subject'] = req.body.subject;
                newNote['body'] = req.body.body;
            }
            
            Note.create(newNote).then(() => {
                res.statusCode = 200;
                res.json({
                    status: "Note added successfully",
                });
            }, (err) => {
                res.statusCode = 500;
                res.json({
                    status: "Internal server error",
                });
            });
        } else {
            res.statusCode = 404;
            res.json({
                status: 'User not found',
            });
        }
    });
});

//Route to update a checklist by its ID
app.put('/checklist/:id', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            let note_id = new mongoose.Types.ObjectId(req.params.id);
            if(req.body.action==='general'){
                Note.findByIdAndUpdate(note_id, {"title":req.body.title} , (err, note) => {
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            status: "Error updating the checklist",
                        });
                        return;
                    } else if(note){
                        res.statusCode = 200;
                        res.json({
                            status: "Checklist updated",
                        });
                    } else {
                        res.statusCode = 404;
                        res.json({
                            status: "Checklist not found",
                        });
                    }
                });
            } else if(req.body.action==='erase'){
                let attr = "menuChecked."+req.body.index;
                Note.findByIdAndUpdate(note_id, {$unset: {[attr]: 1}}).then(() => {
                    Note.findByIdAndUpdate(note_id, {$pull: {"menuChecked": null}}, (err, note) => {
                        if(err){
                            res.statusCode = 500;
                            res.json({
                                status: "Error erasing the checklist element",
                            });
                            return;
                        } else if(note){
                            res.statusCode = 200;
                            res.json({
                                status: "Checklist element erased",
                            });
                        } else {
                            res.statusCode = 404;
                            res.json({
                                status: "Checklist not found",
                            });
                        }
                    });
                });
            } else if(req.body.action==='add') {
                Note.findByIdAndUpdate(note_id, {$push: {"menu": req.body.element}}, (err, note) => {
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            status: "Error adding the checklist element",
                        });
                        return;
                    } else if(note){
                        res.statusCode = 200;
                        res.json({
                            status: "Checklist item added",
                        });
                    } else {
                        res.statusCode = 404;
                        res.json({
                            status: "Checklist not found",
                        });
                    }
                });
            } else {
                let cur, alt, attr;
                if(req.body.action==="check") {
                    cur = "menu";
                    alt = "menuChecked"
                } else {
                    cur = "menuChecked";
                    alt = "menu";
                }
                attr = cur+"."+req.body.index;
                Note.findByIdAndUpdate(note_id, {$unset: {[attr]: 1}}).then(() => {
                    Note.findByIdAndUpdate(note_id, {$pull: {[cur]: null}}).then(() => {
                        Note.findByIdAndUpdate(note_id, {$push: {[alt]: req.body.element}}, (err, note) => {
                            if(err){
                                res.statusCode = 500;
                                res.json({
                                    status: "Error toggling the checklist elements",
                                });
                                return;
                            } else if(note){
                                res.statusCode = 200;
                                res.json({
                                    status: "Checklist element toggled",
                                });
                            } else {
                                res.statusCode = 404;
                                res.json({
                                    status: "Checklist not found",
                                });
                            }
                        });
                    });
                });
            }
            
        } else {
            res.statusCode = 400;
            res.json({
                status: "No such user found"
            });
        }
        
    });
});

app.listen(3001);