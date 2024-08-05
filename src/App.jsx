import { useState, useEffect, useRef } from 'react';
import newLogo from './assets/To-Do_app_Logo.png'; // Import the new logo
import lexmeetLogo from './assets/Lexmeet-logo.png'; // Import the Lexmeet logo
import './App.css';
import clickSound from './assets/mouse-click-153941.mp3'; // Import click sound

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }); // State to store tasks
  const [newTask, setNewTask] = useState(''); // State for new task input
  const [editingIndex, setEditingIndex] = useState(null); // State for editing task
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [taskToDelete, setTaskToDelete] = useState(null); // State to store the task to be deleted
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // State for delete all confirmation
  const inputRef = useRef(null); // Create a reference for the input element

  // Preload and create audio object
  const [audio] = useState(() => {
    const audio = new Audio(clickSound);
    audio.preload = 'auto';
    audio.volume = 0.5; // Optional: Adjust volume if needed
    return audio;
  });

  useEffect(() => {
    // Ensure audio is ready by playing it briefly on mount
    audio.play().catch(() => {}); // Handle any errors silently
    audio.pause(); // Stop playback immediately after starting
    audio.currentTime = 0; // Reset playback position
  }, [audio]);

  useEffect(() => {
    // Focus the input field when editingIndex changes
    if (editingIndex !== null) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const playClickSound = () => {
    audio.play().catch(() => {}); // Handle any errors silently
  };

  const handleAddTask = () => {
    if (newTask.trim() === '') return; // Prevent adding empty tasks
    playClickSound();
    const newTaskObj = { text: newTask, done: false, date: new Date().toLocaleDateString() };
    if (editingIndex !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editingIndex ? newTaskObj : task
      );
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, newTaskObj]);
    }
    setNewTask('');
  };

  const handleEditTask = (index) => {
    playClickSound();
    setNewTask(tasks[index].text);
    setEditingIndex(index);
  };

  const handleRemoveTask = (index) => {
    playClickSound();
    setTaskToDelete(index);
    setShowModal(true);
  };

  const confirmRemoveTask = () => {
    playClickSound();
    const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
    setTasks(updatedTasks);
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleToggleDone = (index) => {
    playClickSound(); // Ensure this is called to play the click sound
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteAll = () => {
    playClickSound();
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAll = () => {
    playClickSound();
    setTasks([]);
    setShowDeleteAllModal(false);
  };

  const handleMarkAllDone = () => {
    playClickSound();
    const updatedTasks = tasks.map((task) => ({ ...task, done: true }));
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <img src={lexmeetLogo} alt="Lexmeet Logo" className="logo-lexmeet" />
      <header>
        <img src={newLogo} alt="To-Do App Logo" className="logo" />
        <h1>To-Do App</h1>
      </header>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>
      <main>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            ref={inputRef} // Attach the reference to the input element
          />
          <button className="comic-button" onClick={handleAddTask}>
            {editingIndex !== null ? 'Update Task' : 'Add Task'}
          </button>
        </div>
        <div>
          <button className="comic-button" onClick={handleMarkAllDone}>
            Done All
          </button>
          <button className="comic-button" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
        <ul className="task-list">
          {filteredTasks.map((task, index) => (
            <li key={index} className={`task-item ${task.done ? 'done' : ''}`}>
              <div className="task-content">
                <span>{task.text}</span>
                <small className="date-created">Date created: {task.date}</small>
              </div>
              <div className="task-buttons">
                <button onClick={() => handleEditTask(index)}>Edit</button>
                <button onClick={() => handleToggleDone(index)}>
                  {task.done ? 'Undone' : 'Done'}
                </button>
                <button onClick={() => handleRemoveTask(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this task?</p>
              <button className="comic-button" onClick={confirmRemoveTask}>
                Confirm
              </button>
              <button className="comic-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {showDeleteAllModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteAllModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirm Delete All</h2>
              <p>Are you sure you want to delete all tasks?</p>
              <button className="comic-button" onClick={confirmDeleteAll}>
                Confirm
              </button>
              <button className="comic-button" onClick={() => setShowDeleteAllModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
