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
    const index = todoItems.findIndex((item) => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderTodo(todoItems[index]);
}

//todo |  Function to delete a to-do item
function deleteTodo(key) {
    const index = todoItems.findIndex((item) => item.id === Number(key));
    const todo = { deleted: true, ...todoItems[index] };

    todoItems = todoItems.filter((item) => item.id !== Number(key));
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderTodo(todo);
}

//todo |  Get the form and set up a submit event listener
const form = document.querySelector('.js-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.querySelector('.js-todo-input');
    const text = input.value.trim();
    if (text !== '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

//todo |  Get the list and set up a click event listener for item checkboxes and delete buttons
const list = document.querySelector('.js-todo-list');
list.addEventListener('click', function(event) {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
});

//todo |  When the page is loaded, check for saved to-do items in local storage and render them
document.addEventListener('DOMContentLoaded', function() {
    const storedItems = localStorage.getItem('todoItems');
    if (storedItems) {
        todoItems = JSON.parse(storedItems);
        todoItems.forEach(function(savedItem) {
            renderTodo(savedItem);
        });
    }
});
