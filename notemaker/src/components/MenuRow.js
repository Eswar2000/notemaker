import {ListItem, ListItemText, IconButton} from '@mui/material/';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


function MenuRow({element, checked, pos, toggle}){

  return (
      <ListItem id='checklist-row'
          key={pos}
          secondaryAction={ checked && 
              <IconButton onClick={async () => {toggle("erase", pos);}}>
                <BackspaceIcon color='error'/>
              </IconButton>
            }
          >
          <IconButton onClick={async () => {
            if(checked) {
              toggle("uncheck", pos);
            } else {
              toggle("check", pos);
            }
          }}>
                  {checked ? <AddCircleIcon color='success'/> : <AddCircleOutlineIcon color='success'/>}
          </IconButton>
          <ListItemText primary={element} />
      </ListItem>
  );
}


export default MenuRow;