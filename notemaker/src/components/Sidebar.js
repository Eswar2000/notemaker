import {useState} from 'react';
import NoteBanner from '../notes_banner.png';
import {Avatar, Button, TextField, Divider, Paper, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { grey } from '@mui/material/colors';
import {NoteAdd, Edit, PushPin} from '@mui/icons-material';


function Sidebar ({onModify, alertHandler, alertMessageHandler}) {
    
    const [addNote, setAddNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteSubject, setNoteSubject] = useState("");
    const [noteBody, setNoteBody] = useState("");
    const [checklistTitle, setChecklistTitle] = useState("");
    const [addChecklist, setAddChecklist] = useState(false);
    
    const checklistHandler = async () => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', email: email, password: password},
            body: JSON.stringify({type:'list',title: checklistTitle})
        };
        let response = await fetch('http://localhost:3001/note', requestOptions);
        let responseBody = await response.json();
        setAddChecklist(false);
        if(response.status === 200){
            alertMessageHandler(responseBody.status);
            alertHandler(true);
            onModify();
        }
    }

    const simpleNoteHandler = async () => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', email: email, password: password},
            body: JSON.stringify({type:'default',title: noteTitle, subject: noteSubject, body: noteBody})
        };
        let response = await fetch('http://localhost:3001/note', requestOptions);
        let responseBody = await response.json();
        setAddNote(false);
        if(response.status === 200){
            alertMessageHandler(responseBody.status);
            alertHandler(true);
            onModify();
        }
    }
    
    return (
        <Paper className='side-panel' elevation={6}>
            <img src={NoteBanner} id='home-banner' alt='NoteMaker Home Banner'/>
            <Divider />
            <List>
                <ListItem className='list-item' onClick={() => {setAddNote(true);}}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: grey[700] }}>
                            <NoteAdd fontSize='medium' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary='Add Notes' primaryTypographyProps={{fontFamily: 'Audiowide'}} secondary='Create a new note' />
                </ListItem>
                <ListItem className='list-item' onClick={() => {setAddChecklist(true);}}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: grey[700] }}>
                            <Edit fontSize='medium' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary='Add checklist' primaryTypographyProps={{fontFamily: 'Audiowide'}} secondary='Create a checklist'/>
                </ListItem>
                <ListItem className='list-item'>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: grey[700] }}>
                            <PushPin fontSize='medium' />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary='Sort Notes' primaryTypographyProps={{fontFamily: 'Audiowide'}} secondary='Arrange notes in order'/>
                </ListItem>
            </List>
            <Dialog open={addNote} onClose={() => {setAddNote(false);}}>
                <DialogTitle>Add a simple note</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a simple note, fill in the details required. These can be later updated as per requirements.
                    </DialogContentText>
                    <TextField margin="dense" id="title" label="Note Title" onChange={event => {setNoteTitle(event.target.value)}} fullWidth />
                    <TextField margin="dense" id="subject" label="Note Subject" onChange={event => {setNoteSubject(event.target.value)}} fullWidth />
                    <TextField margin="dense" id="body" label="Note Body" onChange={event => {setNoteBody(event.target.value)}} rows={4} fullWidth multiline/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setAddNote(false);}}>Cancel</Button>
                    <Button onClick={async () => simpleNoteHandler()}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addChecklist} onClose={() => {setAddChecklist(false);}}>
                <DialogTitle>Add a checklist</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a checklist, fill in the title. Menu items can be added later.
                    </DialogContentText>
                    <TextField margin="dense" id="title" label="Checklist Title" onChange={event => {setChecklistTitle(event.target.value)}} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setAddChecklist(false);}}>Cancel</Button>
                    <Button onClick={async () => checklistHandler()}>Add</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default Sidebar;