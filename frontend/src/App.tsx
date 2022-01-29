import { useState, useEffect } from 'react'
// import logo from './logo.svg'
import './App.css'

async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();
    return tasks;
}

async function addTask(name: string) {
    const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" }
    });
}

function App() {
    let [ tasks, setTasks ] = useState([]);
    let [ task, setTask ] = useState("");

    useEffect(() => {
        fetchTasks().then(tasks => setTasks(tasks));
    });

    return (
        <div className="App">
            <header className="App-header">
                Hey! You have {tasks.length} things to do.
            </header>
            <ul>
                { tasks.map((task, i) => <li key={i}>{task.name}</li>)}
            </ul>
            <div>
                <input type="text" onChange={e => setTask(e.target.value)} />
                <button type="button" onClick={() => addTask(task)}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default App
