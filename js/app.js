const formularioContactos = document.querySelector('#contacto'),
      listadoContactos= document.querySelector('#listado-contactos tbody');

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

            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // Crear el icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // Crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // Crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // Crear el boton de eliminar 
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el formulario 
            document.querySelector('form').reset();

            // Mostrar la notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
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