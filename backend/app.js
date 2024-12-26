// Importing packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');


//Middleware functionalities
const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());


//Importing models
const User = require('./models/UserSchema');
const Note = require('./models/NoteSchema');


//Initialize essential variables
BACKEND_PORT = parseInt(process.env.BACKEND_PORT, 10);
MONGO_HOST = process.env.MONGO_HOST;
MONGO_PORT = process.env.MONGO_PORT;
MONGO_DB = process.env.MONGO_DB;
JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
HASH_SALT_ROUNDS = parseInt(process.env.HASH_SALT_ROUNDS);
JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;


//Database connectivity
const dbURL = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB;
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

    let jwt_token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: JWT_TOKEN_EXPIRY});
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

    jwt.verify(auth_token, JWT_SECRET_KEY, (err, decoded) => {
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


// Route for registering new user
app.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then(async (user) => {
        try {
            if(!user){
                let {name, phone, email, password} = req.body;
                let hashed_pass = await bcryptjs.hash(password, HASH_SALT_ROUNDS);
                
                let new_user = new User({name, phone, email, password: hashed_pass});
                new_user.save();
                res.statusCode = 200;
                res.json({
                    "status": "User Created",
                });
            } else {
                res.statusCode = 400;
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
});


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
});


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


//Route to add a simple note, checklist or orderedlist
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

            if(req.body.type === 'ordered-list'){
                newNote['orderedList'] = [];
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

//Route to update a checklist by its ID
app.put('/orderedlist/:id', authenticateUser, (req, res) => {
    User.findOne({email: req.user.email}).then(async (user) => {
        if(user){
            let note_id = new mongoose.Types.ObjectId(req.params.id);
            if(req.body.action==='general'){
                Note.findByIdAndUpdate(note_id, {"title":req.body.title} , (err, note) => {
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            status: "Error updating the ordered list",
                        });
                        return;
                    } else if(note){
                        res.statusCode = 200;
                        res.json({
                            status: "Ordered list updated",
                        });
                    } else {
                        res.statusCode = 404;
                        res.json({
                            status: "Ordered list not found",
                        });
                    }
                });
            } else if(req.body.action==='erase'){
                let attr = "orderedList."+req.body.index;
                Note.findByIdAndUpdate(note_id, {$unset: {[attr]: 1}}).then(() => {
                    Note.findByIdAndUpdate(note_id, {$pull: {"orderedList": null}}, (err, note) => {
                        if(err){
                            res.statusCode = 500;
                            res.json({
                                status: "Error erasing the ordered list element",
                            });
                            return;
                        } else if(note){
                            res.statusCode = 200;
                            res.json({
                                status: "Ordered list element erased",
                            });
                        } else {
                            res.statusCode = 404;
                            res.json({
                                status: "Ordered list not found",
                            });
                        }
                    });
                });
            } else if(req.body.action==='add') {
                Note.findByIdAndUpdate(note_id, {$push: {"orderedList": req.body.element}}, (err, note) => {
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            status: "Error adding the ordered list element",
                        });
                        return;
                    } else if(note){
                        res.statusCode = 200;
                        res.json({
                            status: "Ordered list item added",
                        });
                    } else {
                        res.statusCode = 404;
                        res.json({
                            status: "Ordered list not found",
                        });
                    }
                });
            } else {
                Note.findByIdAndUpdate(note_id, {"orderedList": req.body.orderedlist}, (err, note) => {
                    if(err){
                        res.statusCode = 500;
                        res.json({
                            status: "Error reordering the ordered list",
                        });
                        return;
                    } else if(note){
                        res.statusCode = 200;
                        res.json({
                            status: "Ordered list reordered",
                        });
                    } else {
                        res.statusCode = 404;
                        res.json({
                            status: "Ordered list not found",
                        });
                    }
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

app.listen(BACKEND_PORT);