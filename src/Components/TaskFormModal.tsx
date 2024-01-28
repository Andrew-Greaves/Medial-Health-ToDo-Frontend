import React,{useState,ChangeEvent} from 'react'
import { Modal,Box,TextField, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface TaskFormModalProps {
    open: boolean;
    handleClose: () => void;
    refreshTasks: () => void;
}

//Modal for Task Add Form
const TaskFormModal:React.FC<TaskFormModalProps> = ({open,handleClose,refreshTasks}) => {

    const modalStyle = {
    position: 'absolute',   // Sets the position of the modal to absolute, allowing it to be positioned relative to its nearest positioned ancestor
    top: '50%',             // Positions the top edge of the modal at the center of the screen (or parent element)
    left: '50%',            // Positions the left edge of the modal at the center of the screen (or parent element)
    transform: 'translate(-50%, -50%)', // Translates the modal back by 50% of its own width and height to align it exactly in the center
    width: 700,             
    bgcolor: 'background.paper', // Sets the background color of the modal, using the theme's background.paper color
    boxShadow: 24,          // Applies a depth effect with a shadow, 24 is an intensity value from the theme's shadows
    p: 4,                   // Sets padding inside the modal, '4' refers to a value from the theme's spacing scale
};

    //State Variables
    const [date,setDate]=useState<String>("");
    const [title,setTitle]=useState<String>("");
    const [description,setDescription]=useState<String>("");
    const [assignee,setAssignee]=useState<String>("");
    const [priority,setPriority]=useState<String>("low");
    const [status,setStatus]=useState<String>("pending");
    const [note,setNote]=useState<String>("");
    const [titleError, setTitleError] = useState<boolean>(false);
    const [dateError, setDateError] = useState<boolean>(false);
    const [assigneeError, setAssigneeError] = useState<boolean>(false);

    const handleAdd = async () => {
        //Manual form validation
        let isValid = true;

        if (title.trim() === "") {
            setTitleError(true);
            isValid = false;
        } else {
            setTitleError(false);
        }

        if(date.trim()===""){
            setDateError(true);
            isValid=false;
        }else{
            setDateError(false);
        }

        if(assignee.trim()===""){
            setAssigneeError(true);
            isValid=false;
        } else{
            setAssigneeError(false);
        }

        if (!isValid) {
            return; // Stop the function if there are errors
        }
        const newTask = { //create task object
            id:uuidv4(),
            title:title,
            description:description,
            dueDate:date,
            assignee: {
                displayName:assignee
            },
            priorityLevel:priority,
            notes:note,
            status:status
        }
        try{
            const response= await axios.post("http://localhost:5000/addtask",newTask) //make a post request to backend server with task object
            console.log(response);
            refreshTasks(); 
            //reset state variables
            setTitle("");
            setDescription("");
            setDate("");
            setAssignee("");
            setNote("");
            setPriority("low");
            setStatus("pending");
            handleClose();
        } catch(error){
            console.log(error);
        }
    }

    
  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box component="form" sx={modalStyle}>
            <div style={{flexDirection:"row", display:"flex",justifyContent:"space-between"}}>
                <h3>New Task</h3>
                <IconButton onClick={() => { //Close modal and reset all variables
                    handleClose();
                    setAssigneeError(false);
                    setTitleError(false);
                    setDateError(false);
                    setTitle("");
                    setDescription("");
                    setDate("");
                    setAssignee("");
                    setNote("");
                    setPriority("low");
                    setStatus("pending");
                }}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <form id='TaskForm'> {/* Form Fields */}
                <div className='TaskFormModal'>
                    <TextField
                        sx={{paddingRight:"40px"}}
                        required
                        value={title}
                        error={titleError}
                        helperText={titleError ? "Title is required" : ""}
                        id="title"
                        label="Title"
                        variant='outlined'
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setTitle(event.target.value)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder='Title'
                    />
                    <TextField
                        value={date}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setDate(event.target.value);
                        }}
                        required
                        error={dateError}
                        helperText={dateError ? "Date is required" : ""}
                        id="date"
                        label="Date Due"
                        type='date'
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    
                </div>
                <div className='TaskFormModal'>
                <TextField
                        sx={{paddingRight:"58px"}}
                        id="description"
                        label="Description"
                        value={description}
                        multiline
                        rows={4}
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setDescription(event.target.value)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder='Description'
                    />

                    <TextField
                        id="note"
                        label="Notes"
                        value={note}
                        multiline
                        rows={4}
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setNote(event.target.value)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder='Note'
                    />
                </div>
                <div className='TaskFormModal'>
                    <TextField
                        sx={{paddingRight:"40px"}}
                        required
                        value={assignee}
                        error={assigneeError}
                        helperText={assigneeError ? "Assignee is required" : ""}
                        id="assignee"
                        label="Assignee"
                        variant='outlined'
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setAssignee(event.target.value)
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder='Assignee'
                    />

                    <TextField
                        sx={{paddingRight:"40px"}}
                        id="priority"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setPriority(event.target.value)
                        }}
                        required
                        select
                        label="Priority"
                        value={priority}
                        helperText="Please select the task priority"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        >
                        <MenuItem value={"low"}>Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        
                    </TextField>

                    <TextField
                        id="status"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => {
                            setStatus(event.target.value)
                        }}
                        required
                        value={status}
                        select
                        label="Status"
                        helperText="Please select the task status"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        defaultValue={"Pending"}
                        >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="canceled">Canceled</MenuItem>
                    </TextField>
                </div>
                
            </form>
            <div style={{display:"flex",justifyContent:"center"}}>
                <Button style={{ marginRight:"20px", width:"200px"}} variant='contained' size='large' onClick={handleAdd}>Add Task</Button>
            </div>
        </Box>
    </Modal>
  )
}

export default TaskFormModal