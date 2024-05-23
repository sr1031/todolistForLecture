'use strict';

const eventTargets = {
    input: document.querySelector('#todo'),
    list: document.querySelector('#list')
};

eventTargets.input.addEventListener('keydown', event => {
    if(event.keyCode === 13 && event.target.value !== "") {
        const newTodo = document.createElement('li');
        newTodo.textContent = event.target.value;
        eventTargets.list.appendChild(newTodo);
        if (eventTargets.list.children.length % 4 === 0) {

        } 
        event.target.value = "";
    }
});