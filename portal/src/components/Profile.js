import {Grid, Card, CardContent} from '@mui/material';
import ProfileBanner from '../assets/profile-banner.png';



function Profile(){
    return (
        <Grid container id='dashboard-content' spacing={2}>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <img src={ProfileBanner} id='profile-banner' alt='NoteMaker Profile Banner' />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={7}>
                <h1>Bye There</h1>
            </Grid>
        </Grid>
    );
}

export default Profile;