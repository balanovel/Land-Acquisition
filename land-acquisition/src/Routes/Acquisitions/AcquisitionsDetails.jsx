import { useState } from "react";
import styled from "styled-components";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import axios from 'axios';
import CustomDropdown from "./CustomDropdown";

// images 
import redIcon from "../Acquisitions/assests/red.png";
import blueIcon from "../Acquisitions/assests/blue.png";
import greenIcon from "../Acquisitions/assests/green.png";
import yellowIcon from "../Acquisitions/assests/yellow.png";

const StyledDiv = styled.div`
  min-height: 14rem;
  max-height: 100vh;
  border-radius: 1rem;
  align-items: center;
  color: white;
  background: #06545c;
  transition: background-color 1.3s;
`;

const SourcingDetailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DetailsContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 20px;
`;

const DetailsDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  align-items: flex-start;
  padding-right: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-left: 20px;
`;

const SubTaskDiv = styled.div`
  position: relative;
  border-radius: 1rem;
  background-color: #06545c;
  height: 10rem;
  padding: 10px;
`;

const TaskOpacity = styled.div`
  display: flex;
  background: black;
  width: 69vw;
  height: 100vh;
  position: absolute;
  top: 0;
  opacity: 1;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const SubTaskForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CloseIcon = styled(AiTwotoneCloseSquare)`
  background: red;
  cursor: pointer;
`;

const AcquisitionsDetails = ({ task, setSubTaskStatus, setSubTaskListValue }) => {
  const [taskState, setTaskState] = useState(task);
  const [addSubTask, setAddSubTask] = useState(false);
  const [subTask, setSubTask] = useState(false);
  const [subTaskList, setSubTaskList] = useState(task.child_table || []);

  const handleTextChange = (event) => {
    const updatedTask = { ...taskState, task_description_1: event.target.value };
    setTaskState(updatedTask);
  };

  const handlePriorityChange = (event) => {
    const updatedTask = { ...taskState, priority: event.target.value };
    setTaskState(updatedTask);
  };

  const handleCheckboxChange = (child, checked) => {
    const updatedSubTaskList = subTaskList.map(c =>
      c.task_nme === child.task_nme ? { ...c, status: checked ? 1 : 0 } : c
    );
    setSubTaskList(updatedSubTaskList);
    setSubTaskListValue(updatedSubTaskList);

    const updatedTask = { ...taskState, child_table: updatedSubTaskList };
    setTaskState(updatedTask);
  };

  const handleAddSubTask = () => {
    setAddSubTask(true);
  }

  const handleSubTask = () => {
    setSubTask(!subTask)
  }
  const icons = {
    'Not yet started': redIcon,
    'In progress': yellowIcon,
    'Awaiting response': blueIcon,
    'Completed': greenIcon,
  };

  // Create options array with dynamic `task.sub_status`
  const options = [
    { value: 'Not yet started', label: 'Not yet started', icon: icons['Not yet started'] },
    { value: 'In progress', label: 'In progress', icon: icons['In progress'] },
    { value: 'Awaiting response', label: 'Awaiting response', icon: icons['Awaiting response'] },
    { value: 'Completed', label: 'Completed', icon: icons['Completed'] },
  ];

  // Find the option that matches `task.sub_status`
  const currentStatus = options.find(option => option.value === task.sub_status);

  const handleSelect = (value, color) => {
    setSubTaskStatus(value);
    console.log("Color = ", color, " Value = ", value);
  }

  const handleNewTask = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObj = Object.fromEntries(form.entries());

    // Include sub-task details
    const subTasks = subTaskList.map(task => ({
      task_name: task.task_nme,
      status: task.status
    }));

    formObj.parent_task = task.name;
    formObj.sub_tasks = subTasks; // Add sub-tasks to formObj

    axios.post("http://10.10.0.33/api/method/adding_subtask", { data: formObj }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setAddSubTask(false); // Close the form on success
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleCloseNewTask = () => {
    setAddSubTask(false);
  }

  return (
    <StyledDiv>
      <SourcingDetailsContainer>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <DetailsContainer>
            <DetailsDiv>
              <div style={{ width: '100%', paddingTop: '10px', paddingBottom: '10px', borderRadius: '1rem', background: '#016e79' }}>
                <h4 style={{ textAlign: 'left', paddingLeft: '30px' }}>Description</h4>
                <textarea
                  value={taskState.task_description_1 || ''}
                  name="description"
                  style={{ width: '90%', minHeight: '10rem', backgroundColor: 'white', color: 'black', borderRadius: '1rem', padding: '0.5rem' }}
                  onChange={handleTextChange}
                />
              </div>
              <div>
                <CheckboxContainer>
                  <h4>Sub Task List</h4>
                  {subTaskList && subTaskList.map((child) => (
                    <label key={child.task_nme}>
                      <input
                        type="checkbox"
                        checked={child.status === 1}
                        onChange={(e) => handleCheckboxChange(child, e.target.checked)}
                      />
                      {child.task_nme}
                    </label>
                  ))}
                  <button type="button" style={{ marginTop: '10px' }} onClick={handleAddSubTask}>Add</button>
                </CheckboxContainer>
              </div>
            </DetailsDiv>

            <DetailsDiv>
              <h4>Task ID: {task.name}</h4>

              {task.parent_task &&
                (<h4>Parent ID: {task.parent_task}</h4>)
                ||
                <button type="button" style={{ marginBottom: '20px' }} onClick={handleSubTask}>{subTask && 'Close Parent Task' || 'Add Parent Task'}</button>
              }

              {subTask && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                  <h4>Parent Task Name :</h4>
                  <input name='parent_task' style={{
                    background: 'white',
                    height: '2rem',
                    color: 'black',
                    borderRadius: '0.5rem'
                  }}></input>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <h4>Priority :</h4>
                <select
                  style={{ height: '2rem', width: '8rem', backgroundColor: 'white', color: 'black', borderRadius: '0.5rem' }}
                  onChange={handlePriorityChange}
                  value={taskState.priority || ''}
                  name="priority"
                >
                  <option value='Low'>Low</option>
                  <option value='Medium'>Medium</option>
                  <option value='High'>High</option>
                  <option value='Urgent'>Urgent</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1em' }}>
                <h4>Sub status :-</h4>
                <CustomDropdown
                  options={options}
                  onSelect={(value) => handleSelect(value, task.name)}
                  taskName={task.name}
                  initialValue={currentStatus} // Pass the current status as the initial value
                  onChange={handleSelect}
                />
              </div>
            </DetailsDiv>
          </DetailsContainer>

          <div>
            <button style={{ marginTop: '1rem', marginBottom: '1rem', backgroundColor: '#0395af' }} type="submit">
              Submit
            </button>
          </div>
        </div>

        {/* This is for Adding sub task */}
        {addSubTask && (
          <TaskOpacity>
            <SubTaskDiv>
              <CloseIcon size={24} onClick={handleCloseNewTask} />
              <SubTaskForm onSubmit={handleNewTask}>
                <div>
                  <h4>Sub Task Name</h4>
                  <input name="task_name" style={{ background: "white", color: 'black', height: '2rem' }} />
                </div>
                <div>
                  <h4>Status</h4>
                  <input name="status" type="checkbox" style={{ width: '30px', height: '30px' }} />
                </div>
                <button type="submit">Add</button>
              </SubTaskForm>
            </SubTaskDiv>
          </TaskOpacity>
        )}
      </SourcingDetailsContainer>
    </StyledDiv >
  );
}

export default AcquisitionsDetails;
