import {useState} from 'react';
import FaceIcon from '@mui/icons-material/Face';
import {blue} from '@mui/material/colors';
import {Link, useNavigate} from 'react-router-dom';
import Alert from '@mui/material/Alert';

import {Avatar, Box, Button, Container, TextField, Typography} from '@mui/material';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertFlag, setAlertFlag] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const SubmitHandler = async () => {
            let requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, password: password})
            };
            let response = await fetch('http://localhost:3001/login', requestOptions);
            let responseBody = await response.json();
            if (response.status === 200) {
                navigate('/home');
            } else {
                setAlertFlag(-1);
                setAlertMessage(responseBody.status);
            }
    }

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
        <Button variant="contained" onClick={async () => SubmitHandler()} fullWidth>
            Sign In
        </Button>
        <Box height={8}/>
        {alertFlag === -1 && <Alert severity="error">{alertMessage}</Alert>}
        <Box height={4}/>
        <Box height={4}/>
        <Link to="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
        </Link>
        </Box>
      </Container>
  );
}

export default Login;
