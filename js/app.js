const formularioContactos = document.querySelector('#contacto'),
      listadoContactos= document.querySelector('#listado-contactos tbody');

eventListeners();

function eventListeners() {
    // Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }
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
        }else{
            // Editar el elemento
            // Leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);

            actualizarRegistro(infoContacto);
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

// Actualizar el Contacto
function actualizarRegistro(datos) {
    // Crear el objeto
    const xhr = new XMLHttpRequest();

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/editar-peticion.php', true);

    // Leer la respuesta
    xhr.onload = function() {
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);

            console.log(respuesta);

            if(respuesta.respuesta === 'correcto'){
                // Mostrar notificacion de correcto
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            }else{
                // Hubo un error
                mostrarNotificacion('Hubo un error...', 'error');
            }

            // Despues de 3 segundos redireccionar
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 3000);
        }
    }

    // Enviar la peticion
    xhr.send(datos);
}

// Eliminar el Contacto
function eliminarContacto(e) {
    if(e.target.parentElement.classList.contains('btn-borrar')) {
        // Tomar el ID 
        const id = e.target.parentElement.getAttribute('data-id');

        // Preguntar al usuario 
        const respuesta = confirm('¿Estás Seguro (a) ?');

        if(respuesta){
            // Llamado a Ajax
            // Crear el objeto
            const xhr = new XMLHttpRequest();

            // Abrir la conexión
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            // Leer la respuesta
            xhr.onload = function() {
                if(this.status === 200){
                    const resultado = JSON.parse(xhr.responseText);

                    console.log(resultado.respuesta);

                    if(resultado.respuesta === 'correcto'){
                        // Eliminar el registro del DOM
                        e.target.parentElement.parentElement.parentElement.remove();

                        // Mostrar notificacion
                        mostrarNotificacion('Contacto Eliminado', 'correcto');
                    }else{
                        // Mostramos una notificacion
                        mostrarNotificacion('Hubo un error....', 'error');
                    }
                }
            }
            // Enviar la petición
            xhr.send();
        }
    }
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