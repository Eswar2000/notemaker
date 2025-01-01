import {useState} from 'react';
import {Card, Button, Container, TextField, Box, Divider, IconButton, CardContent, CardActions, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OwnershipService from '../services/OwnershipService';
import NoteHeader from './NoteHeader';

function SimpleNote({note, shareableUsers, onModify, alertHandler, alertMessageHandler}){

    const [editNote, setEditNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState(note.title);
    const [noteSubject, setNoteSubject] = useState(note.subject);
    const [noteBody, setNoteBody] = useState(note.body);

    const deleteNoteHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`}
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/note/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }

    const updateNoteHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let temp = {};
        if(noteTitle.length !==0 && noteTitle !== note.title){
            temp['title'] = noteTitle;
        }
        if(noteSubject.length !==0 && noteSubject !== note.subject){
            temp['subject'] = noteSubject;
        }
        if(noteBody.length !==0 && noteBody !== note.body){
            temp['body'] = noteBody;
        }

        if(Object.keys(temp).length!==0){
            let requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`},
                body: JSON.stringify(temp)
            };
            let response = await fetch(process.env.REACT_APP_API_URL + '/note/'+note._id, requestOptions);
            let responseBody = await response.json();
            if(response.status === 200){
                onModify();
                alertMessageHandler(responseBody.status);
                alertHandler(true);
            }

        }

        setEditNote(false);
        

    }

    return (
        <Card id='note-card'>
            <CardContent id='note-card-content'>
                <NoteHeader note={note} shareableUsers={shareableUsers} onModify={onModify} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />
                <Divider />
                <Container disableGutters id='note-card-body'>
                    <Box height={8}/>
                    <Typography id='note-card-subheading'>
                        {note.subject}
                    </Typography>
                    <Typography component='p' variant='body2'>
                        {note.body}
                    </Typography>
                </Container>
            </CardContent>
            <CardActions id='note-action-menu'>
                <IconButton onClick={() => {setEditNote(true);}}>
                    <EditIcon color='success'/>
                </IconButton>
                <Dialog open={editNote} onClose={() => {setEditNote(false);}}>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update any portion of the note and submit. Make sure that no fields are left empty.
                        </DialogContentText>
                        <TextField margin="dense" id="title" label="Note Title" value={noteTitle} onChange={event => {setNoteTitle(event.target.value)}} fullWidth />
                        <TextField margin="dense" id="subject" label="Note Subject" value={noteSubject} onChange={event => {setNoteSubject(event.target.value)}} fullWidth />
                        <TextField margin="dense" id="body" label="Note Body" value={noteBody} onChange={event => {setNoteBody(event.target.value)}} rows={4} fullWidth multiline/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setEditNote(false);}}>Cancel</Button>
                        <Button onClick={async () => updateNoteHandler()}>Update</Button>
                    </DialogActions>
                </Dialog>
                <IconButton onClick={() => {deleteNoteHandler()}} disabled={!OwnershipService.getNoteOwnership(note.owner)}>
                    <DeleteIcon color={OwnershipService.getNoteOwnership(note.owner) ? 'error' : 'disabled'}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default SimpleNote;