class Task {
    constructor(task, status) {
        this.task = task;
        this.status = false;
    }
}

class Proyect {
    constructor(name, description, start_date, due_date, tasks, status){
        this.name = name;
        this.description = description;
        this.start_date = new Date(start_date[0],start_date[1],start_date[2]);
        this.due_date = new Date(due_date[0],due_date[1],due_date[2]);
        this.tasks = tasks; // Type Array
        this.status = false;
    }
}

function create_proyect(name, description, start_date, due_date){
    proyecto = new Proyect(name, description, start_date, due_date);

    let tasks = arrayTasks();
    proyecto.tasks = tasks;

    return proyecto;
}

function create_task(task){
    task = new Task(task);

    return task;
}

function arrayTasks(){
    const tasks = [];
    let newTask;
    
    do {
        newTask = prompt("¿Desea ingresar una nueva tarea? Ingrese Y o N?");
        if (newTask != null && newTask == "N") {
            break;
        }
        else if (newTask != "Y"){
            alert("Por favor ingrese Y o N");
        }
        else {
            let task = prompt("Ingrese la tarea");

            tasks.push(newTask = create_task(task));
        }
    }
    while(true);

    return tasks;
}

function Add_proyects(){
    const proyects = [];
    let newProy;

    do {
        newproy = prompt("¿Desea ingresar un nuevo proyecto? Ingrese Y o N?");
        if (newproy != null && newproy == "N") {
            break;
        }
        else if (newproy != "Y"){
            alert("Por favor ingrese Y o N");
        }
        else {
            let name = prompt("Ingrese el nombre del Proyecto");
            let description = prompt("Ingrese una breve descripción del proyecto");
            let start_date = [
                parseInt(prompt("Ingrese el año de la fecha de inicio")),
                parseInt(prompt("Ingrese el mes de la fecha de inicio (número)"))-1,
                parseInt(prompt("Ingrese el día de la fecha de inicio")),
                ];
            let due_date = [
                parseInt(prompt("Ingrese el año de la fecha límite")),
                parseInt(prompt("Ingrese el mes de la fecha límite (número)"))-1,
                parseInt(prompt("Ingrese el día de la fecha límite")),
                ];

            proyects.push(newProy = create_proyect(name, description, start_date, due_date));
        }
    }

    while(true);

    return proyects;
}

function filtrar_completado(array,stat){
    let result = [];

    result = array.filter((elem) => elem.status == stat);

    return result
}

const proyectos = Add_proyects();
console.log(proyectos);

const proy_completos = filtrar_completado(proyectos,true);
console.log(proy_completos);

const proy_pendientes = filtrar_completado(proyectos,false);
console.log(proy_pendientes);