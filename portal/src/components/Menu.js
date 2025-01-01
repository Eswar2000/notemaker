import {ListItem, ListItemText, IconButton} from '@mui/material/';
import {CheckBoxRounded, CheckBoxOutlineBlankRounded, HighlightOffRounded} from '@mui/icons-material';


function Menu({element, checked, pos, toggle}){

  return (
      <ListItem id='list-row'
          key={pos}
          secondaryAction={ checked && 
              <IconButton onClick={async () => {toggle("erase", pos);}}>
                <HighlightOffRounded color='error'/>
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
                  {checked ? <CheckBoxRounded color='success'/> : <CheckBoxOutlineBlankRounded color='success'/>}
          </IconButton>
          <ListItemText primary={element} />
      </ListItem>
  );
}


export default Menu;