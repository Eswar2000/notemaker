import {useState} from 'react';
import {Card, Button, TextField, Grid, Box, Divider, IconButton, CardContent, CardActions, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SharedUserList from './SharedUserList';

function SimpleNote({note, shareableUsers, onModify, alertHandler, alertMessageHandler}){

    const [editNote, setEditNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState(note.title);
    const [noteSubject, setNoteSubject] = useState(note.subject);
    const [noteBody, setNoteBody] = useState(note.body);
    const [noteSharedList, setNoteSharedList] = useState(note.shared);
    const [shareNoteDialog, setShareNoteDialog] = useState(false);


    const timeConvertor = () => {
        let date_parsed = new Date(note.updatedAt);
        let date_str = date_parsed.toString();
        let date_arr = date_str.split(" ");
        return date_arr[2]+" "+ date_arr[1]+", "+date_arr[3];
    }

    const getNoteOwnership = () => {
        let email = sessionStorage.getItem('User_Email');
        let owner = note.owner;
        if(owner === email){
            return true;
        } else {
            return false;
        }
    }

    const deleteNoteHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`}
        };
        let response = await fetch('http://localhost:3001/note/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }

    const shareNoteHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let share_body = {
            'shared': noteSharedList
        };
        let requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`},
            body: JSON.stringify(share_body)
        };
        let response = await fetch('http://localhost:3001/note/'+note._id, requestOptions);
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
            let response = await fetch('http://localhost:3001/note/'+note._id, requestOptions);
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
        <Card className='simple-note-card'>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography id='card-head'>
                            {note.title}
                        </Typography>
                        <Typography id='card-time'>
                            Updated On {timeConvertor()}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => {setShareNoteDialog(true);}} disabled={!getNoteOwnership()}>
                            <AttachmentIcon color={getNoteOwnership() ? 'info' : 'disabled'}/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Box height={8}/>
                <Divider variant='inset'/>
                <Box height={8}/>
                <Typography id='card-sub'>
                    {note.subject}
                </Typography>
                <Typography component='p' variant='body2'>
                    {note.body}
                </Typography>
            </CardContent>
            <CardActions className='action-menu'>
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
                <SharedUserList shared={noteSharedList} shareableUserPool={shareableUsers} shareNoteBool={shareNoteDialog} shareNoteBoolHandler={setShareNoteDialog} sharedUserHandler={setNoteSharedList} sharedNoteUpdateHandler={shareNoteHandler}/>
                <IconButton onClick={() => {deleteNoteHandler()}} disabled={!getNoteOwnership()}>
                    <DeleteIcon color={getNoteOwnership() ? 'error' : 'disabled'}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default SimpleNote;