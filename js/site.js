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
            task: task,
            id: tasks.length,
            taskDate: date,
            created: createdDate,
            completed: false,
            late: false,
            buttonCell: `<button class='btn' onclick="markCompleted(this)" data-string="${tasks.length}"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
            <button class="btn" onclick="editTask(this)" data-string="${tasks.length}"><i class="fas fa-edit"></i></button>&nbsp;
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

function filter(task) {
    const template = document.getElementById('taskTemplate');
    const taskBody = document.getElementById('taskBody');

    taskBody.innerHTML = '';
    
    // sort tasks by filter
    if(task == 'all'){
        // display all
        clearFilter();
    } else if (task == 'incomplete') {
        // loop and find completed == false
        //display
        workingData = [];

        for( let i = 0; i < tasks.length; i++){
            if(tasks[i].completed == false){
                workingData.push(tasks[i]);
            }
        }

        display();

    } else if (task == 'completed') {
        // loop and find completed == true
        // display
        workingData = [];

        for( let i = 0; i < tasks.length; i++){
            if(tasks[i].completed == true){
                workingData.push(tasks[i]);
            }
        }

        display();

    } else if (task == 'late')  {

    }
    // if theres a search term
    // check if term is in task

    // display screen using filtered items

}

function clearFilter(){
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

}

function markCompleted(element) {
    let elementId = parseInt(element.getAttribute('data-string'))
    // get this object from button
    // flip taskCompleted bool
    if (tasks[elementId].completed == true) {
        tasks[elementId].completed = false;
        for(let i = 0; i<workingData.length; i++){
            if (workingData[i].id == elementId){
                workingData[i].compelted = false;
            }
        }
    } else {
        tasks[elementId].completed = true;
        for(let i = 0; i<workingData.length; i++){
            if (workingData[i].id == elementId){
                workingData[i].compelted = true;
            }
        }
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
    editIdNumber = elementId;
    // fill inputs with current data
    let editTask = document.getElementById('editTask');
    editTask.value = tasks[elementId].task;
    let editDateDue = document.getElementById('editDateDue');
    editDateDue.value = formatDate(tasks[elementId].taskDate);
    
    // if data is changed, change task
    // property
    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
    // update screen
}

function updateTask(){
    
    // get user inputs
    let taskField = document.getElementById('editTask');
    let dateField = document.getElementById('editDateDue')
    let task = taskField.value;
    let createdDate = new Date().toLocaleDateString();
    let date = new Date().toLocaleDateString();
    let completed = tasks[editIdNumber].completed;

    let date2 = `${dateField.value} 00:00`

    // date is showing date - 1 day 
    if (dateField.value == '') {
        date = new Date(formatDate(tasks[editIdNumber].taskDate)).toLocaleDateString();
    } else {
        date = new Date(date2).toLocaleDateString();
    }


    if (task == '') {
        Swal.fire('Please enter a task');
    } else {
        // build task object
        let taskObject = {
            task: task,
            id: tasks.length,
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
        for (let i = 0; i<workingData.length;i++){
            if(workingData[i].id == taskObject.id){
                workingData[i].task = task;
            }
        }
    }


    
    closeEditModal();
    display();
    clearForm('editForm');
    
}

function deleteTask(element) {
    // get index of this object from button
    // array.splice(index, 1) to remove
    let elementId = parseInt(element.getAttribute('data-string'))
    tasks.splice(elementId, 1);
    
    for (let i = 0; i < workingData.length;i++){
        if (workingData[i].id == elementId){
            workingData.splice(i, 1);
        }
    }


    // reset task indexes
    for (let i = elementId; i < tasks.length; i++) {
        tasks[i].id = i;
        tasks[i].buttonCell = `<button class="btn"  onclick="markCompleted(this)" data-string="${i}"><span class="text-primary"><i class="fas fa-check-square"></i></span></button>&nbsp; 
        <button class="btn" onclick="editTask(this)" data-string="${i}"><i class="fas fa-edit"></i></button>&nbsp;
        <button class="btn" onclick="deleteTask(this)" data-string="${i}"><span class="text-danger"><i class="fas fa-trash-alt"></span></i></button>
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

function closeEditModal() {
    // let modal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
    // modal.hide();

    let modalBtn = document.getElementById('closeEditModalBtn');
    modalBtn.click();
}

function formatDate(dateString){
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

function clearForm(form){
    document.getElementById(form).reset();
}

function setupEventListeners() {
    document.getElementById("taskSave").addEventListener("click", createTask);
    document.getElementById("clearFilter").addEventListener("click", clearFilter);
    document.getElementById("editSave").addEventListener("click", function (e) {
        e.preventDefault();
        updateTask();
    });
    
    document.getElementById("searchBtn").addEventListener("click", search)
    document.getElementById("taskClear").addEventListener("click", clearTasks);
    document.getElementById("menuClearTasks").addEventListener("click", clearTasks);
    window.onload = display();
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


function search() {
    let searchTerm = document.getElementById('searchBar').value;
    workingData = [];
    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].task.includes(searchTerm)){
            workingData.push(tasks[i])
        }
    }
    display();
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