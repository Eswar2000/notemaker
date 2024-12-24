import {useState} from 'react';
import {Grid, IconButton, Typography} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SharedUserList from './SharedUserList';
import OwnershipService from '../services/OwnershipService';




function NoteHeader({note, shareableUsers, onModify, alertHandler, alertMessageHandler}){
    const [noteSharedList, setNoteSharedList] = useState(note.shared);
    const [shareNoteDialog, setShareNoteDialog] = useState(false);

    const timeConvertor = (dateTime) => {
        let date_parsed = new Date(dateTime);
        let date_str = date_parsed.toString();
        let date_arr = date_str.split(" ");
        return date_arr[2]+" "+ date_arr[1]+", "+date_arr[3];
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
        let response = await fetch(process.env.REACT_APP_API_URL + '/note/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }


    return (
        <Grid container spacing={3} className='note-header'>
            <Grid item xs={10}>
                <Typography id='card-head'>
                    {note.title}
                </Typography>
                <Typography id='card-time'>
                    Updated On {timeConvertor(note.updatedAt)}
                </Typography>
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={() => {setShareNoteDialog(true);}} disabled={!OwnershipService.getNoteOwnership(note.owner)}>
                    <AttachmentIcon color={OwnershipService.getNoteOwnership(note.owner) ? 'info' : 'disabled'}/>
                </IconButton>
            </Grid>
            <SharedUserList shared={noteSharedList} shareableUserPool={shareableUsers} shareNoteBool={shareNoteDialog} shareNoteBoolHandler={setShareNoteDialog} sharedUserHandler={setNoteSharedList} sharedNoteUpdateHandler={shareNoteHandler}/>
        </Grid>
    )
}

export default NoteHeader;