// create working task list
let tasks = JSON.parse(localStorage.getItem('taskArray')) || [];
let editIdNumber = 0;
let workingData = tasks;

// let buttonCell = `<button onclick="markCompleted(this)"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
//     <i class="fas fa-edit"></i>&nbsp;
//     <span class="text-danger"><i class="fas fa-trash-alt"></span></i>
//     `;

// sample task data structure
// let task = {
//     task: 'string',
//     taskDate: 'date String or date object',
//     createdDate: 'date object',
//     completed: bool
// }

function enableToolTips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function createTask() {
    // get user inputs
    let taskField = document.getElementById('newTask');
    let dateField = document.getElementById('newDateDue')
    let task = taskField.value;
    let createdDate = new Date().toLocaleDateString();

    // ternary ? operater is basically an if statement. test if this is true or false
    // if its empty send in todays date. if its not empty send its value.
    let date = dateField.value == "" ?
        new Date().toLocaleDateString() :
        new Date(`${dateField.value} 00:00`).toLocaleDateString();

    // let date = new Date().toLocaleDateString();

    // let date2 = `${dateField.value} 00:00`

    // 
    // if (dateField.value == '') {
    //     date = new Date().toLocaleDateString();
    // } else {
    //     date = new Date(date2).toLocaleDateString();
    // }


    if (task == '') {
        Swal.fire('Please enter a task');
    } else {
        // build task object
        let taskObject = {
            task: task,
            id: tasks.length,
            taskDate: date,
            created: createdDate,
            completed: false,
            late: false,
            buttonCell: `<button class='btn' onclick="markCompleted(this)" data-string="${tasks.length}" data-bs-toggle="tooltip"  title="Mark Completed"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
            <button class="btn" onclick="editTask(this)" data-string="${tasks.length}" data-bs-toggle="tooltip"  title="Edit Task"><i class="fas fa-edit"></i></button>&nbsp;
            <button class='btn'  onclick="deleteTask(this)" data-string="${tasks.length}" data-bs-toggle="tooltip"  title="Delete Task"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
            `
        }
        // add to tasks 
        tasks.push(taskObject);
        // update localStorage
        localStorage.setItem('taskArray', JSON.stringify(tasks))
    }

    closeModal();
    display();
    clearForm('createForm');
}

function clearTasks() {
    // set tasks to []
    tasks = [];
    // update localStorage
    localStorage.setItem('taskArray', JSON.stringify(tasks));
    workingData = tasks;
    display();
}

function clearToolTip() {
    $("div.tooltip").hide();
    // let ttDiv = document.querySelector('.tooltip')
    // ttDiv.hide();
}

function filter(task) {
    const template = document.getElementById('taskTemplate');
    const taskBody = document.getElementById('taskBody');
    let filterHead = document.getElementById('filterData');
    taskBody.innerHTML = '';

    // sort tasks by filter
    if (task == 'all') {
        // display all
        filterHead.innerHTML = `All Tasks(${workingData.length})`
        clearFilter();
    } else if (task == 'incomplete') {
        // loop and find completed == false
        //display
        workingData = [];

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed == false) {
                workingData.push(tasks[i]);
            }
        }
        filterHead.innerHTML = `Incomplete Tasks(${workingData.length})`
        display();

    } else if (task == 'completed') {
        // loop and find completed == true
        // display
        workingData = [];

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed == true) {
                workingData.push(tasks[i]);
            }
        }
        filterHead.innerHTML = `Completed Tasks(${workingData.length})`
        display();

    } else if (task == 'late') {
        workingData = [];
        for (let i = 0; i < tasks.length; i++) {
            if (Date.parse(generateModalDueDate(tasks[i].taskDate)) < new Date()) {
                workingData.push(tasks[i]);
            }
        }
        filterHead.innerHTML = `Over Due Tasks(${workingData.length})`
        display();

    } else if (task == 'search') {
        let searchTerm = document.getElementById('searchBar').value;
        workingData = [];

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].task.includes(searchTerm)) {
                workingData.push(tasks[i])
            }
        }
        filterHead.innerHTML = `Search: ${searchTerm} (${workingData.length}) Found`
        display();

    }
}

function clearFilter() {
    workingData = tasks;
    display();
}

