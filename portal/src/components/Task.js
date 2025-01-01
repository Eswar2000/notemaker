import {ListItem, ListItemText, IconButton} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {HighlightOff} from '@mui/icons-material';

function Task({id, task, pos, deleteTask}) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    
    return (
        <ListItem
            id='list-row' 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            >
            <ListItemText id={id} primary={task}/>
            <IconButton aria-label="delete" onClick={async () => {deleteTask("erase", pos);}} onPointerDown={(event) => {event.stopPropagation();}}>
                <HighlightOff color='error' />
            </IconButton>
        </ListItem>
    );
}

export default Task;