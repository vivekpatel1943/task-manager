document.addEventListener("DOMContentLoaded",function(){
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const deadlineInput = document.getElementById('setDeadline');
    let tasks = [];

    // retrieving the tasks from localStorage
    try{
        // while setting anything into the localStorage you will have to set up an unique key for the items you are storing and change them into strings with JSON,stringify()
        const storedTasks = localStorage.getItem('tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];   
        if(!Array.isArray(tasks)){
            tasks = [];
        }
    } catch(error){
        console.error("Error parsing tasks from local storage",error);
        tasks = [];
    }  

    // populate tasks from localStorage
    tasks.forEach(task => addTask(task.text,task.completed,task.deadline));

    // eventListener for adding tasks
    taskForm.addEventListener('submit', (event) => {
        // submit button basically reloads the web page by default , but here we are setting it for a different task, thus this prevent default function will prevent the submit button to do so  
        event.preventDefault();
        // the trim() function is simply to remove the spaces at the start and the end of the text entered 
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        if(taskText !== ""){
            addTask(taskText,false,deadline);
            taskInput.value = "";
            deadlineInput.value = "";
        }
    })

    // Function to add a new task
    // the two arguments task , task the tasks being added 
    // isCompleted = false, all the tasks by default are not completed
    function addTask(taskText,isCompleted=false,deadline=""){
        // creating a <li></li> element to keep all our tasks
        // giving them a className of taskItem
        // if the tasks is completed the className of 'completed' shall be automatically added to that item
        // for every taskItem there should be a taskText which would tell what the task is, a button with which the user can toggle the task 'completed' and an other between with which you can delete the task..
        // taskList is appended in the taskItem div
        // saveTasks() function is invoked to save all the tasks in our localStorage   
        const taskItem = document.createElement("li");
        taskItem.className = 'task-item';
        if(isCompleted){
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
            <span class="deadline">${deadline ? new Date(deadline).toLocaleDateString() : ""}</span>
        `;
        taskList.appendChild(taskItem);
        saveTasks();
    }

    // Event delegation for deleting and completing tasks
    // adding a eventListener for a 'click' event , 
    // a function with event as an argument  
    // with event.target = target, you can target any event 
    // if the className of the element you are targeting is 'complete-btn' , change the className of the parentElement of the button to 'completed', and then just invoke the saveTasks() function
    // if the className of the element(button) is delete-btn, remove the parentElement entirely with taskItem.remove()
    
    taskList.addEventListener('click',function(event){
        const target = event.target;
        if(target.classList.contains('complete-btn')){
            const taskItem = target.parentElement;
            taskItem.classList.toggle("completed");
            saveTasks();  
        }
        if(target.classList.contains('delete-btn')){
            const taskItem = target.parentElement;
            taskItem.remove();
            saveTasks();
        }
    })


    // function to saveTasks to localStorage
    // declaring a function called saveTasks , with the function we will basically save tasks in the localStorage  
    // we will  be using try-catch blocks for error handling
    // in the try block we will take all the tasks in the taskList with the help of 'Array.from' method , and keep them with two keys 'text' and 'completed' , with key 'text' we have all the values inserted by the users as different tasks, so basically in the localStorage where all the tasks are stored in the form json all the non-completed tasks are stored with 'text' key and all the completed tasks are stored with 'completed' key
    // set those items in the with localStorage.set('tasks',json.stringify(tasks))
    function saveTasks(){
        try{
            const tasks = Array.from(taskList.children).map(taskItem => ({
                text : taskItem.querySelector('span').innerText,
                completed: taskItem.classList.contains('completed'),
                deadline : taskItem.querySelector('.deadline').innerText
            }))
            localStorage.setItem('tasks',JSON.stringify(tasks));
        }catch(error){
            console.log("Error saving tasks to localStorage",error)
        }
    } 

})

