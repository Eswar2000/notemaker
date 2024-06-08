import {useState} from 'react';
import {Card, Box, Button, TextField, InputAdornment, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, CardContent, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuRow from './MenuRow';



function Checklist ({note, onModify, alertHandler, alertMessageHandler}) {
    const [checklistItem, setChecklistItem] = useState("");
    const [checklistTitle, setChecklistTitle] =  useState(note.title);
    const [titleEdit, setTitleEdit] = useState(false);

    const updateChecklistHandler = async (type, modifier) => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
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
            headers: {'Content-Type': 'application/json', email: email, password: password},
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
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', email: email, password: password}
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
                    <Grid item xs={9}>
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
                    <Grid item xs={1}>
                        <IconButton onClick={() => {setTitleEdit(true);}}>
                            <EditIcon color='success'/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={() => {deleteChecklistHandler()}}>
                            <DeleteIcon color='error'/>
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
        </Card>
    );
}

export default Checklist;