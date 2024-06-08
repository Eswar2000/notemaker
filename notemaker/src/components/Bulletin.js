import {useState, useEffect} from 'react';
import {Box, Grid} from '@mui/material';
import Sidebar from './Sidebar';
import SimpleNote from './SimpleNote';
import Checklist from './Checklist';



function Bulletin({alertHandler, alertMessageHandler}){

    const [notes, setNotes] = useState([]);


    const getNotes = async () => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', email: email, password: password}
        };
        let response = await fetch('http://localhost:3001/note', requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            setNotes(responseBody['notes']);
        }
    }

    useEffect(() => {
        getNotes();
    },[])


    return (
        <Grid id={'dashboard-content'} container spacing={4}>
            <Grid item xs={9}>
                <Grid container spacing={2}>
                    {notes && notes.map((note,index)=>{
                        if(note.type==='default'){
                            return <Grid item xs={4} key={index}><SimpleNote note={note} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler}/></Grid>
                        } else {
                            return null;
                        }
                    })}
                </Grid>
                <Box height={24} />
                <Grid container spacing={2}>
                    {notes && notes.map((note,index)=>{
                        if(note.type==='list'){
                            return <Grid item xs={4} key={index}><Checklist note={note} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} /></Grid>
                        } else {
                            return null;
                        }
                    })}
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Sidebar onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler}/>
            </Grid>
        </Grid>
    );
}



export default Bulletin;