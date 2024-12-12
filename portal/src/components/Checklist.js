import {useState} from 'react';
import {Card, Box, Button, TextField, InputAdornment, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, CardContent, CardActions, Typography} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuRow from './MenuRow';
import SharedUserList from './SharedUserList';



function Checklist ({note, shareableUsers, onModify, alertHandler, alertMessageHandler}) {
    const [checklistItem, setChecklistItem] = useState("");
    const [checklistTitle, setChecklistTitle] =  useState(note.title);
    const [titleEdit, setTitleEdit] = useState(false);
    const [noteSharedList, setNoteSharedList] = useState(note.shared);
    const [shareNoteDialog, setShareNoteDialog] = useState(false);

    const getNoteOwnership = () => {
        let email = sessionStorage.getItem('User_Email');
        let owner = note.owner;
        if(owner === email){
            return true;
        } else {
            return false;
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

    const updateChecklistHandler = async (type, modifier) => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let temp = {};
        if(type==="general" && modifier.length!==0){
            temp['action'] = type;
            temp['title'] = modifier;
        } else if(type==="check" && modifier >= 0 && modifier < note['menu'].length){
            temp['action'] = type;
            temp['index'] = modifier;
            temp['element'] = note["menu"][modifier];
        } else if(type==="uncheck" && modifier >= 0 && modifier < note['menuChecked'].length){
            temp['action'] = type;
            temp['index'] = modifier;
            temp['element'] = note["menuChecked"][modifier];
        } else if(type==="erase" && modifier >=0 && modifier < note['menuChecked'].length){
            temp['action'] = type;
            temp['index'] = modifier;
        } else if(type==="add" && modifier.length!==0){
            temp['action'] = type;
            temp['element'] = modifier;
        } else {
            alertMessageHandler("Invalid Checklist Action");
            alertHandler(true);
            return;
        }
        let requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`},
            body: JSON.stringify(temp)
        };
        let response = await fetch('http://localhost:3001/checklist/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            if(type==="add"){
                setChecklistItem("");
            }
            if(type==="general"){
                setTitleEdit(false);
            }
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }

    const deleteChecklistHandler = async () => {
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


    return (
        <Card className='check-list-card'>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography id='card-head'>
                            {note.title}
                        </Typography>
                        <Dialog open={titleEdit} onClose={() => {setTitleEdit(false);}}>
                            <DialogTitle>Edit Checklist</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Update checklist title and submit. Make sure that the field is not left empty.
                                </DialogContentText>
                                <TextField margin="dense" id="title" label="Note Title" value={checklistTitle} onChange={event => {setChecklistTitle(event.target.value)}} fullWidth />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {setTitleEdit(false);}}>Cancel</Button>
                                <Button onClick={async () => {updateChecklistHandler("general", checklistTitle);}}>Update</Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => {setShareNoteDialog(true);}} disabled={!getNoteOwnership()}>
                            <AttachmentIcon color={getNoteOwnership() ? 'info' : 'disabled'}/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Box height={8} />
                <TextField
                    label="Add Item"
                    size='small'
                    value={checklistItem}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position='start'>
                            <IconButton onClick={async () => {updateChecklistHandler("add", checklistItem);}}>
                                <AddCircleIcon color='info'/>
                            </IconButton>
                        </InputAdornment>
                    )
                    }}
                    onChange={event => {setChecklistItem(event.target.value)}}
                    fullWidth
                />
                {note.menu && note['menu'].map((element,index)=>{
                    return <MenuRow element={element} key={index} pos={index} checked={false} toggle={updateChecklistHandler}/>
                })}
                {note["menu"].length!==0 && note["menuChecked"].length!==0 && <Divider variant='middle' />}
                {note.menuChecked && note['menuChecked'].map((element,index)=>{
                    return <MenuRow element={element} key={index} pos={index} checked={true} toggle={updateChecklistHandler}/>
                })}

            </CardContent>
            <CardActions className='action-menu'>
                <IconButton onClick={() => {setTitleEdit(true);}}>
                    <EditIcon color='success'/>
                </IconButton>
                <SharedUserList shared={noteSharedList} shareableUserPool={shareableUsers} shareNoteBool={shareNoteDialog} shareNoteBoolHandler={setShareNoteDialog} sharedUserHandler={setNoteSharedList} sharedNoteUpdateHandler={shareNoteHandler}/>
                <IconButton onClick={() => {deleteChecklistHandler()}} disabled={!getNoteOwnership()}>
                    <DeleteIcon color={getNoteOwnership() ? 'error' : 'disabled'}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default Checklist;