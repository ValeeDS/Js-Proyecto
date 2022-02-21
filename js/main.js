// DECLARACIÓN DE FUNCIONES

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

function addtaskClick() {
    //Eliminar botones
    let proy_btnSubmit = document.getElementById('proyectSubmit');
    proy_btnSubmit.remove();
    const task_btnAdd = document.getElementById('btnAddTask');
    task_btnAdd.remove();

    //Crear el div
    const proy_input = document.createElement("div");
    proy_input.className = "inputTask";

    proy_input.innerHTML = `<input type="checkbox" name="taskStatus" value=false>
                            <input type="text" name="taskName" placeholder= "Tarea">
                            <input type="button" id="btnAddTask" value="+">`;

    document.getElementById('form_div_tasks').appendChild(proy_input);

    //Crear nuevamente el submit
    let proy_Submit = document.createElement("input");
    proy_Submit.type = "submit";
    proy_Submit.id = "proyectSubmit";
    document.getElementById('proyectForm').appendChild(proy_Submit);
}

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

    //Array de inputs
    const inputs = miFormulario.children;


    let search = proyectos.find((el) => el.name == inputs[0].value);
    if ((search == undefined) || (inputs[0].value != null) && (inputs[0].value != "")) {
        const tasks_divs = document.getElementsByClassName('inputTask');
        const tasks = [];
    
        for (task of tasks_divs){
            input_task = task.children;
            if ((input_task[1].value == "") || (input_task[1].value == null)) {
                continue;
            }
            else {
                console.log(input_task[0].value);
                tasks.push(new Task(input_task[1].value,input_task[0].value));
            }
        }
        
        const Proy = new Proyect(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, tasks);
        const enJSON = JSON.stringify(Proy);

        proyectos.push(Proy);
        proy_localStorage.push(enJSON);

        localStorage.setItem('proyectos', proy_localStorage);

        show_frontend(proyectos);
    }
    else {
        console.log("No ingresó un nombre para el proyecto o ya existe");
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

function show_frontend(array){
    const proyecto = array[array.length - 1]

    let proy_div = document.createElement("div");
    proy_div.id = (proyecto.name);
    proy_div.className = "proyect";

    proy_div.innerHTML = `<h3 id="${proyecto.name}_title">Proyecto: ${proyecto.name}</h3>
                          <input type="button" class="btnDelete" id="btnDelete_${proyecto.name}" value="Borrar proyecto">
                          <p id="${proyecto.name}_description">${proyecto.description}</p>
                          <p id="${proyecto.name}_dates">Desde el ${proyecto.start_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})} hasta ${proyecto.due_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})}</p>
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
        for (i = 0; i < proyecto.tasks.length; i++) {
            task = proyecto.tasks[i];
            let li = document.createElement("li");
            li.id = proyecto.name+'_task'+i;
            li.innerHTML = `<input type="checkbox" class="taskStatus" id="taskStatus_${proyecto.name}_task${i}" name="taskStatus_${proyecto.name}task'+${i}" value=${task.status}>
                            ${task.task}`;
            tasks_ul.appendChild(li);
        }
    }
}

function reload(text) {
    newArray = [];

    if ((text != "") && (text != null)) {
        arr = text.split('},{"name"');

        for (let el = 0; el < arr.length; el++){
            switch (arr.length) {
                default:
                    switch (el) {
                        case 0:
                            arr[el] = arr[el]+'}';
                            break;
                        case arr.length-1:
                            arr[el] = '{"name"'+arr[el];
                            break;
                        default:
                            arr[el] = '{"name"'+arr[el]+'}';
                            break; 
                    }
                case 1:
                    continue;
                case 2:
                    switch (el) {
                        case 0:
                            arr[el] = arr[el]+'}';
                            break;
                        case 1:
                            arr[el] = '{"name"'+arr[el];
                            break;
                    }
            }
        }

        for (el of arr){
            newEl = JSON.parse(el);
            if (newEl.start_date != null) {newEl.start_date = newEl.start_date.slice(0,10)} else {newEl.start_date = ""};
            if (newEl.due_date != null) {newEl.due_date = newEl.due_date.slice(0,10)} else {newEl.due_date = ""};
            if (newEl.tasks != []) {
                newTask = []
                for (el of newEl.tasks){
                    el = newTask.push(new Task(el.task,el.status));
                }
            }
            newArray.push(new Proyect(newEl.name,newEl.description,newEl.start_date,newEl.due_date,newTask));
        }

        for (el of newArray) {
            el = [el];
            show_frontend(el);
        }     
    }
    
    return newArray;
}

function delete_proy(){
    const name_id = this.id.slice(10,this.id.length);
    console.log(proyectos);
    let search = proyectos.find((el) => el.name == name_id);
    proy_new = proyectos.filter((el) => el != search);
    proy_localStorage_new = [];
    for (el of proy_new) {
        proy_localStorage_new.push(JSON.stringify(el))
    }
    localStorage.setItem('proyectos', proy_localStorage_new);
    location.reload();
}


// DECLARACIÓN DE CLASES
class Task {
    constructor(task, status) {
        this.task = task;
        if (this.status == true) { this.status = true; }
        else { this.status = Boolean(status); }
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
const proyectos = reload(localStorage.getItem('proyectos'));
const proy_localStorage = [];
for (proy of proyectos){
    proy_localStorage.push(JSON.stringify(proy));
}

let miFormulario = document.getElementById('proyectForm');

miFormulario.addEventListener('submit', sendForm);
miFormulario.addEventListener('submit', resetForm);

on('click', '#btnAddTask', addtaskClick);
on('click', '.btnDelete', delete_proy);