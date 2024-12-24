import {ListItem, ListItemText, IconButton} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function Task({id, task}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    
    return (
        <ListItem
            className='ordered-list-item' 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            secondaryAction={
            <IconButton edge="end" aria-label="delete">
                <HighlightOffIcon color='error' />
            </IconButton>
            }>
            <ListItemText id={id} primary={task}/>
        </ListItem>
    );
}

export default Task;