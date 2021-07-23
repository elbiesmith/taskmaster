// create working task list
let tasks = JSON.parse(localStorage.getItem('taskArray')) || [];
// let buttonCell = `<button onclick="markCompleted(this)"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
//     <i class="fas fa-edit"></i>&nbsp;
//     <span class="text-danger"><i class="fas fa-trash-alt"></span></i>
//     `;

// sample task data structure
// let task = {
//     title: 'string',
//     taskDate: 'date String or date object',
//     createdDate: 'date object',
//     completed: bool
// }

function createTask() {
    // get user inputs
    let taskField = document.getElementById('newTask');
    let dateField = document.getElementById('newDateDue')
    let task = taskField.value;
    let createdDate = new Date().toLocaleDateString();
    let date = new Date().toLocaleDateString();

    let date2 = `${dateField.value} 00:00`

    // date is showing date - 1 day 
    if (dateField.value == '') {
        date = new Date().toLocaleDateString();
    } else {
        date = new Date(date2).toLocaleDateString();
    }


    if (task == '') {
        Swal.fire('Please enter a task');
    } else {
        // build task object
        let taskObject = {
            title: task,
            id: tasks.length,
            taskDate: date,
            created: createdDate,
            completed: false,
            buttonCell: `<button class='btn' onclick="markCompleted(this)" data-string="${tasks.length}"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
            <button class="btn" onclick="editTask(this)"><i class="fas fa-edit"></i></button>&nbsp;
            <button class='btn'  onclick="deleteTask(this)" data-string="${tasks.length}"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
            `
        }
        // add to tasks 
        tasks.push(taskObject);
        // update localStorage
        localStorage.setItem('taskArray', JSON.stringify(tasks))
    }

    closeModal();
    display();

}

function clearTasks() {
    // set tasks to []
    tasks = [];
    // update localStorage
    localStorage.setItem('taskArray', JSON.stringify(tasks));
    display();
}

function filter(task) {
    // sort tasks by filter

    // if theres a search term
    // check if term is in task

    // display screen using filtered items

}

function display() {
    const template = document.getElementById('taskTemplate');
    const taskBody = document.getElementById('taskBody');
    let workingData = tasks || [];
    // clear screen
    taskBody.innerHTML = '';
    // defaults to all
    for (let i = 0; i < workingData.length; i++) {
        let taskRow = document.importNode(template.content, true);
        if (workingData[i].completed) {
            taskRow.getElementById('task').innerHTML = `<span class="text-decoration-line-through">${workingData[i].title}</span>`;
            taskRow.getElementById('created').innerHTML = `<span class="text-decoration-line-through">${workingData[i].created}</span>`;
            taskRow.getElementById('dueDate').innerHTML = `<span class="text-decoration-line-through">${workingData[i].taskDate}</span>`;
            taskRow.getElementById('buttons').innerHTML = `<span>${workingData[i].buttonCell}</span>`;
        } else {
            
            taskRow.getElementById('task').innerHTML = `<span class="text-decoration-none">${workingData[i].title}</span>`;
            taskRow.getElementById('created').innerHTML = `<span class="text-decoration-none">${workingData[i].created}</span>`;
            taskRow.getElementById('dueDate').innerHTML = `<span class="text-decoration-lnone">${workingData[i].taskDate}</span>`;
            taskRow.getElementById('buttons').innerHTML = `<span >${workingData[i].buttonCell}</span>`;
        }
        taskBody.appendChild(taskRow);
    }

}

function markCompleted(element) {
    let elementId = parseInt(element.getAttribute('data-string'))
    // get this object from button
    // flip taskCompleted bool
    if (tasks[elementId].completed == true) {
        tasks[elementId].completed = false;
    } else {
        tasks[elementId].completed = true;
    }
    
    localStorage.setItem('taskArray', JSON.stringify(tasks));
    // change style to strikeout
    // added to display
    display();
}

function editTask(element) {
    let elementId = parseInt(element.getAttribute('data-string'))
    // get this object from button
    // open edit dialog
    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
    // fill inputs with current data
    let editTask = document.getElementById('editTask');
    editTask.value = tasks[elementId].task;
    let editDate = document.getElementById('editDateDue');
    editDate.value = tasks[elementId].taskDate;
    // if data is changed, change task
    // property

    // update screen
}

function deleteTask(element) {
    // get index of this object from button
    // array.splice(index, 1) to remove
    let elementId = parseInt(element.getAttribute('data-string'))
    tasks.splice(elementId, 1);

    // reset task indexes
    for (let i = elementId; i < tasks.length; i++) {
        tasks[i].buttonCell = `<a id="${i}" onclick="markCompleted(this)" data-string="${i}"><span class="text-primary"><i class="fas fa-check-square"></i></span></a>&nbsp; 
        <i class="fas fa-edit"></i>&nbsp;
        <a id="${i}" onclick="deleteTask(this)" data-string="${i}"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
        `
    }

    localStorage.setItem('taskArray', JSON.stringify(tasks));
    display();


}

function closeModal() {
    // let modal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
    // modal.hide();

    let modalBtn = document.getElementById('closeModalBtn');
    modalBtn.click();
}