import { useState, useEffect, FormEvent, Component, ChangeEvent } from "react";
import pulumipus from "./pulumipus.svg";
import "./App.css";

interface Item {
    _id: string;
    name: string;
    done: boolean;
}

class App extends Component {

    state = {
        items: [],
        newItem: "",
    };

    componentDidMount() {
        this.fetchItems();
    }

    private async fetchItems() {
        const response = await fetch("/api/items");
        const items = await response.json();
        this.setState({ items });
    }

    private async addItem(name: string) {
        await fetch("/api/items", {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: { "Content-Type": "application/json" }
        });

        this.setState({ newItem: "" });
        this.fetchItems();
    }

    private async deleteItem(item: Item) {
        await fetch(`/api/items/${item._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        this.fetchItems();
    }

    private async toggleItem(item: Item) {
         await fetch(`/api/items/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({ name: item.name, done: !item.done }),
            headers: { "Content-Type": "application/json" }
        });

        this.fetchItems();
    }

    private onSubmit(event: FormEvent) {
        event.preventDefault();
        this.addItem(this.state.newItem);
    }

    private onChange(event: ChangeEvent) {
        this.setState({ newItem: (event.target as HTMLInputElement).value })
    }

    private get items() {
        return this.state.items;
    }

    render() {
        return <div className="App">
            <header>
                <img src={pulumipus} className="App-logo" alt="logo" />
                <h1>Grocery List</h1>
            </header>
            { this.items.length > 0 && <p>{this.items.length} thing{this.items.length !== 1 && "s"} to get:</p> }
            <ul>
                { this.items.map((item, i) => <li key={i} className={item["done"] ? "done" : ""}>
                    <span>{(item as any).name}</span>
                    <button onClick={this.toggleItem.bind(this, item)}>✔︎</button>
                    <button onClick={this.deleteItem.bind(this, item)}>✖️</button>
                </li>)}
            </ul>
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="text" value={this.state.newItem} onChange={this.onChange.bind(this)} placeholder="Add something" />
                <button type="submit">➕</button>
            </form>
        </div>;
    }
}

export default App;
