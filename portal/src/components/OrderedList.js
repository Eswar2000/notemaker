import {useState} from 'react';
import {Card, Container, List, TextField, InputAdornment, IconButton, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {DndContext, closestCorners} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OwnershipService from '../services/OwnershipService';
import Task from './Task';
import NoteHeader from './NoteHeader';

function OrderedList({note, shareableUsers, onModify, alertHandler, alertMessageHandler}){
    const transformOrderedList = (tasklist) => {
        return tasklist.map((item, index) => {
            return ({
                id: String(index),
                task: item
            })
        })
    }

    const reduceOrderedList = (tasklist) => {
        return tasklist.map((item) => {return item.task});
    }

    const [orderedListItem, setOrderedListItem] = useState("");
    const [orderedListTitle, setOrderedListTitle] = useState(note.title);
    const [titleEdit, setTitleEdit] = useState(false);

    const editStyle = {color: '#219EBC'};
    const deleteStyle = {color: '#FB8500'};
    const disabledStyle = {color: '#F5D0A9'};

    const getTaskPosition = (tasklist, id) => {
        return tasklist.findIndex((task) => task.id === id);
    }

    const updateOrderedListHandler = async (type, modifier) => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let temp = {};
        if(type==="general" && modifier.length!==0){
            temp['action'] = type;
            temp['title'] = modifier;
        } else if(type==="add" && modifier.length!==0){
            temp['action'] = type;
            temp['element'] = modifier;
        } else if(type==="erase" && modifier >=0 && modifier < note['orderedList'].length) {
            temp['action'] = type;
            temp['index'] = modifier;
        } else if(type==="reorder" && modifier){
            temp['action'] = type;
            temp['orderedlist'] = modifier;
        }
        else {
            alertMessageHandler("Invalid Ordered List Action");
            alertHandler(true);
            return;
        }
        let requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`},
            body: JSON.stringify(temp)
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/orderedlist/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            if(type==="add"){
                setOrderedListItem("");
            }
            if(type==="general"){
                setTitleEdit(false);
            }
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }

    const deleteOrderedListHandler = async () => {
        let auth_token = sessionStorage.getItem('Auth_Token');
        let requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}`}
        };
        let response = await fetch(process.env.REACT_APP_API_URL + '/note/'+note._id, requestOptions);
        let responseBody = await response.json();
        if(response.status === 200){
            onModify();
            alertMessageHandler(responseBody.status);
            alertHandler(true);
        }
    }

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if(!active || !over || active.id === over.id){
            return;
        } else {
            let tempOrderedList = transformOrderedList(note.orderedList);
            const originalPosition = getTaskPosition(tempOrderedList, active.id);
            const newPosition = getTaskPosition(tempOrderedList, over.id);
            tempOrderedList = arrayMove(tempOrderedList, originalPosition, newPosition);
            let newOrderedList = reduceOrderedList(tempOrderedList);
            updateOrderedListHandler("reorder", newOrderedList);
        }
    }

    return (
        <Card id='note-card'>
            <CardContent id='note-card-content'>
                <NoteHeader note={note} shareableUsers={shareableUsers} onModify={onModify} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />
                <TextField
                    label="Add Item"
                    size='small'
                    value={orderedListItem}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position='start'>
                            <IconButton onClick={async () => {updateOrderedListHandler("add", orderedListItem)}} disabled={!orderedListItem.length}>
                                <AddCircleIcon color={!orderedListItem.length ? 'disabled' : 'info'}/>
                            </IconButton>
                        </InputAdornment>
                    )
                    }}
                    onChange={event => {setOrderedListItem(event.target.value)}}
                    fullWidth
                />
                <Container disableGutters id='note-card-body'>
                    <DndContext collisionDetection={closestCorners} onDragEnd={(event) => {handleDragEnd(event)}}>
                        <List>
                            <SortableContext items={transformOrderedList(note.orderedList)} strategy={verticalListSortingStrategy}>
                                {
                                    transformOrderedList(note.orderedList).map((item) => (
                                        <Task key={item.id} id={item.id} task={item.task} pos={parseInt(item.id, 10)} deleteTask={updateOrderedListHandler}/>
                                    ))
                                }
                            </SortableContext>
                        </List>
                    </DndContext>
                </Container>
            </CardContent>
            <CardActions id='note-action-menu'>
                <IconButton onClick={() => {setTitleEdit(true);}}>
                    <EditIcon sx={editStyle}/>
                </IconButton>
                <IconButton onClick={() => {deleteOrderedListHandler()}} disabled={!OwnershipService.getNoteOwnership(note.owner)}>
                    <DeleteIcon sx={OwnershipService.getNoteOwnership(note.owner) ? deleteStyle : disabledStyle}/>
                </IconButton>
                <Dialog open={titleEdit} onClose={() => {setTitleEdit(false);}}>
                    <DialogTitle>Edit Ordered List</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update ordered list title and submit. Make sure that the field is not left empty.
                        </DialogContentText>
                        <TextField margin="dense" id="title" label="Ordered List Title" value={orderedListTitle} onChange={event => {setOrderedListTitle(event.target.value)}} fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setTitleEdit(false);}}>Cancel</Button>
                        <Button onClick={async () => {updateOrderedListHandler("general", orderedListTitle);}}>Update</Button>
                    </DialogActions>
                </Dialog>
            </CardActions>
        </Card>
    )
}

export default OrderedList;