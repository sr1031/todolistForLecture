"use strict";

const eventTargets = {
    input: document.querySelector("#todo"),
    list: document.querySelector("#list"),
};

const pages = document.querySelector(".pages");
const todoContents = Array(...eventTargets.list.children).map(
    (li) => li.innerText
);

let nowPage = 1;
const pageSize = 3;

const deleteList = (lis) => {
    Array(...lis).forEach((li) => {
        li.parentNode.removeChild(li);
    });
};

const loadList = (page) => {
    const pageNum = Number(page);
    let i = (pageNum - 1) * pageSize;
    for (let j = 0; j < pageSize; j++) {
        const getTodo = todoLocalStorage.getTodoByIdx(i + j);
        if (getTodo) {
            const newLi = document.createElement('li');
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            newLi.appendChild(checkBox);
            newLi.append(" " + getTodo);
            newLi.value = i + j;
            eventTargets.list.appendChild(newLi);
        }
    }
};

const isEmptyPage = (page) => {
    const pageNum = Number(page);
    const i = (pageNum - 1) * pageSize;

    return todoLocalStorage.getTodoByIdx(i);
};

const refrashList = (nowPage) => {
    deleteList(eventTargets.list.children);
    if (isEmptyPage(nowPage))
        loadList(nowPage);
    else {
        nowPage = nowPage - 1;
        loadList(nowPage);
    }
};

class todoLocalStorage {
    constructor() {
        if (!localStorage.getItem("todos"))
            localStorage.setItem("todos", JSON.stringify(todoContents));
        else refrashList(1);
    }

    static getAllTodo() {
        return JSON.parse(localStorage.getItem("todos"));
    }

    static getTodoByIdx(idx) {
        const nowTodos = JSON.parse(localStorage.getItem("todos"));
        return nowTodos[idx];
    }

    static addTodo(todo) {
        const nowTodos = JSON.parse(localStorage.getItem("todos"));
        nowTodos.push(todo);
        localStorage.setItem("todos", JSON.stringify(nowTodos));
    }

    static removeTodo(idx) {
        const nowTodos = JSON.parse(localStorage.getItem("todos"));
        nowTodos.splice(idx, 1);
        localStorage.setItem("todos", JSON.stringify(nowTodos));
    }
}

new todoLocalStorage();

const pagesDelete = () => {
    Array(pages.childElementCount)
        .fill(0)
        .forEach(() => {
            pages.removeChild(pages.lastChild);
        });
};

const pagenation = (contents) => {
    const pageNum =
        contents.length % pageSize > 0
            ? Math.floor(contents.length / pageSize) + 1
            : Math.floor(contents.length / pageSize);
    pagesDelete();
    Array(pageNum)
        .fill(0)
        .forEach((_, index) => {
            const pageBtn = document.createElement("span");
            pageBtn.innerText = index + 1;
            pages.appendChild(pageBtn);
        });
};

pagenation(todoLocalStorage.getAllTodo());

pages.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
        nowPage = event.target.innerText;
        refrashList(nowPage);
    }
});

eventTargets.input.addEventListener("keydown", (event) => {
    if (event.keyCode === 13 && event.target.value !== "") {
        todoLocalStorage.addTodo(event.target.value);
        pagenation(todoLocalStorage.getAllTodo());
        event.target.value = "";
        refrashList(nowPage);
    }
});

eventTargets.list.addEventListener("dblclick", (event) => {
    if (event.target.nodeName === "LI") {
        const idx = event.target.value;
        event.target.parentNode.removeChild(event.target);
        todoLocalStorage.removeTodo(idx);
        pagenation(todoLocalStorage.getAllTodo());
        refrashList(nowPage);
    }
});


