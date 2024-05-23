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

pagenation(todoContents);

const deleteList = (lis) => {
    Array(...lis).forEach((li) => {
        li.parentNode.removeChild(li);
    });
};

const loadList = (page) => {
    const pageNum = Number(page);
    let i = (pageNum - 1) * pageSize;
    for (let j = 0; j < pageSize; j++) {
        if (todoContents[i + j]) {
            const newLi = document.createElement("li");
            newLi.innerText = todoContents[i + j];
            eventTargets.list.appendChild(newLi);
        }
    }
};

const refrashList = (nowPage) => {
    deleteList(eventTargets.list.children);
    loadList(nowPage);
};

pages.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
        nowPage = event.target.innerText;
        refrashList(nowPage);
    }
});

eventTargets.input.addEventListener("keydown", (event) => {
    if (event.keyCode === 13 && event.target.value !== "") {
        todoContents.push(event.target.value);
        pagenation(todoContents, pageSize);
        event.target.value = "";
        refrashList(nowPage);
    }
});
