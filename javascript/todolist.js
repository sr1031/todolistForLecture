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
            const newLi = document.createElement("li");
            newLi.innerText = getTodo;
            eventTargets.list.appendChild(newLi);
        }
    }
};

const refrashList = (nowPage) => {
    deleteList(eventTargets.list.children);
    loadList(nowPage);
};

class todoLocalStorage {
    constructor() {
        if (!localStorage.getItem("todos"))
            localStorage.setItem("todos", JSON.stringify(todoContents));
        else
            refrashList(1);
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

