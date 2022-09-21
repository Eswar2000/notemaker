import {useState} from 'react';
import FaceIcon from '@mui/icons-material/Face';
import {blue} from '@mui/material/colors';

import {Avatar, Box, Button, Container, Link, TextField, Typography} from '@mui/material';


function Register() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
  return (
    <Container className='form-card' maxWidth='xs'>
        <Avatar className='avatars' sx={{bgcolor: blue[700]}}>
            <FaceIcon fontSize='large' />
        </Avatar >
        <Box height={4} />
        <Typography component="h1" variant="h5">
            Register Here
        </Typography>
        <Box height={24}/>
        <Box component="form">
        <TextField size="small" id="name" label="Name" name="name" onChange = {event => setName(event.target.value)} required fullWidth />
        <Box height={24}/>
        <TextField size="small" id="email" label="Email Address" name="email" onChange = {event => setEmail(event.target.value)} required fullWidth />
        <Box height={24}/>
        <TextField size="small" id="phone" name="phone" label="Phone Number" onChange={event => setPhone(event.target.value)} required fullWidth />
        <Box height={24}/>
        <TextField size="small" id="password" label="Password" name="password" onChange = {event => setPassword(event.target.value)} required fullWidth />
        <Box height={24}/>
        <TextField size="small" id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" onChange={event => setConfirmPassword(event.target.value)} required fullWidth />
        <Box height={24}/>
        <Button type="submit" variant="contained" fullWidth>
            Register
        </Button>
        <Box height={4}/>
        <Link href="#" variant="body2">
            {"Forgot password?"}
        </Link>
        <Box height={4}/>
        <Link href="#" variant="body2">
            {"Have an account already? Sign In"}
        </Link>
        </Box>
      </Container>
  );
}

export default Register;
