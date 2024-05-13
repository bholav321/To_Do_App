import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [taskList, setTaskList] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    return storedTasks || [];
  });
  const [taskStatus, setTaskStatus] = useState('active');
  const [priorityList] = useState([
    { priorityId: 1, priorityValue: 'High' },
    { priorityId: 2, priorityValue: 'Medium' },
    { priorityId: 3, priorityValue: 'Low' }
  ]);
  const titleValue = useRef(null);
  const priorityValue = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }, [taskList]);

  const addTask = () => {
    const title = titleValue.current.value.trim();
    const pid = parseInt(priorityValue.current.value); // Convert priority value to integer
    const status = 'active';
    const date = new Date().toLocaleDateString();

    if (!title) {
      alert('Please enter a task title.');
      return;
    }

    if (taskList.some(task => task.title === title)) {
      alert('Task title must be unique.');
      return;
    }

    const newTask = { title, pid, status, date };
    setTaskList(prevTaskList => [...prevTaskList, newTask]);
    titleValue.current.value = '';
  };

  const toggleTaskStatus = title => {
    setTaskList(prevTaskList =>
      prevTaskList.map(task =>
        task.title === title ? { ...task, status: task.status === 'active' ? 'deactive' : 'active' } : task
      )
    );
  };

  const handleStatusChange = newStatus => {
    setTaskStatus(newStatus);
  };

  const deleteTask = (index) => {
    if (window.confirm("Are you sure?")) {
      const updatedTaskList = taskList.filter((task, i) => i !== index);
      setTaskList(updatedTaskList);
    }
  };
  return (
    <section className='position-relative'>
      <div className='container-fluid bg-danger position-sticky top-0'>
        <h1 className='text-white text-center'>Task List</h1>
      </div>
      <div className='container form-group'>
        <div className='row'>
          <div className='col-md-6'>
            <input ref={titleValue} className=' m-2 form-control' placeholder='Enter the task title' />
          </div>
          <div className='col-md-3'>
            <select ref={priorityValue} className="m-2 form-control">
              {priorityList.map(({ priorityId, priorityValue }) => (
                <option key={priorityId} value={priorityId}>{priorityValue}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3'>
            <button onClick={addTask} className='btn btn-primary m-2'>Add Task</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <button onClick={() => handleStatusChange('active')} className='btn btn-success m-2'>Activate ({taskList.filter(task => task.status === 'active').length})</button>
            <button onClick={() => handleStatusChange('deactive')} className='btn btn-danger m-2'>Deactivate ({taskList.filter(task => task.status === 'deactive').length})</button>
          </div>
        </div>
      </div>
      <div className='container'>
        {taskList.length != 0 ? (
          <table className='table'>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Task</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {taskList
                .filter(task => task.status === taskStatus)
                .sort((a, b) => a.pid - b.pid)
                .map((task, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.date}</td>
                    <td>{priorityList.find(({ priorityId }) => task.pid === priorityId)?.priorityValue}</td>
                    <td>
                      <button
                        onClick={() => toggleTaskStatus(task.title)}
                        className={`btn ${task.status === 'active' ? 'bg-danger' : 'bg-success'} btn-outline-light`}
                      >
                        {task.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                    <td onClick={() => deleteTask(index)} className='btn btn-danger mt-1 p-auto'>delete</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <section>
            <div className='w-100 d-flex flex-column justify-content-center align-items-center' style={{height:'65vh'}}>
              <img
                style={{ maxWidth: "100%", height: "auto", maxHeight: "400px" }}
                src='https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90'
                alt='Responsive Image'
              />
            <p className='text-center'>Your Task List is Empty!</p>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default App;
