import { useState, useEffect, FormEvent, Component, ChangeEvent } from "react";
import pulumipus from "./pulumipus.svg";
import "./App.css";

// Item defines the shape of a grocery-list item, which has a name, unique ID, and
// a flag to indicate whether the item has been obtained.
interface Item {
    _id: string;
    name: string;
    done: boolean;
}

class App extends Component {

    // The local component state: a list of items and a form field for new items.
    state = {
        items: [],
        newItem: "",
    };

    // When the component loads, we call the API that retrieves all items from
    // the database.
    componentDidMount() {
        this.fetchItems();
    }

    // Retrieve all grocery-list items and write them to local component state.
    private async fetchItems() {
        const response = await fetch("/api/items");
        const items = await response.json();
        this.setState({ items });
    }

    // Add an item to the grocery list, then fetch an updated list.
    private async addItem(name: string) {

        // Ignore empty items.
        if (!name.trim()) {
            return;
        }

        // Make an HTTP POST to the items endpoint.
        await fetch("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        this.setState({ newItem: "" });
        this.fetchItems();
    }

    // Delete an item from the grocery list.
    private async deleteItem(item: Item) {
        await fetch(`/api/items/${item._id}`, {
            method: "DELETE",
        });

        this.fetchItems();
    }

    // Cross an item off the list (or uncross it).
    private async toggleItem(item: Item) {
         await fetch(`/api/items/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: item.name, done: !item.done }),
        });
        this.fetchItems();
    }

    // Keep track of the item being added.
    private onSubmit(event: FormEvent) {
        event.preventDefault();
        this.addItem(this.state.newItem);
    }

    // Handle form submissions.
    private onChange(event: ChangeEvent) {
        this.setState({ newItem: (event.target as HTMLInputElement).value })
    }

    // Convenience method to make things a bit less repetitive.
    private get items() {
        return this.state.items;
    }

    // Render the list and the new-item form.
    render() {
        return <div className="App">
            <header>
                <img src={pulumipus} className="App-logo" alt="logo" />
                <h1>Pulumipus's Grocery List</h1>
            </header>
            { this.items.length > 0 && <p>{this.items.length} item{this.items.length !== 1 && "s"}:</p> }
            <ul>
                { this.items.map((item, i) => <li key={i} className={item["done"] ? "done" : ""}>
                    <span>{(item as any).name}</span>
                    <button onClick={this.toggleItem.bind(this, item)}>✔︎</button>
                    <button onClick={this.deleteItem.bind(this, item)}>&times;</button>
                </li>)}
            </ul>
            <form onSubmit={this.onSubmit.bind(this)}>
                <input type="text" value={this.state.newItem} onChange={this.onChange.bind(this)} placeholder="Add an item" size={100} maxLength={100} />
                <button type="submit">+</button>
            </form>
        </div>;
    }
}

export default App;
