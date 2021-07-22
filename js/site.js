// create working task list
let tasks = JSON.parse(localStorage.getItem('taskArray')) || [];

// sample task data structure
// let task = {
//     title: 'string',
//     taskDate: 'date String or date object',
//     taskCompleted: bool,
//     overdue: bool
// }

function createTask() {
    // build task object

    // add to tasks 

    // update localStorage
}

function clearTasks() {
    // set tasks to []

    // update localStorage
}

function filter(task){
    // sort tasks by filter

    // if theres a search term
    // check if term is in task

    // display screen using filtered items
    
}

function display(filter){
    // clear screen

    // defaults to all
}

function markCompleted(){
    // get this object from button
    // flip taskCompleted bool
    // change style to strikeout
}

function editTask() {
    // get this object from button
    // open edit dialog
    // fill inputs with current data

    // if data is changed, change task
    // property
    
    // update screen
}

function deleteTask() {
    // get index of this object from button
    // array.splice(index, 1) to remove
}