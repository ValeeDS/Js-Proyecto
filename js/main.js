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
    proy_input.className = "inputTask inputTask--Js";

    proy_input.innerHTML = `<input type="checkbox" name="taskStatus" value=false>
                            <input type="text" name="taskName" placeholder= "Tarea">
                            <input id="btnAddTask" type="button" value="+">`;

    document.getElementById('form_div_tasks').appendChild(proy_input);

    //Crear nuevamente el submit
    proy_btnSubmit = document.createElement("input");
    proy_btnSubmit.id = "proyectSubmit";
    proy_btnSubmit.type = "submit";
    document.getElementById('proyectForm').appendChild(proy_btnSubmit);
}

function progress_status(array) {
    //Defino variables
    const tot_tasks = array.length;
    const array_filtered = array.filter((el) => el.status == true);
    const tot_completed = array_filtered.length;

    //Evalúo si existen tareas y realizo la operación
    tot_tasks == 0 ?  progress = '-' : progress = tot_completed/tot_tasks

    //Devuelvo resultado
    return progress;
}

function sendForm(e) {
    e.preventDefault();

    //Array de inputs
    const inputs = miFormulario.children;

    //Busco si ya existe el nombre del proyecto
    const search = proyectos.find((el) => el.name == inputs[0].value);

    const validName = (search && [false, "El nombre del proyecto ya existe"]) || (inputs[0].value && [true, "Proyecto ingresado"] || [false, "No ingresó nombre"]);

    if (validName[0]) {
        //Obtengo los divs que tienen el input de la tarea e inicializo el array de tareas
        const tasks_divs = document.getElementsByClassName('inputTask');
        const tasks = [];
        
        //Recorro los inputs de cada div
        for (task of tasks_divs){
            input_task = task.children;
            //Ignoro los campos vacíos
            if ((input_task[1].value == "") || (input_task[1].value == null)) { continue }
            //Creo el objeto Task y guardo las tareas en el array
            else { tasks.push(new Task(input_task[1].value,input_task[0].value)) }
        }
        
        //Creo el objeto y el JSON
        const Proy = new Proyect(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, tasks);
        const enJSON = JSON.stringify(Proy);

        //Agrego el proyecto al array de proyectos y al array del localStorage
        proyectos.push(Proy);
        proy_localStorage.push(enJSON);
        localStorage.setItem('proyectos', proy_localStorage);

        Show_sweetAlert('project_added', validName[1])

        //Muestro por frontend
        show_frontend(proyectos);
    }
    else { Show_sweetAlert('error_submiting_project', validName[1])}; //Alerta que ya existe el proyecto 
}

function resetForm() {
    //Obtengo el div del form de las tareas
    const div_tasks = document.getElementsByClassName('inputTask--Js');

    //Recorro el array creado para eliminar los elementos creados desde Js
    for (div of div_tasks) { div.remove() };
}

function show_frontend(array){
    //Obtengo el último elemento del array
    const proyecto = array[array.length - 1];

    //Creo el div del proyecto y lo agrego al body
    const proy_div = document.createElement("div");
    proy_div.id = (proyecto.name);
    proy_div.className = "proyect--Js";

    proy_div.innerHTML = `<h3 id="${proyecto.name}_title">Proyecto: ${proyecto.name}</h3>
                          <input id="${proyecto.name}_btnDelete" type="button" class="btnDelete" value="Borrar proyecto">
                          <p id="${proyecto.name}_description">${proyecto.description}</p>
                          <p id="${proyecto.name}_dates">Desde el ${proyecto.start_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})} hasta ${proyecto.due_date.toLocaleDateString([],{month: 'short', day: 'numeric', year: 'numeric'})}</p>
                          <ul id="${proyecto.name}_tasks">Tareas:</ul>`;

    document.getElementById("bodyArea").appendChild(proy_div);

    //Creo el listado de tareas
    tasks_ul = document.getElementById(`${proyecto.name}_tasks`);

    //Evalúo si el array de tareas está vacío
    if (proyecto.tasks == []) {
        const li = document.createElement("li");
        li.className = "liTask--Js"
        li.innerHTML = `Ninguna tarea agregada`;
        tasks_ul.appendChild(li);
    }
    else {
        //Recorro el array
        for (let i = 0; i < proyecto.tasks.length; i++) {
            let task = proyecto.tasks[i];
            let li = document.createElement("li");
            li.id = proyecto.name+'_task'+i;
            li.className = "liTask--Js"
            li.innerHTML = `<input type="checkbox" class="taskStatus" id="taskStatus_${proyecto.name}_task${i}" name="taskStatus_${proyecto.name}task'+${i}" value=${task.status}>
                            ${task.task}`;
            tasks_ul.appendChild(li);
        }
    }
}