function display() {
    const template = document.getElementById('taskTemplate');
    const taskBody = document.getElementById('taskBody');
    // clear screen
    taskBody.innerHTML = '';
    // defaults to all
    for (let i = 0; i < workingData.length; i++) {
        let taskRow = document.importNode(template.content, true);
        if (workingData[i].completed) {
            taskRow.getElementById('task').innerHTML = `<span class="text-decoration-line-through">${workingData[i].task}</span>`;
            taskRow.getElementById('created').innerHTML = `<span class="text-decoration-line-through">${workingData[i].created}</span>`;
            taskRow.getElementById('dueDate').innerHTML = `<span class="text-decoration-line-through">${workingData[i].taskDate}</span>`;
            taskRow.getElementById('buttons').innerHTML = `<span>${workingData[i].buttonCell}</span>`;
        } else {

            taskRow.getElementById('task').innerHTML = `<span class="text-decoration-none">${workingData[i].task}</span>`;
            taskRow.getElementById('created').innerHTML = `<span class="text-decoration-none">${workingData[i].created}</span>`;
            taskRow.getElementById('dueDate').innerHTML = `<span class="text-decoration-lnone">${workingData[i].taskDate}</span>`;
            taskRow.getElementById('buttons').innerHTML = `<span >${workingData[i].buttonCell}</span>`;
        }
        taskBody.appendChild(taskRow);
    }
    enableToolTips();
}

function markCompleted(element) {
    let elementId = parseInt(element.getAttribute('data-string'))
    // get this object from button
    // flip taskCompleted bool
    if (tasks[elementId].completed == true) {
        tasks[elementId].completed = false;
        for (let i = 0; i < workingData.length; i++) {
            if (workingData[i].id == elementId) {
                workingData[i].compelted = false;
            }
        }
    } else {
        tasks[elementId].completed = true;
        for (let i = 0; i < workingData.length; i++) {
            if (workingData[i].id == elementId) {
                workingData[i].compelted = true;
            }
        }
    }

    localStorage.setItem('taskArray', JSON.stringify(tasks));
    // change style to strikeout
    // added to display
    display();
    clearToolTip()
}

function editTask(element) {
    let elementId = parseInt(element.getAttribute('data-string'))
    // get this object from button
    // open edit dialog
    editIdNumber = elementId;
    // fill inputs with current data
    let editTask = document.getElementById('editTask');
    editTask.value = tasks[elementId].task;
    let editDateDue = document.getElementById('editDateDue');

    editDateDue.value = generateModalDueDate(tasks[elementId].taskDate);
    // editDateDue.value = new Date(tasks[elementId].taskDate).toLocaleDateString();
    clearToolTip();
    // if data is changed, change task
    // property
    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
    // update screen
}

function generateModalDueDate(date) {

    let dateArray = date.split("/");
    let newDate = `${dateArray[2]}-`;
    if (dateArray[0].length == 2) {
        newDate += `${dateArray[0]}-`;
    } else {
        newDate += `0${dateArray[0]}-`
    }
    if (dateArray[1].length == 2) {
        newDate += `${dateArray[1]}`;
    } else {
        newDate += `0${dateArray[1]}`
    }

    return newDate;
}

function updateTask() {

    // get user inputs
    let taskField = document.getElementById('editTask');
    let dateField = document.getElementById('editDateDue')
    let task = taskField.value;
    let createdDate = new Date().toLocaleDateString();
    let completed = tasks[editIdNumber].completed;
    let date = new Date(`${dateField.value} 00:00`).toLocaleDateString();

    if (task == '') {
        Swal.fire('Please enter a task');
    } else {
        // build task object
        let taskObject = {
            task: task,
            id: editIdNumber,
            taskDate: date,
            created: createdDate,
            completed: completed,
            buttonCell: `<button class='btn' onclick="markCompleted(this)" data-string="${editIdNumber}"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
            <button class="btn" onclick="editTask(this)" data-string="${editIdNumber}"><i class="fas fa-edit"></i></button>&nbsp;
            <button class='btn'  onclick="deleteTask(this)" data-string="${editIdNumber}"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
            `
        }
        // add to tasks 
        tasks[editIdNumber] = taskObject;
        // update localStorage
        localStorage.setItem('taskArray', JSON.stringify(tasks))
        for (let i = 0; i < workingData.length; i++) {
            if (workingData[i].id == taskObject.id) {
                workingData[i].task = task;
            }
        }
    }

    clearToolTip();

    closeEditModal();
    display();
    clearForm('editForm');

}

