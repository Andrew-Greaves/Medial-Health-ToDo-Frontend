import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


//Interfaces with data types for objects
export interface Task {
    id:String,
    title: String,
    description: String,
    dueDate:String,
    assignee: {
        userId: string;
        displayName: string;
    };
    notes:String,
    priorityLevel:String,
    status: String
}

interface TaskCardProp {
    task: Task,
    handleDelete: (id:String) => void;
    handleEdit: (task:Task) => void;
}

//MUI Card to display task information
const TaskCard: React.FC<TaskCardProp> = ({task,handleDelete,handleEdit}) => {
  return (
    <Card variant='outlined' sx={{ 
        maxWidth: 650, 
        height: 300, 
        marginLeft: "30px", 
        marginBottom: "30px", 
        boxShadow: 3, //Adding a shadow to give the card a "raised" effect
        '&:hover': { boxShadow: 6 }, //Hover effect to make cards more visually appealing
        backgroundColor: "#f5f5f5",
        border: task.status==="completed" ? "3px solid " : task.status==="canceled" ? "3px solid " : '1px solid #4a4a4a',
        display: "flex", 
        flexDirection: "column",
        borderColor:task.status==="completed" ? "#90EE90" : task.status==="canceled" ? "red" :" black" 
    }}>
        <CardHeader  //Avatar with first letter of users name
            avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="task"> 
            {task.assignee.displayName[0]} 
            </Avatar>
            }
            titleTypographyProps={{fontSize:18,fontWeight:700,alignSelf:"center"}}
            title={task.title}
            subheader={`Due Date: ${task.dueDate} - Assigned to ${task.assignee.displayName}`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body1" sx={task.priorityLevel==="high" ? {color:"red"}: task.priorityLevel==="medium" ? {color:"#F6BE00"} : {color:"black"}}> {/* if priority is high, color text red */}
                {`Priority: ${task.priorityLevel}`}
            </Typography>
            <Typography variant="body1" >
                {`Status: ${task.status}`}
            </Typography>
            {task.description && ( //Conditionally show description and notes if they contain data
                <Typography variant="body2" color="text.secondary">
                    {`Description: ${task.description}`}
                </Typography>
            )}

            {task.notes && (
                <Typography variant="body2" color="text.secondary">
                    {`Notes: ${task.notes}`}
                </Typography>
            )}
        </CardContent>
        <CardActions disableSpacing sx={{justifyContent:"flex-end"}}> 
            <IconButton aria-label="edit task" onClick={() => handleEdit(task)}> {/* Executes openeditmodal function in app, which in turn opens the modal,sets the current task and allows handleEdit to execute */}
                <EditIcon />
            </IconButton>
            <IconButton aria-label="delete task" onClick={() => handleDelete(task.id)}>
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
  )
}

export default TaskCard