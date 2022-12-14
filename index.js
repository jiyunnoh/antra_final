const todoForm = document.querySelector(".todo-form");
const inputData = document.querySelector(".todo-form__input");
const todoContainer = document.querySelector(".todo-container");
const todoResult = document.querySelector(".todo-result");
const todoFormSubmit = document.querySelector(".todo-form__submit");
const editIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;
const deleteIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;

class State {
    constructor() {
        this._todos = []
    }

    get todos() {
        return this._todos;
    }

    set todos(todos) {
        this._todos = todos;
    }
}

const state = new State();

function renderResult(todos) {
    console.log(todos.length);
    if (todos.length === 0) {
        console.log(todos.length);
        todoResult.innerHTML = "<div>no active task</div>";
    }
}

function renderTodos(todos) {
    const todoInnerHTML = todos.map(todo => {
        return `<article class="todo">
            <div class="todo__title" id="${todo.id}__title" onClick="completeHandler(${todo.id})">${todo.title}</div>
            <input class="todo__title__edit" id="${todo.id}__title__edit" />
            <button class="todo__edit" onClick="editItemHandler(${todo.id})">${editIcon}</button>
            <button class="todo__delete" onClick="deleteItemHandler(${todo.id})">${deleteIcon}</button>
        </article>`
    }).join("");

    todoContainer.innerHTML = todoInnerHTML;
}

function completeHandler(id) {
    const clicked = document.getElementById(`${id}__title`);
    clicked.classList.toggle("todo__click--toggle");
}

function submitEvent() {
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const todoTitle = inputData.value;
        if (todoTitle.length !== 0) {
            postItem(todoTitle)
            .then(() => getItem());
        }
        todoForm.reset();
    })
}

async function postItem(title) {
    await fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
            title,
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
}

function getItem() {
    fetch("http://localhost:3000/todos")
        .then(res => res.json())
        .then(todos => {
            state.todos = todos;
            renderResult(state.todos);
            renderTodos(state.todos);
        })
}

function editItemHandler(id) {
    const title = document.getElementById(`${id}__title`);
    const editTitle = document.getElementById(`${id}__title__edit`);
    title.style.display = title.style.display == "none" ? "block" : "none";
    editTitle.style.display = editTitle.style.display == "block" ? "none" : "block";
    // editTitle.setAttribute("value", `${title.textContent}`);
    const editedInput = editTitle.value;
    if (editedInput !== "") {
        editItem(id, editedInput);
    }
}

function editItem(id, title) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            title,
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(() => getItem());
}

function deleteItemHandler(id) {
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        getItem();
    })
}

todoFormSubmit.addEventListener('click', submitEvent());

(() => {
    getItem();
})()

