import React,{useState,useEffect} from 'react';
import logo from './Assets/medial_health_logo.jpeg'
import './App.css';
import Button from '@mui/material/Button';
import SearchBar from './Components/SearchBar';
import SortSelect from './Components/SortSelect';
import TaskFormModal from './Components/TaskFormModal';
import TaskCard from './Components/TaskCard';
import axios from 'axios';
import { Task } from './Components/TaskCard';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskEditModal from './Components/TaskEditModal';

function App() {

  //Managing state of filtered tasks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  

  // State for managing edit modal open/close
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Function to open edit modal with task details
  const handleOpenEditModal = (task: Task,refreshTasks:() => void) => {
    setCurrentTask(task);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentTask(null);
  };

    //Handles task form modal operations
    const [open,setOpen]= useState<boolean>(false);
    const [tasks,setTasks] = useState<Task[]>([]);

    //Opens and closes modal
    const handleOpen = () => {
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
    }

    //Handle deleting a task
    const handleDelete = async (id:String) => {
      try{
        const response=await axios.delete(`http://localhost:5000/deletetask/${id}`);
        setTasks(response.data);
        refreshTasks();
      }catch(error){
        console.log(error);
      }
    }

    // Function to fetch tasks from the server
    const fetchTasks = async () => {
      try {
        const taskResponse = await axios.get("http://localhost:5000/tasks");
        setTasks(taskResponse.data);
        setFilteredTasks(taskResponse.data); // Initially, all tasks are shown
      } catch (error) {
        console.log(error);
      }
    };

    // UseEffect for initial data fetch
    useEffect(() => {
      fetchTasks();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Call this function after adding, editing, or deleting a task
    const refreshTasks = () => {
      fetchTasks(); // Re-fetch tasks from the server
    };


    const handleSearch = (searchTerm: string) => {
        // Check if the search term is empty or only contains whitespace
      if (!searchTerm.trim()) {
          // If search term is empty, set filteredTasks to all tasks (i.e., no filtering)
          setFilteredTasks(tasks);
          return; // Return early to stop further execution
      }
      // Filter tasks based on whether the title includes the search term
      // Convert both to lowercase for case-insensitive comparison
      const filtered = tasks.filter(task =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase())  // Check if title contains the search term
      );

      // Update the filteredTasks state with the filtered tasks
      setFilteredTasks(filtered);
    };


   // Function to handle sorting of tasks based on the selected criteria
    const handleSortTasks = (sortCriteria: string, value: string) => {
      let sortedTasks;

      // Determine the sort criteria
      switch (sortCriteria) {
        case "priority":
          // Sort tasks by priority
          sortedTasks = [...tasks].sort((a, b) => {
              // If task 'a' has the selected priority, move it before 'b' (return -1)
              if (a.priorityLevel === value) return -1;
              // If task 'b' has the selected priority, move it before 'a' (return 1)
              if (b.priorityLevel === value) return 1;
              // If neither task has the selected priority, maintain their order (return 0)
              return 0;
          });
          break;

        case "status":
          // Sort tasks by status
          sortedTasks = [...tasks].sort((a, b) => {
              // If task 'a' has the selected status, move it before 'b' (return -1)
              if (a.status === value) return -1;
              // If task 'b' has the selected status, move it before 'a' (return 1)
              if (b.status === value) return 1;
              // If neither task has the selected status, maintain their order (return 0)
              return 0;
          });
          break;

        case "date":
          // Sort tasks by due date in ascending order
          sortedTasks = [...tasks].sort((a, b) => {
              // Compare the timestamp of the due dates of tasks 'a' and 'b'
              // Earlier dates will result in a negative number and thus be sorted earlier
              return new Date(a.dueDate.toString()).getTime() - new Date(b.dueDate.toString()).getTime();
          });
          break;

        default:
          // Default case: No sorting criteria selected
          // Keep the original task list without any sorting
          sortedTasks = tasks;
      }

      // Update the filteredTasks state with the sorted list of tasks
      setFilteredTasks(sortedTasks);
    };

  return (
    <div className="App">
      <header className="App-header">
        <p><img src={logo} style={{ width: '40px', height: 'auto', paddingLeft:'20px' }} alt='logo'/>Medial Health To Do </p>
        <Button style={{alignSelf:"center", marginRight:"20px", width:"200px"}} variant='contained' size='large' onClick={handleOpen}>Add Task</Button>
      </header>
      <div className='SearchandSort'>
        <SearchBar onSearch={handleSearch}/>
        <SortSelect onSort={handleSortTasks} />
      </div>
      <TaskFormModal open={open} handleClose={handleClose} refreshTasks={refreshTasks}/>
      {currentTask && (  // Conditional rendering: Only display TaskEditModal if currentTask is not null
        <TaskEditModal
          open={editModalOpen}
          handleClose={handleCloseEditModal}
          task={currentTask} // Pass the current task data to the modal for editing
      // The currentTask state holds the task details which are set when the edit button is clicked
          refreshTasks={refreshTasks}
        />
      )}
      <div className='taskList'>
        {filteredTasks.map(task=> ( //Uses () instead of {} to implicitly return the taskcard component
          <TaskCard key={String(task.id)} task={task} handleDelete={() => handleDelete(task.id)} handleEdit={() => handleOpenEditModal(task,refreshTasks)}/> //Pass task object and handle delete function as props to Task card
        //Also passes handleOpenEditModal function as a prop
        ))}
      </div>
      <Fab color="primary" aria-label="add" className='fab-button' sx={{position:"fixed"}} onClick={handleOpen}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default App;
