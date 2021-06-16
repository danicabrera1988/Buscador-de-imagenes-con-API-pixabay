// VARIABLES //
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registroPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;


// EVENTOS //
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}


// FUNCIONES //
function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if( terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const alerta = document.querySelector('.alerta');

    if(!alerta){
        const alertaDiv = document.createElement('p');
        alertaDiv.classList.add('alerta', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta');
        alertaDiv.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
        formulario.appendChild(alertaDiv);

        setTimeout(() => {
            alertaDiv.remove();
        }, 3000);    
    }

}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;

    const key = '22082866-7f8a922e45ad66cae31c4a08d';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    fetch(url)  
        .then( respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits)
            mostrarImagenes(resultado.hits)
        })
}

function *crearPaginador(total){ // GENERADOR (*): Regista la cantidad de elementos de acuerdo a la cantidad de paginas
    for(let i = 1; i <= total; i++){
        yield i; 
        //console.log(i);
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil( total/registroPorPagina )) // Math.ceil: Redondea para arriba
}

function mostrarImagenes(imagenes){

    // Limpiar HTML
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

    // Recorrer el arreglo 'imagenes' y crear el HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
            <div class="bg-white ">
                <img class="w-full" src=${previewURL} alt={tags} />
                <div class="p-4">
                    <p class="card-text font-bold">${likes} <span class="font-light"> Me Gusta </span></p>
                    <p class="card-text font-bold">${views} <span class="font-light"> Vistas </span> </p>
    
                    <a href=${largeImageURL} 
                    rel="noopener noreferrer" 
                    target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                </div>
            </div>
        </div>
        `;
    });

    // Limpiar HTML paginacion
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas)
    //console.log(iterador.next());

    while (true) {
        const {value, done} = iterador.next(); // VALUE: Valor del iterador / DONE: Indica si recorrio todo el iterdor(true)

        if(done) return;

        // Caso contrario, generar un boton por cada enlace
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = value;
        botonSiguiente.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mb-4', 'font-bold', 'rounded');
        paginacionDiv.appendChild(botonSiguiente);

        botonSiguiente.onclick = () => {
            paginaActual = value;
            
            buscarImagenes()
        }

    }
}

