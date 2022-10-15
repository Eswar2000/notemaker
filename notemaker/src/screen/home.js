import {useState} from 'react';
import NoteBanner from '../notes_banner.png';
import {Avatar, Button, TextField, Divider, Grid, Box, Paper, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { grey } from '@mui/material/colors';
import {NoteAdd, Edit, PushPin} from '@mui/icons-material';
import Appbar from '../components/Appbar';


function Home() {

    const [addNote, setAddNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteSubject, setNoteSubject] = useState("");
    const [noteBody, setNoteBody] = useState("");

    const simpleNoteHandler = async () => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', email: email, password: password},
            body: JSON.stringify({title: noteTitle, subject: noteSubject, body: noteBody})
        };
        let response = await fetch('http://localhost:3001/simpleNote', requestOptions);
        // let responseBody = await response.json();
        setAddNote(false);
    }

    return (
        <div className='dashboard'>
            <Appbar />
            <Box height={8} />
            <Grid container spacing={4}>
                <Grid item xs={9}>
                    <h1>Dashboard Here</h1>
                </Grid>
                <Grid item xs={3}>
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
                            <ListItem className='list-item'>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: grey[700] }}>
                                        <Edit fontSize='medium' />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Edit Notes' primaryTypographyProps={{fontFamily: 'Audiowide'}} secondary='Update existing notes'/>
                            </ListItem>
                            <ListItem className='list-item'>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: grey[700] }}>
                                        <PushPin fontSize='medium' />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Pin Notes' primaryTypographyProps={{fontFamily: 'Audiowide'}} secondary='Attach notes to the start of the list'/>
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
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;