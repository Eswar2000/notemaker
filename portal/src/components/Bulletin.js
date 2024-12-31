import {useState, useEffect} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import Sidebar from './Sidebar';
import SimpleNote from './SimpleNote';
import Checklist from './Checklist';
import OrderedList from './OrderedList';
import NoDataBanner from '../assets/no-data-banner.png';



function Bulletin({alertHandler, alertMessageHandler}){

    const [notes, setNotes] = useState([]);
    const [userList, setUserList] = useState({});


    const getNotes = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`}
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/all-notes', requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            setNotes(responseBody['notes']);
        } else {
            setNotes([]);
        }
    }

    const getShareableUsers = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let userInfo = {};
        let requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`}
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/share-user', requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            responseBody['users'].forEach((elem) => {
                userInfo[elem.email] = {'name': elem.name, 'id': elem._id};
            })
            setUserList(userInfo);
        } else {
            setUserList([]);
        }
    }

    useEffect(() => {
        getNotes();
        getShareableUsers();
    },[])


    return (
        <Grid id='dashboard-content' container spacing={4}>
            {
                (notes && notes.length > 0) && <Grid item xs={9}>
                    <Grid container spacing={2}>
                        {notes.map((note,index)=>{
                            if(note.type==='default'){
                                return <Grid item xs={4} key={index}><SimpleNote note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler}/></Grid>
                            } else {
                                return null;
                            }
                        })}
                    </Grid>
                    <Box height={24} />
                    <Grid container spacing={2}>
                        {notes.map((note,index)=>{
                            if(note.type==='list'){
                                return <Grid item xs={4} key={index}><Checklist note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} /></Grid>
                            } else {
                                return null;
                            }
                        })}
                    </Grid>
                    <Box height={24} />
                    <Grid container spacing={2}>
                        {notes.map((note,index)=>{
                            if(note.type==='ordered-list'){
                                return <Grid item xs={4} key={index}><OrderedList note={note} shareableUsers={userList} onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} /></Grid>
                            } else {
                                return null;
                            }
                        })}
                    </Grid>
                </Grid>
            }
            {
                (!notes || (notes && notes.length === 0)) &&
                    <Grid item xs={9}>
                        <Grid container spacing={4} direction='column' sx={{justifyContent: "center", alignItems: "center"}}>
                            <Grid item xs={8}>
                                <img src={NoDataBanner} id='no-data-banner' alt='NoteMaker Home Banner'/>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant='h3' id='no-data-banner-text'>Your thoughts are still on vacation. Start jotting them down!</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
            }
            <Grid item xs={3}>
                <Sidebar onModify={getNotes} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler}/>
            </Grid>
        </Grid>
    );
}



export default Bulletin;