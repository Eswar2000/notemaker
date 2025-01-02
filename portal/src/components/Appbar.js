import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingRoomRounded, PersonPinCircle, StickyNote2Rounded, ChecklistRounded, FormatListNumberedRounded } from '@mui/icons-material';
import { Drawer, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Divider, Toolbar, Typography, Box, AppBar } from '@mui/material';
import NotemakerLogo from '../assets/notemaker-logo.png';

function Appbar({onScreenChange}) {
    const navigate = useNavigate();
    
    const logout = () => {
        sessionStorage.clear();
        navigate('/signin');
    }

    const privilegedActions = [{'name': 'Logout', 'icon': <MeetingRoomRounded sx={{ color: '#023047', fontSize: '32px' }}/>, 'callback': logout}];
    const nonPrivilegedActions = [{'name': 'Manage Notes', 'icon': <StickyNote2Rounded sx={{ color: '#023047', fontSize: '32px' }}/>, 'callback': () => {onScreenChange(0)}}, {'name': 'Manage Checklists', 'icon': <ChecklistRounded sx={{ color: '#023047', fontSize: '32px' }}/>, 'callback': () => {onScreenChange(1)}}, {'name': 'Manage Ordered Lists', 'icon': <FormatListNumberedRounded sx={{ color: '#023047', fontSize: '32px' }}/>, 'callback': () => {onScreenChange(2)}}, {'name': 'View Profile', 'icon': <PersonPinCircle sx={{ color: '#023047', fontSize: '32px' }}/>, 'callback': () => {onScreenChange(3)}}];

    const DrawerList = (
        <Box sx={{ width: '375px'}} role="presentation">
            <img src={NotemakerLogo} height={250} width={250} alt='notemaker-logo' id='brand-logo'/>
            <List>
                {nonPrivilegedActions.map((action) => (
                    <ListItem key={action.name} disablePadding onClick={action.callback}>
                    <ListItemButton>
                        <ListItemIcon>
                            {action.icon}
                        </ListItemIcon>
                        <ListItemText primary={action.name} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {privilegedActions.map((action) => (
                    <ListItem key={action.name} disablePadding onClick={action.callback}>
                        <ListItemButton>
                            <ListItemIcon>
                                {action.icon}
                            </ListItemIcon>
                            <ListItemText primary={action.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar id="appbar" sx={{bgcolor: 'white', boxShadow: 'none'}}>
                <Toolbar>
                    <Typography id="brand-name">
                        DASHBOARD
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer anchor='right' variant='permanent' PaperProps={{sx: {backgroundColor: '#8ECAE6'}}}>
                {DrawerList}
            </Drawer>
        </Box>
    );
}

export default Appbar;
