"use strict";
const eventTargets = {
    input: document.querySelector("#todo"),
    list: document.querySelector("#list"),
};

const pages = document.querySelector(".pages");
const allDelete = document.querySelector(".all__delete div");

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
            const checkBox = document.createElement("input");
            const checkBoxLabel = document.createElement("label");
            const checkSpan = document.createElement("span");
            checkBox.type = "checkbox";
            checkBox.checked = getTodo.completed;
            if (checkBox.checked) {
                checkBoxLabel.classList.add("completed__todo");
                checkSpan.classList.add("checked");
            }
            checkSpan.classList.add("check");
            checkBoxLabel.append(getTodo.content);
            checkBoxLabel.append(checkSpan);
            newLi.append(checkBoxLabel);
            newLi.append(checkBox);
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
    if (isEmptyPage(nowPage)) loadList(nowPage);
    else {
        nowPage = nowPage - 1;
        loadList(nowPage);
    }
};

class todoLocalStorage {
    constructor() {
        if (localStorage.getItem("todos")) refrashList(1);
    }
    
    static getAllTodo() {
        const nowAllTodo = JSON.parse(localStorage.getItem("todos"));
        return nowAllTodo? nowAllTodo : [];
    }

    static getTodoLength() {
        return todoLocalStorage.getAllTodo().length;
    }

    static getTodoByIdx(idx) {
        return todoLocalStorage.getAllTodo()[idx];
    }

    static addTodo(todo) {
        const nowTodos = todoLocalStorage.getAllTodo();
        nowTodos.push({ content: todo, completed: false });
        localStorage.setItem("todos", JSON.stringify(nowTodos));
    }

    static removeTodo(idx) {
        const nowTodos = todoLocalStorage.getAllTodo();
        if (nowTodos.length > 1) {
            nowTodos.splice(idx, 1);
            localStorage.setItem("todos", JSON.stringify(nowTodos));
        } else localStorage.removeItem("todos");
    }

    static removeAllTodo() {
        localStorage.removeItem("todos");
    }

    static checkTodo(idx, isChecked) {
        const nowTodos = todoLocalStorage.getAllTodo();
        nowTodos[idx].completed = isChecked;
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

const pagenation = (contentsLength) => {
    const pageNum =
        contentsLength % pageSize > 0
            ? Math.floor(contentsLength / pageSize) + 1
            : Math.floor(contentsLength / pageSize);
    pagesDelete();
    Array(pageNum)
        .fill(0)
        .forEach((_, index) => {
            const pageBtn = document.createElement("span");
            pageBtn.innerText = index + 1;
            pages.appendChild(pageBtn);
        });
};

pagenation(todoLocalStorage.getTodoLength());

pages.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
        nowPage = event.target.innerText;
        refrashList(nowPage);
    }
});

eventTargets.input.addEventListener("keydown", (event) => {
    if (event.keyCode === 13 && event.target.value.trim() !== "") {
        todoLocalStorage.addTodo(event.target.value);
        pagenation(todoLocalStorage.getTodoLength());
        event.target.value = "";
        refrashList(nowPage);
    }
});

eventTargets.list.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
        const label = event.target.parentNode;
        const checkBox = label.firstElementChild;
        if (!checkBox.checked) {
            label.classList.add("completed__todo");
            event.target.classList.add("checked");
            checkBox.checked = true;
            todoLocalStorage.checkTodo(label.parentNode.value, true);
        } else {
            label.classList.remove("completed__todo");
            event.target.classList.remove("checked");
            checkBox.checked = false;
            todoLocalStorage.checkTodo(label.parentNode.value, false);
        }
    }
});

eventTargets.list.addEventListener("dblclick", (event) => {
    if (event.target.nodeName === "LABEL") {
        const idx = event.target.parentNode.value;
        eventTargets.list.removeChild(event.target.parentNode);
        todoLocalStorage.removeTodo(idx);
        pagenation(todoLocalStorage.getTodoLength());
        refrashList(nowPage);
    }
});

allDelete.addEventListener("click", () => {
    todoLocalStorage.removeAllTodo();
    nowPage = 1;
    refrashList(nowPage);
    pagenation(todoLocalStorage.getTodoLength());
});
