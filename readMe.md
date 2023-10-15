# **Panzer-Todo-List App**

## Overview
This is a simple To-Do List App that serves to simplify the way we list our tasks, activities, and other sort of goals we want to achieve. It does not offer payment for any of the users, this project is created for everyone to use without any charges.

## **Note** 
This Project does not have any backend features yet, it uses local storage as means of storing data.

This documentation is meant for the javascript code only!

# `Getting Started`

1. Open [Panzer To-Do-App](https://panzerweb.github.io/Panzer-Todo-App/) in a web browser to run the application.
2. You can add new to-do items by entering text in the input field and clicking "Add."
3. To mark an item as done, click the checkbox icon.
4. To delete an item, click the delete icon.

# ***JavaScript Code Explanation***

# **An empty array for storing values:**
```
let todoItems = [];
```

# **Adding Function**
This function serves to create the list through using an object and storing it in the empty array.

```javascript
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
```


# **Rendering function**
This code renders the values from add function to the website.
```javascript
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
```

# **Toggling a task done function**

This function is responsible for toggling the status of a task, marking it as "done" or "undone". It is implemented using the findIndex method to locate the task's ID within the todoItems array.

The key parameter also serves as the id.  Once both id's are identical.

```javascript
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

```

# **Deleting function**
This function is responsible for removing a task from the list of to-dos. It uses the findIndex method to locate the task's ID within the todoItems array, and it relies on the key parameter to identify the task to be deleted.

```javascript
function deleteTodo(key) {
    //Find the index of the task with the specified ID (key)
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

```

# **Handling Form Submission**

This event listener is responsible for capturing and processing the submission of a new task through the input form in the user interface. It ensures that a task is added to the to-do list when the user submits a valid task description.

```javascript
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

```

# **Managing To-Do List Items**

This event listener is responsible for managing user interactions with individual to-do list items. It allows users to mark tasks as done or delete them, providing essential functionality for task management.

```javascript
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


```

# **DOM CONTENT LOADING**

## Event Listener: `DOMContentLoaded`

The `DOMContentLoaded` event listener plays a vital role in ensuring that all user tasks, whether added or checked, are correctly displayed on the website. Its primary function is to initialize the Panzer To-Do List App and provide users with access to their stored tasks upon page loading.

### `Loading and Displaying User Tasks`
This event listener waits for the HTML content to be fully loaded and retrieves any previously stored to-do items from local storage. It efficiently loads and displays these tasks, including completed ones, enabling users to access their task list without loss of data.

### `Maintaining User Data`
By loading user tasks, the `DOMContentLoaded` event listener contributes to maintaining a seamless experience for users, ensuring that their to-do items are preserved in the local storage and visible when they return to the website.

```javascript
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
```


# **Conclusion**
The Panzer To-Do List App provides a simple and effective way to manage your to-do tasks. Users can add, mark as done, and delete items with ease. The application is built using HTML, JavaScript, and Bootstrap for styling.

For additional features and customizations, you can modify the JavaScript code and CSS according to your needs.

Enjoy using the Panzer To-Do List App for better task management!