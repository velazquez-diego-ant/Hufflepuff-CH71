/**
 *? Creando el sistema backend para pedir datos de formulario, mandarlos al localstorage y pedirlos.
 */
/**
 *! Declaración y asignacion de arrays
 */
const formEl = document.getElementById("alumnos-form");
const mainEl = document.querySelector("#alumnos-container");
let cards = []; //array para almacenar los datos de los álbumes que se vayan registrando, para poder enviarlos al backend en un futuro.

/**
 * ! AddEventListener
 */
window.addEventListener("load", (event) => {
    const storedCards = getLocalStorage("cards"); //obtenemos el array cards del localStorage para poder mostrarlo en la interfaz del usuario.
    if (storedCards === undefined) {
        console.log("No hay alumnos almacenados en el localStorage"); //vemos un mensaje en la consola cuando no hay álbumes almacenados en el localStorage.
    }
    storedCards.map((cards) => addAlbumCard(cards, mainEl)); //iteramos sobre el array albums y agregamos cada card de álbum al contenedor de álbumes sin borrar su contenido existente. Dentro del parentsis podemos agregar la posicion donde queremos insertar el contenido HTML. En este caso, lo estamos insertando al final del contenedor de álbumes.
    cards.push(...storedCards); //agregamos los álbumes almacenados en el localStorage al array albums para poder enviarlos al backend en un futuro.
    cards.map((cards) => addAlbumCard(cards, mainEl)); //ponemos esta linea para que si no hay albums en el localStorage, se muestre un mensaje de que no hay albums registrados.
});


/**
 * ! Elemento de formulario . AddEventListener
 */
formEl.addEventListener("submit", (event) => {
    event.preventDefault(); //preventimos que el formulario se envie y recargue la pagina.
    const formData = new FormData(formEl); //creamos un objeto FormData con los datos del formulario.
    const dataArray = [...formData]; //convertimos el objeto FormData en un array de arrays.
    const cardData = Object.fromEntries(dataArray); //convertimos el array de arrays en un objeto.
    cards.push(cardData); //agregamos el objeto albumData al array albums para almacenar los datos de los álbumes que se vayan registrando, para poder enviarlos al backend en un futuro.
    setLocalStorage("cards", cards); //guardamos el array albums en el localStorage para poder recuperarlo después.
    mainEl.innerHTML = ""; //limpiamos el contenedor de álbumes para que no se dupliquen las cards de álbumes al enviar el formulario varias veces.
    cards.map((cards) => addAlbumCard(cards, mainEl)); //iteramos sobre el array albums y agregamos cada card de álbum al contenedor de álbumes sin borrar su contenido existente. Dentro del parentsis podemos agregar la posicion donde queremos insertar el contenido HTML. En este caso, lo estamos insertando al final del contenedor de álbumes.
    formEl.reset(); //reseteamos el formulario para que quede vacío después de enviar los datos.  
});

/**
 * ! Local storage Set y Get
 */
const setLocalStorage = (key, value) => {
    //paso 1, convertimos el valor a texto JSON para poder guardarlo en el localStorage, ya que el localStorage solo puede almacenar strings.
    const textValue = JSON.stringify(value); //convertimos el valor a texto JSON para poder guardarlo en el localStorage, ya que el localStorage solo puede almacenar strings.
    //paso 2, guardamos el valor en el localStorage con la clave especificada.
    localStorage.setItem(key, textValue);
};


/**
 * ! Constructor de cards html . element y variables js.
 */
const addAlbumCard = (albumDataObject, htmlElement) => {
    const albumCard = `
    <div class="card border shadow-sm mb-3">
        <div class="row g-0">
            <!-- Icono o emblema mágico en lugar de "Portada" -->
            <div class="col-4 bg-primary text-white d-flex flex-column align-items-center justify-content-center rounded-start p-2 text-center">
                <span class="fs-1">🪄</span>
                <small class="fw-bold">${albumDataObject.casa || 'Hogwarts'}</small>
            </div>
            
            <div class="col-8">
                <div class="card-body">
                    <!-- Nombre del aspirante -->
                    <h5 class="card-title mb-1 text-dark fw-bold">Aspirante: ${albumDataObject.name}</h5>
                    
                    <!-- Casa y Año -->
                    <p class="card-text text-muted mb-1 small">
                        Casa: <strong>${albumDataObject.casa}</strong> • Año: ${albumDataObject.year}°
                    </p>
                    
                    <!-- Intereses (Badge) -->
                    <span class="badge bg-info text-dark mb-2">Intereses: </span>
                    
                    <!-- Vuelo y Equipo -->
                    <p class="card-text mb-0 small">
                        <span class="text-success fw-bold">Vuelo: ${albumDataObject.vuelo}/10 🧹</span> | 
                        Equipo: <span class="${albumDataObject.equipo ? 'text-success fw-bold' : 'text-danger'}">
                            ${albumDataObject.equipo ? 'Completo Sí' : 'Incompleto No'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;

    htmlElement.insertAdjacentHTML("beforeend", albumCard);
};


