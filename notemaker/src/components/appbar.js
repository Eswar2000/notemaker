import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

function appbar(){
    return (
        <Box>
            <AppBar id="appbar" position="sticky">
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                        NoteMaker
                    </Typography>
                    <IconButton>
                        <PersonPinCircleRoundedIcon fontSize='large'/>
                    </IconButton>
                    <IconButton>
                        <MeetingRoomRoundedIcon fontSize='large'/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default appbar;
