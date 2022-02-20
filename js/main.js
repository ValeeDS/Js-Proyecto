// DECLARACIÓN DE FUNCIONES

function progress_status(array) {
    let tot_tasks = array.length;
    let array_filtered = array.filter((el) => el.status == true);
    let tot_completed = array_filtered.length;

    if (tot_tasks == 0) { progress = '-'; }
    else { progress = tot_completed/tot_tasks; }

    return progress;
}

function sendForm(e) {
    e.preventDefault();
    tests = document.getElementsByClassName('inputTask');

    const inputs = miFormulario.children;

    let search = proyectos.find((el) => el.name == inputs[0].value);
    if (search == undefined) {
        const tasks_divs = document.getElementsByClassName('inputTask');
        const tasks = [];
    
        for (task of tasks_divs){
            input_task = task.children;
            if ((input_task[1].value == "") || (input_task[1].value == null)) {
                continue;
            }
            else {
                tasks.push(new Task(input_task[1].value,input_task[0].value));
            }
        }
    
        proyectos.push(new Proyect(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, tasks));

        show_frontend();
    }
    else {
        alert("El proyecto ya existe");
    }
}

function resetForm() {
    let div_tasks = document.getElementById('form_div_tasks');
    div_tasks.innerHTML = `<p>Tareas</p>
                           <div class="inputTask">
                               <input type="checkbox" name="taskStatus" value=false>
                               <input type="text" name="taskName" placeholder= "Tarea">
                               <input type="button" id="btnAddTask" value="+">
                           </div>`;
}

function addtaskClick() {
    let proy_btnSubmit = document.getElementById('proyectSubmit');
    proy_btnSubmit.remove();

    let task_btnAdd = document.getElementById('btnAddTask');
    task_btnAdd.remove();

    let proy_input = document.createElement("div");
    proy_input.className = "inputTask";

    proy_input.innerHTML = `<input type="checkbox" name="taskStatus" value=false>
                            <input type="text" name="taskName" placeholder= "Tarea">
                            <input type="button" id="btnAddTask" value="+">`;

    document.getElementById('form_div_tasks').appendChild(proy_input);

    let proy_Submit = document.createElement("input");
    proy_Submit.type = "submit";
    proy_Submit.id = "proyectSubmit";
    document.getElementById('proyectForm').appendChild(proy_Submit);
}

function on(eventName, selector, handler) {
  document.addEventListener(eventName, function(event) {
    const elements = document.querySelectorAll(selector);
    const path = event.composedPath();
    path.forEach(function(node) {
      elements.forEach(function(elem) {
        if (node === elem) {
          handler.call(elem, event);
        }
      });
    });
  }, true);
}

function show_frontend(){
    const proyecto = proyectos[proyectos.length - 1]

    let proy_div = document.createElement("div");
    proy_div.id = (proyecto.name);
    proy_div.className = "proyect";

    proy_div.innerHTML = `<h3>Proyecto: ${proyecto.name}</h3>
                         <p>${proyecto.description}</p>
                         <p>Desde el ${proyecto.start_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})} hasta ${proyecto.due_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})}</p>
                         <ul id="${proyecto.name}_tasks">Tareas:</ul>`;

    document.body.appendChild(proy_div);

    tasks_ul = document.getElementById(`${proyecto.name}_tasks`);

    if (proyecto.tasks == []) {
        let li = document.createElement("li");
        li.innerHTML = `Ninguna tarea agregada
                        <input type="button" class="btnAddTask_created" value="Añadir tarea">`;
        tasks_ul.appendChild(li);
    }
    else {
        for (const task of proyecto.tasks){
            let li = document.createElement("li");
            li.innerHTML = `${task.task}`;
            tasks_ul.appendChild(li);
        }
    }
}

// DECLARACIÓN DE CLASES
class Task {
    constructor(task, status) {
        this.task = task;
        this.status = Boolean(status);
    }
}

class Proyect {
    constructor(name, description, start_date, due_date, tasks, status, progress){
        this.name = name;
        this.description = description;
        this.start_date = new Date(start_date.split('-')[0],start_date.split('-')[1]-1,start_date.split('-')[2]);
        this.due_date = new Date(due_date.split('-')[0],due_date.split('-')[1]-1,due_date.split('-')[2]); //new Date(due_date[0],due_date[1]-1,due_date[2]);
        this.tasks = tasks; // Type Array
        this.progress = progress_status(this.tasks);
        if (this.progress == 1) { this.status = true; }
        else { this.status = Boolean(status); }
    }
}

// EJECUCIÓN
let proyectos = [];

let miFormulario = document.getElementById('proyectForm');

miFormulario.addEventListener('submit', sendForm);
miFormulario.addEventListener('submit', resetForm);

on('click', '#btnAddTask', addtaskClick);