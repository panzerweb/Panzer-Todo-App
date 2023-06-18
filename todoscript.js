let todoItems = [];

function renderTodo(todo){
    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key = "${todo.id}"]`);
    
    if (todo.deleted) {
        item.remove();
        if (todoItems.length === 0) list.innerHTML = '';
        return;
    }

    const { year, month, day, hour, minutes } = todo.date;
    const formattedDate = `${year}/${month}/${day}-${hour}:${minutes}`;

    const isChecked = todo.checked ? 'done':'';
    const node = document.createElement('li');
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = 
    `

    <label for="${todo.id}" class="tick js-tick">
    <input id="${todo.id}" type="checkbox"/ class="checkbox js-checkbox">   
    </label>

    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon">     <span id="date-span">${formattedDate}</span>

        </use></svg>
        </button>
    `;

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }
}

function addTodo(text){
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
    todoItems.push(todoObj);
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderTodo(todoObj);
}

function toggleDone(key){
    const index = todoItems.findIndex((item) => item.id === Number(key));
    todoItems[index].checked = !todoItems[index].checked;
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    
    renderTodo(todoItems[index]);
}

function deleteTodo(key){
    const index = todoItems.findIndex((item) => item.id === Number(key));
    const todo = { deleted: true, ...todoItems[index]};

    todoItems = todoItems.filter((item) => item.id !== Number(key));
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderTodo(todo);
}
const form = document.querySelector('.js-form');
form.addEventListener('submit', function(event){
    event.preventDefault();
    const input = document.querySelector('.js-todo-input');
    const text = input.value.trim();
    if(text != ''){
        addTodo(text);
        input.value = '';
        input.focus();
    }
})
const list = document.querySelector('.js-todo-list');
list.addEventListener('click',  function(event){
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
})

document.addEventListener('DOMContentLoaded', function(){
    const ref = localStorage.getItem('todoItems');
    if (ref) {
        todoItems = JSON.parse(ref);
        todoItems.forEach(function(save){
            renderTodo(save);
        })
    }
})

