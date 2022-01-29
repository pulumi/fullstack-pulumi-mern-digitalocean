import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

async function getTasks() {
    const tasks = await fetch("/api/tasks");
    console.log({ tasks });
}

function App() {
    const [count, setCount] = useState(0);

    getTasks().then(tasks => console.log(tasks));

    return (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                <button type="button" onClick={() => setCount((count) => count + 1)}>
                    count is: {count}
                </button>
            </p>

        </header>
        </div>
    )
}

export default App
