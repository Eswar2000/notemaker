import {useState} from 'react';
import FaceIcon from '@mui/icons-material/Face';
import {blue} from '@mui/material/colors';

import {Avatar, Box, Button, Container, Link, TextField, Typography} from '@mui/material';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <Container className='form-card' maxWidth='xs'>
        <Avatar className='avatars' sx={{ bgcolor: blue[700] }}>
            <FaceIcon fontSize='large' />
        </Avatar >
        <Box height={4} />
        <Typography component="h1" variant="h5">
        Sign In
        </Typography>
        <Box height={24}/>
        <Box component="form">
        <TextField size="small" id="email" label="Email Address" name="email" onChange = {event => setEmail(event.target.value)} required fullWidth />
        <Box height={24}/>
        <TextField size="small" id="password" name="password" label="Password" type="password" onChange={event => setPassword(event.target.value)} required fullWidth />
        <Box height={24}/>
        <Button type="submit" variant="contained" fullWidth>
            Sign In
        </Button>
        <Box height={4}/>
        <Link href="#" variant="body2">
            Forgot password?
        </Link>
        <Box height={4}/>
        <Link href="#" variant="body2">
            {"Don't have an account? Sign Up"}
        </Link>
        </Box>
      </Container>
  );
}

export default Login;
