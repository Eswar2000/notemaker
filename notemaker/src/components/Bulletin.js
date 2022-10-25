import {Grid} from '@mui/material';
import SimpleNote from './SimpleNote';

function Bulletin({notes}) {
    return (
        <Grid container id='bulletin' spacing={2}>
            {notes && notes.map((note,index)=>{
                return <Grid item xs={4} key={index}><SimpleNote body={note.body} subject={note.subject} title={note.title} created={note.updatedAt} /></Grid>
            })}
        </Grid>
    );
}

export default Bulletin;