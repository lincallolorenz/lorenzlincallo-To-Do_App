import { useState, useEffect, useRef } from 'react';
import newLogo from './assets/To-Do_app_Logo.png'; // Import the new logo
import lexmeetLogo from './assets/LexMeet_logo.png'; // Import the Lexmeet logo
import './App.css'; // Import the CSS file
import clickSound from './assets/mouse-click-153941.mp3'; // Import click sound

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showTaskDeleteConfirmation, setShowTaskDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({
    name: '',
    dueDate: '',
    dueTime: '',
  });

  const [allDone, setAllDone] = useState(false);

  const audioRef = useRef(null);
  const inputRef = useRef(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim() || !taskDate.trim() || !taskTime.trim()) {
      // Optionally, display an error message
      console.error('Please fill in all fields');
      return;
    }
    
    playClickSound();
    const dateCreated = new Date().toISOString();
    const newTasks = [...tasks, {
      text: newTask,
      done: false,
      dateCreated,
      dueDate: taskDate,
      dueTime: taskTime
    }];
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setNewTask('');
    setTaskDate('');
    setTaskTime('');
  };
  
  

  const handleEditTask = (index) => {
    playClickSound();
    const task = tasks[index];
    setEditingIndex(index);
    setNewTaskDetails({
      name: task.text,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
    });
    setShowNewTaskModal(true);
  };

  const handleUpdateTask = () => {
    playClickSound();
    if (editingIndex === null || newTaskDetails.name.trim() === '' || newTaskDetails.dueDate.trim() === '' || newTaskDetails.dueTime.trim() === '') return;
  
    const updatedTasks = tasks.map((task, index) =>
      index === editingIndex
        ? { ...task, text: newTaskDetails.name, dueDate: newTaskDetails.dueDate, dueTime: newTaskDetails.dueTime }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setEditingIndex(null);
    setNewTaskDetails({ name: '', dueDate: '', dueTime: '' });
    handleCloseNewTaskModal();
  };
  

  const handleToggleTask = (index) => {
    playClickSound();
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (index) => {
    playClickSound();
    setTaskToDelete(index);
    setShowTaskDeleteConfirmation(true);
  };

  const confirmDeleteTask = () => {
    playClickSound();
    const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowTaskDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    playClickSound();
    setShowTaskDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const handleDeleteAllTasks = () => {
    playClickSound();
    setShowConfirmationModal(true);
  };

  const confirmDeleteAll = () => {
    playClickSound();
    setTasks([]);
    localStorage.removeItem('tasks');
    setShowConfirmationModal(false);
  };

  const handleShowModal = (task) => {
    playClickSound();
    setModalTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    playClickSound();
    setShowModal(false);
    setModalTask(null);
  };

  const handleDoneAll = () => {
    playClickSound();
    const updatedTasks = tasks.map(task => ({ ...task, done: true }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setAllDone(true);
  };

  const handleUndoneAll = () => {
    playClickSound();
    const updatedTasks = tasks.map(task => ({ ...task, done: false }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setAllDone(false);
  };

  const handleOpenNewTaskModal = () => {
    setShowNewTaskModal(true);
  };

  const handleCloseNewTaskModal = () => {
    setShowNewTaskModal(false);
    setNewTaskDetails({ name: '', dueDate: '', dueTime: '' });
    setEditingIndex(null); // Reset the editing index when closing the modal
  };

  const handleNewTaskInputChange = (e) => {
    setNewTaskDetails({ ...newTaskDetails, [e.target.name]: e.target.value });
  };

  const handleAddTaskFromModal = () => {
    const { name, dueDate, dueTime } = newTaskDetails;
    if (!name.trim() || !dueDate.trim() || !dueTime.trim()) {
      // Optionally, display an error message
      console.error('Please fill in all fields');
      return;
    }
  
    playClickSound();
    const dateCreated = new Date().toISOString();
    const newTasks = [...tasks, {
      text: name,
      done: false,
      dateCreated,
      dueDate,
      dueTime
    }];
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    handleCloseNewTaskModal();
  };
  
  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAMPM = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <>
      <audio ref={audioRef} src={clickSound} preload="auto" />
      <div className="gradient-box"></div>
      <div className="container">
        <a href="https://lexmeet.com" target="_blank" rel="noopener noreferrer">
          <img src={lexmeetLogo} alt="Lexmeet Logo" className="logo-lexmeet" />
        </a>
        <header>
          <img src={newLogo} alt="To-Do App Logo" className="logo" />
          <h1>To-Do App</h1>
        </header>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>
        <div className="task-input">
          {editingIndex === null && (
            <button className="comic-button" onClick={handleOpenNewTaskModal}>Add Task +</button>
          )}
          {allDone ? (
            <button className="comic-button" onClick={handleUndoneAll}>Undone All</button>
          ) : (
            <button className="comic-button" onClick={handleDoneAll}>Done All</button>
          )}
          <button className="comic-button" onClick={handleDeleteAllTasks}>Delete All</button>
        </div>
        <ul className="task-list">
          {tasks.filter(task => task.text.toLowerCase().includes(searchQuery)).map((task, index) => (
            <li key={index} className={`task-item ${task.done ? 'done' : ''}`}>
              <div className="task-content">
                <span>{task.text}</span>
                <div className="date-created">{formatDate(task.dateCreated)}</div>
              </div>
              <div className="task-buttons">
                <button onClick={() => handleToggleTask(index)}>
                  {task.done ? 'Undone' : 'Done'}
                </button>
                <button onClick={() => handleEditTask(index)}>Edit</button>
                <button onClick={() => handleDeleteTask(index)}>Delete</button>
                <button onClick={() => handleShowModal(task)}>Details</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="modal-overlay" onClick={handleCloseNewTaskModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingIndex === null ? 'Add New Task' : 'Update Task'}</h2>
            <input
              type="text"
              name="name"
              value={newTaskDetails.name}
              onChange={handleNewTaskInputChange}
              placeholder="Task name"
              ref={inputRef}
            />
            <input
              type="date"
              name="dueDate"
              value={newTaskDetails.dueDate}
              onChange={handleNewTaskInputChange}
              placeholder="Due Date"
            />
            <input
              type="time"
              name="dueTime"
              value={newTaskDetails.dueTime}
              onChange={handleNewTaskInputChange}
              placeholder="Due Time"
            />
            <div className="modal-buttons">
              <button onClick={editingIndex === null ? handleAddTaskFromModal : handleUpdateTask}>
                {editingIndex === null ? 'Add Task' : 'Update Task'}
              </button>
              <button onClick={handleCloseNewTaskModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showModal && modalTask && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Task Details</h2>
            <p><strong>Task:</strong> {modalTask.text}</p>
            {modalTask.dueDate && <p><strong>Due Date:</strong> {formatDate(modalTask.dueDate)}</p>}
            {modalTask.dueTime && <p><strong>Due Time:</strong> {formatAMPM(modalTask.dueTime)}</p>}
            <p><strong>Date Created:</strong> {formatDate(modalTask.dateCreated)}</p>
            <div className="modal-buttons">
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {showConfirmationModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete All Tasks</h2>
            <p>Are you sure you want to delete all tasks?</p>
            <div className="modal-buttons">
              <button onClick={confirmDeleteAll}>Yes</button>
              <button onClick={() => setShowConfirmationModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {showTaskDeleteConfirmation && (
        <div className="modal-overlay" onClick={cancelDeleteTask}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button onClick={confirmDeleteTask}>Yes</button>
              <button onClick={cancelDeleteTask}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
