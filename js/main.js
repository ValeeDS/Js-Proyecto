const listaCategorias = ['PANIFICADOS', 'LACTEOS', 'POSTRES'];

//DECLARACION DE CLASE PRODUCTO
class Producto {
        constructor(id, nombre, precio,categoria) {
                this.id = parseInt(id);
                this.nombre = nombre;
                this.precio = parseFloat(precio);
                //Agrego la propiedad categorias
                this.categoria = categoria;
        }
}

//DECLARAMOS UN ARRAY VACIO
const productos = [];
//CON PUSH, AGREGAMOS OBJETOS INSTANCIADOS AL ARRAY
productos.push(new Producto(1, "PAN", 50,categorias[0]));
productos.push(new Producto(2, "PASTAFROLA", 150,categorias[0]));
productos.push(new Producto(3, "LECHE", 200,categorias[1]));
productos.push(new Producto(4, "FLAN", 170,categorias[2]));
console.log(productos);
