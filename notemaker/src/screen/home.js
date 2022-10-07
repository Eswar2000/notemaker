import NoteBanner from '../notes_banner.png';
import {Avatar, Divider, Grid, Box, Paper, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import { grey } from '@mui/material/colors';
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
                            <ListItem className='list-item'>
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
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default home;