import {Grid, Card, CardContent, Box, Typography, TextField} from '@mui/material';
import ProfileBanner from '../profile_banner.png'



function Profile(){
    return (
        <Grid container id='dashboard-content' spacing={2}>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <img src={ProfileBanner} id='profile-banner' alt='NoteMaker Profile Banner' />
                        <Box height={8} />
                        <Typography>
                            Your profile describes your personal data and the details regarding your notes. Please feel free to update your profile as required
                            to maintain latest informations.
                        </Typography>
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