function reload(text) {
    //Creo el array para reiniciar proyectos al recargar
    const newArray = [];
    const newArray_JSON = [];

    //Evalúo si el texto ingresado es válido
    if ((text != "") && (text != null)) {
        //Creo array para guardar los proyectos de la sesión anterior en JSON
        arr = text.split('},{"name"'); /* El "name" lo uso para diferenciar entre el objeto Task y el obj Proyecto*/

        //Diferencio los casos según la cantidad de proyectos
        switch (arr.length) {
            case 1:
                break;
            case 2:
                arr[0] += '}';
                arr[1] = '{"name"' + arr[1];
                break;
            default:
                //Recorro el array para darle el formato correcto de JSON a los proyectos
                for (let el = 0; el < arr.length; el++){
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
                }
        }

        //Transformo los proyectos desde JSON y los guardo como Objeto Proyecto
        for (el of arr){
            newArray_JSON.push(el);
            newEl = JSON.parse(el);
            newEl.start_date != null ? newEl.start_date = newEl.start_date.slice(0,10) : newEl.start_date = ""
            newEl.due_date != null ? newEl.due_date = newEl.due_date.slice(0,10) : newEl.due_date = ""
            if (newEl.tasks != []) {
                newTasks = []
                for (el of newEl.tasks){
                    el = newTasks.push(new Task(el.task,el.status));
                }
            }
            newArray.push(new Proyect(newEl.name,newEl.description,newEl.start_date,newEl.due_date,newTasks));
        }

        localStorage.setItem('proyectos',newArray_JSON);

        //Muestro los proyectos de la sesión anterior
        for (el of newArray) {
            el = [el];
            show_frontend(el);
        }     
    }

    console.log([newArray, newArray_JSON]);
    return [newArray, newArray_JSON];
}

function delete_proy(){
    //Obtengo el id del botón
    const name_id = this.id.slice(0,this.id.length-10);
    //Obtengo el proyecto
    const search = proyectos.find((el) => el.name == name_id);
    //Filtro los proyectos distintos al que quiero borrar
    const proy_new = proyectos.filter((el) => el != search);

    //Creo el nuevo array y recargo la página
    proy_localStorage_new = [];
    for (el of proy_new) {
        proy_localStorage_new.push(JSON.stringify(el))
    }
    localStorage.setItem('proyectos', proy_localStorage_new);
    location.reload();
}

function Show_sweetAlert(type_alert , text) {
    switch (type_alert){
        case 'error_submiting_project':
        Swal.fire({
            title: '¡Error!',
            text: text,
            icon: 'error',
            cancelButtonText: ' Ok ',
            showCancelButton: true,
            showConfirmButton: false,
        });
        break;
        case 'project_added':
        Swal.fire({
            toast: true,
            position: 'bottom-start',
            title: text,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
        break;
    }
}

// DECLARACIÓN DE CLASES
class Task {
    constructor(task, status) {
        this.task = task;
        this.status == true ? this.status = true : this.status = Boolean(status);
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
        this.progress == 1 ? this.status = true : this.status = Boolean(status);
    }
}

// EJECUCIÓN
const reload_arr = reload(localStorage.getItem('proyectos'));
const proyectos = reload_arr[0] || [];
const proy_localStorage = reload_arr[1] || [];

let miFormulario = document.getElementById('proyectForm');

miFormulario.addEventListener('submit', sendForm);
miFormulario.addEventListener('submit', resetForm);

on('click', '#btnAddTask', addtaskClick);
on('click', '.btnDelete', delete_proy);