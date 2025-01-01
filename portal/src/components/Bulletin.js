import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, TextField } from '@mui/material';
import SimpleNote from './SimpleNote';
import Checklist from './Checklist';
import OrderedList from './OrderedList';
import NoDataBanner from '../assets/no-data-banner.png';
import { NoteAddRounded } from '@mui/icons-material';



function Bulletin({ type, alertHandler, alertMessageHandler }) {

    const [notes, setNotes] = useState([]);
    const [userList, setUserList] = useState({});

    const [addNote, setAddNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteSubject, setNoteSubject] = useState("");
    const [noteBody, setNoteBody] = useState("");

    const getNotes = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` }
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/all-notes?type=' + type, requestOptions);
        let responseBody = await response.json();
        if (response.status === 200) {
            setNotes(responseBody['notes']);
        } else {
            setNotes([]);
        }
    }

    const getShareableUsers = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let userInfo = {};
        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` }
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/share-user', requestOptions);
        let responseBody = await response.json();
        if (response.status === 200) {
            responseBody['users'].forEach((elem) => {
                userInfo[elem.email] = { 'name': elem.name, 'id': elem._id };
            })
            setUserList(userInfo);
        } else {
            setUserList([]);
        }
    }

    const createNoteHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let note_body = { type: type, title: noteTitle };
        if (type === 'default') {
            note_body['subject'] = noteSubject;
            note_body['body'] = noteBody;
        }

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` },
            body: JSON.stringify(note_body)
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/note', requestOptions);
        let responseBody = await response.json();
        setAddNote(false);
        if (response.status === 200) {
            alertMessageHandler(responseBody.status);
            alertHandler(true);
            getNotes();
        }
    }

    const noteManager = {
        'default': (note) => <SimpleNote note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />,
        'list': (note) => <Checklist note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />,
        'ordered-list': (note) => <OrderedList note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />
    }

    useEffect(() => {
        getNotes();
        getShareableUsers();
    }, [])


    return (
        <Box id='dashboard-content' >
            <Button startIcon={<NoteAddRounded />} onClick={() => { setAddNote(true); }} sx={{ backgroundColor: '#FFB703', color: '#023047', borderRadius: '20px', fontFamily: '"Audiowide", sans-serif', fontWeight: 'bold', '&:hover': { backgroundColor: '#FB8500', transition: '0.25s ease-in' } }}>
                Create a note
            </Button>
            <Box height={24} />
            <Grid container spacing={4}>
                {
                    (notes && notes.length > 0) && <Grid item xs={9}>
                        <Grid container spacing={2}>
                            {notes.map((note, index) => {
                                return <Grid item xs={4} key={index}>{noteManager[type](note)}</Grid>
                            })}
                        </Grid>
                    </Grid>
                }
                {
                    (!notes || (notes && notes.length === 0)) &&
                    <Grid item xs={9}>
                        <Grid container spacing={4} direction='column' sx={{ justifyContent: "center", alignItems: "center" }}>
                            <Grid item xs={8}>
                                <img src={NoDataBanner} id='no-data-banner' alt='NoteMaker Home Banner' />
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant='h3' id='no-data-banner-text'>Your thoughts are still on vacation. Start jotting them down!</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                <Dialog open={addNote} onClose={() => { setAddNote(false); }}>
                    <DialogTitle>Create a new note</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill the form to add a new note to your board. They can be modified at any occasion.
                        </DialogContentText>
                        <TextField margin="dense" id="title" label="Note Title" onChange={event => { setNoteTitle(event.target.value) }} fullWidth />
                        {(type === 'default') && <TextField margin="dense" id="subject" label="Note Subject" onChange={event => { setNoteSubject(event.target.value) }} fullWidth />}
                        {(type === 'default') && <TextField margin="dense" id="body" label="Note Body" onChange={event => { setNoteBody(event.target.value) }} rows={4} fullWidth multiline />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setAddNote(false); }}>Cancel</Button>
                        <Button onClick={async () => createNoteHandler()}>Add</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Box>

    );
}



export default Bulletin;