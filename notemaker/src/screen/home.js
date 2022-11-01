import {useState, useEffect} from 'react';
import {Grid, Box, Snackbar} from '@mui/material';
import Appbar from '../components/Appbar';
import Sidebar from '../components/Sidebar';
import SimpleNote from '../components/SimpleNote';
import Checklist from '../components/Checklist';


function Home() {
    const [notes, setNotes] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [snack, setSnack] = useState(false);

    const onSnackClose = () => {
        setSnack(false);
    }

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
        <div className='dashboard'>
            <Appbar />
            <Box height={8} />
            <Grid id={'dashboard-content'} container spacing={4}>
                <Grid item xs={9}>
                    <Grid container id='bulletin' spacing={2}>
                        {notes && notes.map((note,index)=>{
                            if(note.type==='default'){
                                return <Grid item xs={4} key={index}><SimpleNote note={note} onModify={getNotes} alertHandler={setSnack} alertMessageHandler={setAlertMessage}/></Grid>
                            } else {
                                return null;
                            }
                        })}
                    </Grid>
                    <Grid container id='bulletin' spacing={2}>
                        {notes && notes.map((note,index)=>{
                            if(note.type==='list'){
                                return <Grid item xs={4} key={index}><Checklist note={note} onModify={getNotes} alertHandler={setSnack} alertMessageHandler={setAlertMessage} /></Grid>
                            } else {
                                return null;
                            }
                        })}
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Sidebar onModify={getNotes} alertHandler={setSnack} alertMessageHandler={setAlertMessage}/>
                </Grid>
            </Grid>
            <Snackbar open={snack} autoHideDuration={2500} onClose={onSnackClose} message={alertMessage} />
        </div>
    );
}

export default Home;