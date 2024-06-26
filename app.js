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
const Note = require('./models/NoteSchema');

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

//Route to fetch all notes
app.get('/note', (req, res) => {
    if(typeof req.headers['email']==='undefined' || typeof req.headers['password']==='undefined'){
        res.statusCode = 400;
        res.json({
            status: "Bad Request",
        });
        return;
    }
    User.findOne({email: req.headers['email']}).then(async (user) => {
        if(user && user.password === req.headers['password']){
            Note.find({owner: req.headers['email']}).then(async (notes) => {
                if(notes.length !== 0){
                    res.statusCode = 200;
                    res.json({
                        // status: "Notes retreived",
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
            res.statusCode = 401;
            res.json({
                status: "Unauthorized activity to get notes"
            });
        }
        
    });
});

//Route to delete a note by its ID
app.delete('/note/:id', (req, res) => {
    if(typeof req.headers['email']==='undefined' || typeof req.headers['password']==='undefined'){
        res.statusCode = 400;
        res.json({
            status: "Bad Request",
        });
        return;
    }
    User.findOne({email: req.headers['email']}).then(async (user) => {
        if(user && user.password === req.headers['password']){
            let note_id = new mongoose.Types.ObjectId(req.params.id);
            Note.findOneAndDelete({owner: req.headers['email'], _id: note_id}, (err, note) => {
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
            res.statusCode = 401;
            res.json({
                status: "Unauthorized activity to delete notes"
            });
        }
        
    });
});

//Route to update a note by its ID
app.put('/note/:id', (req, res) => {
    if(typeof req.headers['email']==='undefined' || typeof req.headers['password']==='undefined'){
        res.statusCode = 400;
        res.json({
            status: "Bad Request",
        });
        return;
    }
    User.findOne({email: req.headers['email']}).then(async (user) => {
        if(user && user.password === req.headers['password']){
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
            res.statusCode = 401;
            res.json({
                status: "Unauthorized activity to update notes"
            });
        }
        
    });
});


//Route to add a simple note
app.post('/note',(req, res) => {
    if(typeof req.headers['email']==='undefined' || typeof req.headers['password']==='undefined'){
        res.statusCode = 400;
        res.json({
            status: "Bad Request",
        });
        return;
    }
    User.findOne({email: req.headers['email']}).then(async (user) => {
        try {
            if(user.password===req.headers['password']){
                let newNote = {
                    type: req.body.type,
                    title: req.body.title,
                    owner: req.headers['email'],
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
                res.statusCode = 403;
                res.json({
                    status: "Unauthorized attempt to create a note",
                });
            }
        } catch(err){
            res.statusCode = 404;
            res.json({
                status: 'User not found',
            });
        }
    });
});

//Route to update a checklist by its ID
app.put('/checklist/:id', (req, res) => {
    if(typeof req.headers['email']==='undefined' || typeof req.headers['password']==='undefined'){
        res.statusCode = 400;
        res.json({
            status: "Bad Request",
        });
        return;
    }
    User.findOne({email: req.headers['email']}).then(async (user) => {
        if(user && user.password === req.headers['password']){
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
            res.statusCode = 401;
            res.json({
                status: "Unauthorized activity to update notes"
            });
        }
        
    });
});

app.listen(3001);