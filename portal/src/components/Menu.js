import { ListItem, ListItemText, IconButton } from '@mui/material/';
import { CheckBoxRounded, CheckBoxOutlineBlankRounded, HighlightOffRounded } from '@mui/icons-material';


function Menu({ element, checked, pos, toggle }) {

  const deleteStyle = { color: '#FB8500' };
  const toggleStyle = { color: '#60A857' };

  return (
    <ListItem id='list-row'
      key={pos}
      secondaryAction={checked &&
        <IconButton onClick={async () => { toggle("erase", pos); }}>
          <HighlightOffRounded sx={deleteStyle} />
        </IconButton>
      }
    >
      <IconButton onClick={async () => {
        if (checked) {
          toggle("uncheck", pos);
        } else {
          toggle("check", pos);
        }
      }}>
        {checked ? <CheckBoxRounded sx={toggleStyle} /> : <CheckBoxOutlineBlankRounded sx={toggleStyle} />}
      </IconButton>
      <ListItemText primary={element} id='note-card-message'/>
    </ListItem>
  );
}


export default Menu;