import {Card, TextField, InputAdornment, Grid, Box, Divider, IconButton, CardContent, CardActions, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuRow from './MenuRow';



function Checklist ({note, onModify, alertHandler, alertMessageHandler}) {

    const updateChecklistHandler = async (type, modifier) => {
        let [email, password] = sessionStorage.getItem('Auth_Token').split("-");
        let temp = {};
        if(type==="general" && modifier.length!==0){
            temp['action'] = type;
            temp['title'] = modifier;
        } else if(type==="check" && modifier >= 0 && modifier < note['menu'].length){
            temp['action'] = type;
            temp['index'] = modifier;
            temp['element'] = note["menu"][modifier];
        } else if(type==="uncheck" && modifier >= 0 && modifier < note['menuChecked'].length){
            temp['action'] = type;
            temp['index'] = modifier;
            temp['element'] = note["menuChecked"][modifier];
        } else {
            alertMessageHandler("Invalid Checklist Action");
            alertHandler(true);
            return;
        }
        let requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', email: email, password: password},
            body: JSON.stringify(temp)
        };
        let response = await fetch('http://localhost:3001/checklist/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }


    return (
        <Card className='check-list-card'>
            <CardContent>
                <Typography id='card-head'>
                    {note.title}
                </Typography>
                <TextField
                    label="Add Item"
                    size='small'
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position='start'>
                            <IconButton>
                                <AddCircleIcon color='info'/>
                            </IconButton>
                        </InputAdornment>
                    )
                    }}
                    fullWidth
                />
                {note.menu && note['menu'].map((element,index)=>{
                    return <MenuRow element={element} key={index} pos={index} checked={false} toggle={updateChecklistHandler}/>
                })}
                <Divider variant='middle' />
                {note.menuChecked && note['menuChecked'].map((element,index)=>{
                    return <MenuRow element={element} key={index} pos={index} checked={true} toggle={updateChecklistHandler}/>
                })}

            </CardContent>
        </Card>
    );
}

export default Checklist;