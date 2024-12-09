import {Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, FormControl, OutlinedInput, InputLabel, Select, MenuItem, Chip, Stack}  from '@mui/material';
import {Cancel, Check} from "@mui/icons-material";


function SharedUserList({shared, shareableUserPool, shareNoteBool, shareNoteBoolHandler, sharedUserHandler, sharedNoteUpdateHandler}){

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200,
                width: 250,
            },
        },
    };

    return (
        <Dialog open={shareNoteBool} onClose={() => {shareNoteBoolHandler(false);}}>
            <DialogTitle>Share Note</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To share notes with other users, add them to the list. The can only view these notes.
                </DialogContentText>
                <FormControl sx={{ m: 1, width: 500 }}>
                    <InputLabel>Users</InputLabel>
                    <Select
                        multiple
                        value={shared}
                        onChange={(e) => {
                            sharedUserHandler(e.target.value);
                        }}
                        input={<OutlinedInput label="Users" />}
                        renderValue={(selected) => (
                            <Stack gap={1} direction="row" flexWrap="wrap">
                                {
                                    selected.map((selectedUser) => (
                                        <Chip
                                            key = {shareableUserPool[selectedUser]['id']}
                                            label = {shareableUserPool[selectedUser]['name']}
                                            onDelete={() => {
                                                sharedUserHandler(
                                                    shared.filter((item) => item !== selectedUser)
                                                )
                                            }}
                                            deleteIcon={
                                                <Cancel onMouseDown={(event) => event.stopPropagation()}/>
                                            }
                                        />
                                    ))
                                }
                            </Stack>
                        )}
                        MenuProps={MenuProps}>
                            {
                                    Object.keys(shareableUserPool).map((user) => (
                                        <MenuItem
                                            key={shareableUserPool[user]['id']}
                                            value={user}
                                            id={shareableUserPool[user]['id']}
                                            sx={{justifyContent: "space-between"}}
                                        >
                                            {shareableUserPool[user]['name']}
                                            {shared.includes(user) ? <Check color='info'/> : null}
                                        </MenuItem>
                                    ))
                            }  
                    </Select>     
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    shareNoteBoolHandler(false);
                    sharedNoteUpdateHandler();
                }}>Save and Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SharedUserList;