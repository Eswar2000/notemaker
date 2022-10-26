import {Card, Grid, Box, Divider, IconButton, CardContent, CardActions, Typography} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SimpleNote({note, onDelete}){


    const timeConvertor = () => {
        let date_parsed = new Date(note.updatedAt);
        let date_str = date_parsed.toString();
        let date_arr = date_str.split(" ");
        return date_arr[2]+" "+ date_arr[1]+", "+date_arr[3];
    }

    const deleteNote = async () => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', email: email, password: password}
        };
        let response = await fetch('http://localhost:3001/note/'+note._id, requestOptions);
        // let responseBody = await response.json();
        if(response.status === 200){
            onDelete();
        }
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
                        <IconButton>
                            <AttachmentIcon color='info'/>
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
                <IconButton>
                    <EditIcon color='success'/>
                </IconButton>
                <IconButton onClick={() => {deleteNote()}}>
                    <DeleteIcon color='error'/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default SimpleNote;