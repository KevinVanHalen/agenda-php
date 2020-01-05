const formularioContactos = document.querySelector('#contacto');

eventListeners();

function eventListeners() {
    // Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
}

function leerFormulario(e) {
    e.preventDefault();
    
    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;


    if(nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros: texto y clase
        mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
    }else {
        // Pasa la validación, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if(accion === 'crear') {
            // Crearemos un nuevo elemento
            insertarBD(infoContacto);
        }else {
            // Editar el elemento
        }
    }
}

// Inserta en la base de datos via Ajax
function insertarBD(datos) {
    // Llamado a ajax

    // Crear el objeto
    const xhr = new XMLHttpRequest();
    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
    // Pasar los datos
    xhr.onload = function() {
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));
            // Leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta.empresa);
        }
    }
    // Enviar los datos
    xhr.send(datos);
}

// Notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}