function deleteTask(element) {
    // get index of this object from button
    // array.splice(index, 1) to remove
    let elementId = parseInt(element.getAttribute('data-string'))
    tasks.splice(elementId, 1);

    for (let i = 0; i < workingData.length; i++) {
        if (workingData[i].id == elementId) {
            workingData.splice(i, 1);
        }
    }


    // reset task indexes
    for (let i = elementId; i < tasks.length; i++) {
        tasks[i].id = i;
        tasks[i].buttonCell = `<button class="btn"  onclick="markCompleted(this)" data-string="${i}" data-bs-toggle="tooltip"  title="Mark Completed"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
        <button class="btn" onclick="editTask(this)" data-string="${i}" data-bs-toggle="tooltip"  title="Edit Task"><i class="fas fa-edit"></i></button>&nbsp;
        <button class="btn" onclick="deleteTask(this)" data-string="${i}" data-bs-toggle="tooltip"  title="Delete Task"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
        `
    }

    clearToolTip();
    localStorage.setItem('taskArray', JSON.stringify(tasks));
    display();


}

function closeModal() {
    // let modal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
    // modal.hide();

    let modalBtn = document.getElementById('closeModalBtn');
    modalBtn.click();
}

function closeEditModal() {
    // let modal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
    // modal.hide();

    let modalBtn = document.getElementById('closeEditModalBtn');
    modalBtn.click();
}

function formatDate(dateString) {
    let dateArray = dateString.split("/");
    if (dateArray[0].length = 1) {
        let value = dateArray[0];
        dateArray[0] = `0${value}`;
    }
    if (dateArray[1].length = 1) {
        let value = dateArray[1];
        dateArray[1] = `0${value}`;
    }

    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]} 00:00`
}

function clearForm(form) {
    document.getElementById(form).reset();
}

function setupEventListeners() {
    document.getElementById("taskSave").addEventListener("click", createTask);
    document.getElementById("clearFilter").addEventListener("click", clearFilter);
    document.getElementById("editSave").addEventListener("click", function (e) {
        e.preventDefault();
        updateTask();
    });


    document.getElementById("taskClear").addEventListener("click", clearTasks);
    document.getElementById("menuClearTasks").addEventListener("click", clearTasks);
    window.onload = filter('all');
    document.getElementById("newTask").addEventListener('keypress', function (keyPressed) {

        if (keyPressed.key === "Enter") {
            keyPressed.preventDefault();
            createTask();

        }
    })
    document.getElementById("newDateDue").addEventListener('keypress', function (keyPressed) {
        if (keyPressed.key === "Enter") {
            keyPressed.preventDefault();
            createTask();
        }
    });
    document.getElementById("editTask").addEventListener('keypress', function (keyPressed) {
        if (keyPressed.key === "Enter") {
            keyPressed.preventDefault();
            updateTask();
        }
    });
    document.getElementById("editDateDue").addEventListener('keypress', function (keyPressed) {
        if (keyPressed.key === "Enter") {
            keyPressed.preventDefault();
            updateTask();
        }
    });
    document.getElementById("searchBtn").addEventListener("click", (e) => {
        e.preventDefault();
        filter('search');
    });
    document.getElementById("displayAll").addEventListener("click", () => {
        filter('all');
    });
    document.getElementById("filterIncomplete").addEventListener("click", () => {
        filter('incomplete');
    });
    document.getElementById("filterCompleted").addEventListener("click", () => {
        filter('completed');
    });
    document.getElementById("filterLate").addEventListener("click", () => {
        filter('late');
    });


}



// (x => x.something  == value)

// is the same as 
// function findSomething (x) {
//     let newArrayOfSomethings = [];

//     for (let i = 0; i < x.length; i++) {
//         if (x[i].something == something){
//             newArrayOfSomethings.push(x[i]);
//         }
//     }
//     return newArrayOfSomethings;
// }