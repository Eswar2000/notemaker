import {useState} from 'react';
import {Avatar, Box, Button, Container, Typography} from '@mui/material';

import Appbar from '../components/appbar';

function home() {
    return (
        <div className='dashboard'>
            <Appbar />
            <h1>Dashboard Here</h1>
        </div>
    );
}

export default home;