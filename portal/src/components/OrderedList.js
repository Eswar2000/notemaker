import {useState} from 'react';
import {Card, Container, List, TextField, InputAdornment, IconButton, CardContent, CardActions} from '@mui/material';
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
                id: String(index + 1),
                task: item
            })
        })
    }

    const [orderedListItem, setOrderedListItem] = useState("");
    const [orderedList, setOrderedList] = useState(transformOrderedList(note.orderedList));
    // const [orderedListTitle, setOrderedListTitle] = useState(note.title);
    // const [titleEdit, setTitleEdit] = useState(false);

    const getTaskPosition = (id) => {
        return orderedList.findIndex((task) => task.id === id);
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
        console.log(event);
        const {active, over} = event;
        if(active.id === over.id){
            return;
        } else {
            const originalPosition = getTaskPosition(active.id);
            const newPosition = getTaskPosition(over.id);
            setOrderedList(arrayMove(orderedList, originalPosition, newPosition));
        }
    }

    return (
        <Card className='ordered-list-card'>
            <CardContent className='ordered-list-card-content'>
                <NoteHeader note={note} shareableUsers={shareableUsers} onModify={onModify} alertHandler={alertHandler} alertMessageHandler={alertMessageHandler} />
                <TextField
                    label="Add Item"
                    size='small'
                    value={orderedListItem}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position='start'>
                            <IconButton>
                                <AddCircleIcon color='info'/>
                            </IconButton>
                        </InputAdornment>
                    )
                    }}
                    onChange={event => {setOrderedListItem(event.target.value)}}
                    fullWidth
                />
                <Container disableGutters className='ordered-list-card-body'>
                    <DndContext collisionDetection={closestCorners} onDragEnd={(event) => {handleDragEnd(event)}}>
                        <List>
                            <SortableContext items={orderedList} strategy={verticalListSortingStrategy}>
                                {
                                    orderedList.map((item) => (
                                        <Task key={item.id} id={item.id} task={item.task} />
                                    ))
                                }
                            </SortableContext>
                        </List>
                    </DndContext>
                </Container>
            </CardContent>
            <CardActions className='action-menu'>
                <IconButton>
                    <EditIcon color='success'/>
                </IconButton>
                <IconButton onClick={() => {deleteOrderedListHandler()}} disabled={!OwnershipService.getNoteOwnership(note.owner)}>
                    <DeleteIcon color={OwnershipService.getNoteOwnership(note.owner) ? 'error' : 'disabled'}/>
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default OrderedList;