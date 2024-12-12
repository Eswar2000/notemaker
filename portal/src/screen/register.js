import {useState} from 'react';
import FaceIcon from '@mui/icons-material/Face';
import {blue} from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import {Link, useNavigate} from 'react-router-dom';
import {Avatar, Box, Button, Container, TextField, Typography} from '@mui/material';




function Register() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertFlag, setAlertFlag] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    const SubmitHandler = async () => {
        if(password===confirmPassword){
            let requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: name, phone: phone, email: email, password: password})
            };
            let response = await fetch('http://localhost:3001/register', requestOptions);
            let responseBody = await response.json();
            if (response.status === 200) {
                setAlertFlag(1);
                setAlertMessage(responseBody.status);
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);
            } else {
                setAlertFlag(-1);
                setAlertMessage(responseBody.status);
            }
        } else {
            setAlertFlag(-1);
            setAlertMessage("Passwords don't match");
        }
        
    }
    
  return (
    <div className='screen'>
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
        <TextField size="small" id="password" label="Password" name="password" type="password" onChange = {event => setPassword(event.target.value)} required fullWidth autoComplete='off'/>
        <Box height={24}/>
        <TextField size="small" id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" onChange={event => setConfirmPassword(event.target.value)} required fullWidth autoComplete='off' />
        <Box height={24}/>
        <Button variant="contained" onClick={async () => SubmitHandler()} fullWidth>
            Register
        </Button>
        <Box height={8}/>
        {alertFlag === -1 && <Alert severity="error">{alertMessage}</Alert>}
        {alertFlag === 1 && <Alert severity="success">{alertMessage}</Alert>}
        <Box height={4}/>
        <Box height={4}/>
        <Link to="/signin" variant="body2">
            {"Have an account already? Sign In"}
        </Link>
        </Box>
      </Container>
    </div>
  );
}

export default Register;
