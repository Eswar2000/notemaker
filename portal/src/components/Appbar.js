import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import {useNavigate} from 'react-router-dom';

function Appbar(){
    
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.clear();
        navigate('/signin');
    }

    return (
        <Box>
            <AppBar id="appbar">
                <Toolbar>
                    <Typography id="brand-name">
                        NOTEMAKER
                    </Typography>
                    <IconButton>
                        <PersonPinCircleRoundedIcon className='app-icons' fontSize='large'/>
                    </IconButton>
                    <IconButton onClick={() => logout()}>
                        <MeetingRoomRoundedIcon className='app-icons' fontSize='large'/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Appbar;
