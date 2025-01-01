import {useState} from 'react';
import {Box, Snackbar} from '@mui/material';
import Appbar from '../components/Appbar';
import Bulletin from '../components/Bulletin';
import Profile from '../components/Profile';

function Home() {
    const [subscreenIdx, setSubscreenIdx] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const [snack, setSnack] = useState(false);

    const subscreens = [<Bulletin type='default' alertHandler={setSnack} alertMessageHandler={setAlertMessage} key='view-simple-note'/>, <Bulletin type='list' alertHandler={setSnack} alertMessageHandler={setAlertMessage} key='view-checklist'/>, <Bulletin type='ordered-list' alertHandler={setSnack} alertMessageHandler={setAlertMessage} key='view-ordered-list' />, <Profile key='profile'/>]

    const onSnackClose = () => {
        setSnack(false);
    }

    const handleScreenChange = (index) => {
        setSubscreenIdx(index);
    }

    


    return (
        <div className='dashboard'>
            <Appbar onScreenChange={handleScreenChange} />
            <Box height={8} />
            {subscreens[subscreenIdx]}
            <Snackbar open={snack} autoHideDuration={2500} onClose={onSnackClose} message={alertMessage} />
        </div>
    );
}

export default Home;