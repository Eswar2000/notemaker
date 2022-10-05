import NoteBanner from '../notes_banner.png';
import {Avatar, Divider, Grid, Box, Paper, List, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {NoteAdd, Edit, PushPin} from '@mui/icons-material';
import Appbar from '../components/Appbar';

function home() {
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
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <NoteAdd fontSize='medium' />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Add Notes'/>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Edit fontSize='medium' />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Edit Notes'/>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PushPin fontSize='medium' />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Pin Notes'/>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default home;