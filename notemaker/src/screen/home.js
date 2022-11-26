import {useState} from 'react';
import {Box, Snackbar} from '@mui/material';
import Appbar from '../components/Appbar';
import Bulletin from '../components/Bulletin';

function Home() {
    
    const [alertMessage, setAlertMessage] = useState("");
    const [snack, setSnack] = useState(false);

    const onSnackClose = () => {
        setSnack(false);
    }

    


    return (
        <div className='dashboard'>
            <Appbar />
            <Box height={8} />
            <Bulletin alertHandler={setSnack} alertMessageHandler={setAlertMessage} />
            <Snackbar open={snack} autoHideDuration={2500} onClose={onSnackClose} message={alertMessage} />
        </div>
    );
}

export default Home;