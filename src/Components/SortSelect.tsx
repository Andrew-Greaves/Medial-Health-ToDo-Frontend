import React,{useState} from 'react'
import { FormControl, InputLabel, Select, MenuItem,SelectChangeEvent,Button } from '@mui/material';


interface SortSelectProps {
    onSort: (sortCriteria: string, value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({onSort}) => {
    const [sortValue,setSortValue] = useState<String>("");
    const [priorityValue,setPriorityValue] = useState<String>("");
    const [statusValue,setStatusValue] = useState<String>("");
    const [openPrioritySelect,setOpenPrioritySelect] = useState<Boolean>(false);
    const [openStatusSelect,setOpenStatusSelect] = useState<Boolean>(false);

    
    const handleSortChange = (event: SelectChangeEvent<String>) => {
        setSortValue(event.target.value);
        if (event.target.value === 'priority') { //Opens priority select if chosen and closes status select if open
            setOpenPrioritySelect(true); 
            setOpenStatusSelect(false);
            setStatusValue("");
        }
        if(event.target.value === 'status'){ //Opens status select if chosen and closes priority select
            setOpenStatusSelect(true);
            setOpenPrioritySelect(false);
            setPriorityValue("");
        }
        if(event.target.value === 'date'){ //Closes any open selects if date is chosen
            setOpenStatusSelect(false);
            setOpenPrioritySelect(false);
            onSort("date", "");
            setPriorityValue("");
            setStatusValue("");
        }
    };

    const handlePriorityChange = (event: SelectChangeEvent<String>) => {
        setPriorityValue(event.target.value);
        onSort("priority", event.target.value as string);
        
    };

    const handleStatusChange = (event: SelectChangeEvent<String>) => {
        setStatusValue(event.target.value);
        onSort("status", event.target.value as string);
        
    };

  return (
    <div>
        {/* Default sort select */}
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={sortValue} // state variable to hold the selected value
                onChange={handleSortChange} // function to handle change in selection
                label="Sort By"
            >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
            </Select>
        </FormControl>

        {/* Conditionally render priority select if priority is chosen */}
        {openPrioritySelect && (
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
            labelId="priority-label"
            id="priority-select"
            value={priorityValue}
            onChange={handlePriorityChange}
            label="Priority"
            >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            </Select>
        </FormControl>
        )}

        {/* Conditionally render status select if status is chosen */}
        {openStatusSelect && (
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
            labelId="status-label"
            id="status-select"
            value={statusValue}
            onChange={handleStatusChange}
            label="Status"
            >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
            </Select>
        </FormControl>
        )}
        {/*Reset selects and their values when button is pushed */}
        {sortValue!=="" &&
        <Button style={{ marginTop:"10px" ,marginLeft:"20px", width:"100px"}} variant='contained' size='large' 
            onClick={()=>{
            setSortValue("");
            setOpenStatusSelect(false);
            setOpenPrioritySelect(false);
            onSort("","");
            setPriorityValue("");
            setStatusValue("");
            }
            }>
            Reset
        </Button>
        }
        
    </div>
    
)
}

export default SortSelect