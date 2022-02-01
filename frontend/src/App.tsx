import { useState, useEffect, FormEvent } from "react";
import pulumipus from "./pulumipus.svg";
import "./App.css";

async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();
    return tasks;
}

async function addTask(event: FormEvent, name: string) {
    event.preventDefault();

    const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" }
    });
}

async function toggleTask(task: any) {
    console.log(`Task is currently ${!!task.done}, sending ${!!!task.done}`);
    const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ name: task.name, done: !!!task.done }),
        headers: { "Content-Type": "application/json" }
    });
}

async function deleteTask(task: any) {
    const response = await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
}

function App() {
    let [ tasks, setTasks ] = useState([]);
    let [ task, setTask ] = useState("");

    useEffect(() => {
        console.log("I was called");
        fetchTasks().then(setTasks);
    }, []);

    return <div className="App">
        <header>
            <img src={pulumipus} className="App-logo" alt="logo" />
            <h1>Grocery List</h1>
        </header>
        <p>There are {tasks.length} things get:</p>
        <ul>
            { tasks.map((task, i) => <li key={i}>
                <span>{(task as any).name}</span>
                <button onClick={() => toggleTask(task)}>✓</button>
                <button onClick={() => deleteTask(task)}>&times;</button>
            </li>)}
        </ul>
        <form onSubmit={(event) => addTask(event, task) }>
            <input type="text" onChange={e => setTask(e.target.value)} placeholder="Add an item" />
            <button type="submit">+</button>
        </form>
    </div>;
}

export default App;
