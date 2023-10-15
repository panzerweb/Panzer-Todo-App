//todo | Define an array to store to-do items
let todoItems = [];

//todo |  Function to render a to-do item
function renderTodo(todo) {
    //todo |  Get the list element and the item element by data key
    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key="${todo.id}"]`);

    //todo |  If the to-do item is marked as deleted, remove it
    if (todo.deleted) {
        item.remove();
        if (todoItems.length === 0) list.innerHTML = '';
        return;
    }

    //todo |  Format the date
    const { year, month, day, hour, minutes } = todo.date;
    const formattedDate = `${year}/${month}/${day}-${hour}:${minutes}`;

    //todo |  Determine if the item is checked
    const isChecked = todo.checked ? 'done' : '';
    
    //todo |  Create a new list item
    const node = document.createElement('li');
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
        <label for="${todo.id}" class="tick js-tick">
            <input id="${todo.id}" type="checkbox" class="checkbox js-checkbox">
        </label>
        <span>${todo.text}</span>
        <button class="delete-todo js-delete-todo">
            <svg><use href="#delete-icon">
            <span id="date-span">${formattedDate}</span>
            </use></svg>
        </button>
    `;

    //todo |  If the item already exists, replace it; otherwise, append it to the list
    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }
}

//todo |  Function to add a to-do item
function addTodo(text) {
    //*Create an object with text, checked: false, id: Date.now() properties
    const todoObj = {
        text,
        checked: false,
        id: Date.now(),
        date: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
        }
    };
    //* Push the object to empty array
    todoItems.push(todoObj);
    //*Update local storage
    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    //* Call the rendering function
    renderTodo(todoObj);
}

//todo |  Function to toggle the "done" status of a to-do item
function toggleDone(key) {
    // Find the index of the task with the specified ID
    const index = todoItems.findIndex((item) => item.id === Number(key));

    // Toggle the 'checked' property of the task
    todoItems[index].checked = !todoItems[index].checked;

    // Update the local storage with the modified todoItems array
    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    // Render the updated task to reflect the change
    renderTodo(todoItems[index]);
}

//todo |  Function to delete a to-do item
function deleteTodo(key) {
    // Find the index of the task with the specified ID (key)
    const index = todoItems.findIndex((item) => item.id === Number(key));

    // Create a new 'todo' object with a 'deleted' property set to true and the task's details
    const todo = { deleted: true, ...todoItems[index] };

    // Filter out the deleted task from the 'todoItems' array
    todoItems = todoItems.filter((item) => item.id !== Number(key));

    // Update the local storage with the modified 'todoItems' array
    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    // Render the deleted task to visually reflect the removal in the user interface
    renderTodo(todo);
}


//todo |  Get the form and set up a submit event listener
const form = document.querySelector('.js-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Select the input field for task entry
    const input = document.querySelector('.js-todo-input');

    // Extract and trim the task description entered by the user
    const text = input.value.trim();

    // Check if the entered task description is not empty
    if (text !== '') {
        // Add the new task to the to-do list
        addTodo(text);

        // Clear the input field after submission
        input.value = '';

        // Return focus to the input field for the user's convenience
        input.focus();
    }
});


//todo |  Get the list and set up a click event listener for item checkboxes and delete buttons
const list = document.querySelector('.js-todo-list');
list.addEventListener('click', function(event) {
    if (event.target.classList.contains('js-tick')) {
        // If the user clicks the task completion checkbox
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if (event.target.classList.contains('js-delete-todo')) {
        // If the user clicks the "Delete" button for a task
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
});


//todo |  When the page is loaded, check for saved to-do items in local storage and render them
document.addEventListener('DOMContentLoaded', function() {
    // This function runs when the DOM is fully loaded
    const storedItems = localStorage.getItem('todoItems');
    if (storedItems) {
        // If there are stored items in the local storage
        todoItems = JSON.parse(storedItems);
        // Retrieve the to-do list items from local storage and parse them from JSON format
        todoItems.forEach(function(savedItem) {
            // Iterate through each stored to-do item
            renderTodo(savedItem);
            // Render the item on the user interface using the renderTodo function
        });
    }
});

