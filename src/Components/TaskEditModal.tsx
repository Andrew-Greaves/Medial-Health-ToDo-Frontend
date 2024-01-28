import React,{useState,ChangeEvent} from 'react'
import { Modal,Box,TextField, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Task } from './TaskCard';

interface TaskEditModalProps {
    open: boolean;
    handleClose: () => void;
    task:Task;
    refreshTasks: () => void;

}

//Modal for Task Edit Form
const TaskEditModal:React.FC<TaskEditModalProps> = ({open,handleClose,task,refreshTasks}) => {

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    //State Variables with prefilled task data
    const [date,setDate]=useState<String>(task.dueDate);
    const [newTitle,setTitle]=useState<String>(task.title);
    const [newDescription,setDescription]=useState<String>(task.description);
    const [newAssignee,setAssignee]=useState<String>(task.assignee.displayName);
    const [priority,setPriority]=useState<String>(task.priorityLevel);
    const [newStatus,setStatus]=useState<String>(task.status);
    const [note,setNote]=useState<String>(task.notes);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [dateError, setDateError] = useState<boolean>(false);
    const [assigneeError, setAssigneeError] = useState<boolean>(false);

    const handleEdit = async (task:Task) => {
        //Manual form validation
        let isValid = true;

        if (newTitle.trim() === "") {
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

        if(newAssignee.trim()===""){
            setAssigneeError(true);
            isValid=false;
        } else{
            setAssigneeError(false);
        }

        if (!isValid) {
            return; // Stop the function if there are errors
        }
        const editedTask = { //create task object
            title:newTitle,
            description:newDescription,
            dueDate:date,
            assignee: {
                displayName:newAssignee
            },
            priorityLevel:priority,
            notes:note,
            status:newStatus
        }
        try{
            await axios.put(`http://localhost:5000/edittask/${task.id}`,editedTask) //makes a put request to backend server with task object to update
            refreshTasks();
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
                <h3>Edit Task</h3>
                <IconButton onClick={() => {
                    handleClose();
                    setAssigneeError(false);
                    setTitleError(false);
                    setDateError(false);
                }}>
                    <CloseIcon/>
                </IconButton>
            </div>
            
            <form id='TaskForm'>
                <div className='TaskFormModal'>
                    <TextField
                        sx={{paddingRight:"40px"}}
                        required
                        value={newTitle}
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
                        value={newDescription}
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
                        value={newAssignee}
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
                        value={newStatus}
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
                <Button style={{ marginRight:"20px", width:"200px"}} variant='contained' size='large' onClick={()=>handleEdit(task)}>Edit Task</Button>
            </div>
        </Box>
    </Modal>
  )
}

export default TaskEditModal