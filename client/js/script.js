
import { Superheroe } from "./Superheroe.js";
import { crearTabla } from "./tabla.js";
import { validarCadenaCantCaracteres} from "./validaciones.js";
const URL= "http://localhost:3000/anuncios";

const $divTabla = document.getElementById("divTabla");
const $btnPrecio = document.getElementById("btnPrecio");
const $btnAlfabet = document.getElementById("btnAlfabet");
const $btnDelete = document.getElementById("btnDelete");
const $btnEnviar= document.getElementById("btnEnviar");
const $txtId= document.getElementById("txtId");
const $tituloAlta= document.getElementById("tituloAlta");
const $spinner= document.getElementById("spinner");
const $btnFiltrar= document.getElementById("btnFiltrar");
const $btnCancelar = document.getElementById("btnCancelar");
const $chkFuerza= document.getElementById("chkFuerza");
const $chkEditorial= document.getElementById("chkEditorial");
const $chkArma= document.getElementById("chkArma");

const $btnMostrar= document.getElementById("btnMostrar");

const $formulario= document.forms[0];
const $selectEditorial = document.getElementById("selectEditorial")
//$divTabla.style.visibility='hidden';

const $armas = ["Armadura", "Espada" , "Martillo" , "Escudo" , "Arma de Fuego", "Flechas"]
localStorage.setItem("armas", JSON.stringify(["Armadura", "Espada", "Martillo", "Escudo", "Arma de Fuego", "Flechas"]));
let $anuncios = getAnuncios();
//console.log($anuncios);

let $elementoSeleccionado;
cargarArmas();
$btnDelete.style.visibility='hidden';
$btnCancelar.style.visibility='hidden';

const icono = "<i class='fa-solid fa-floppy-disk fa-xl'></i> Enviar";


/*if($anuncios.length>0){
    
    setTimeout(()=>{
        actualizarTabla($anuncios);
        $spinner.style.visibility= 'hidden';

    }, 2000);

   
}else
{
    setTimeout(() => {
        $spinner.style.visibility= 'hidden';
        //$divTabla.insertAdjacentHTML("afterbegin", `<p>Aun no hay anuncios de Superheroes para mostrar</p>`);
    }, 2000);
}*/


window.addEventListener("click" , (e)=>{

    
    if(e.target.matches("td")){

        let fila = e.target.parentNode; // Obtener la fila que contiene la celda
        let index= fila.rowIndex;
        console.log(index);
      
        $btnEnviar.innerHTML = "Modificar";       
        $elementoSeleccionado= $anuncios[index-1];

        cargarFormulario($elementoSeleccionado);
        $btnDelete.style.visibility='visible';
        $btnCancelar.style.visibility='visible';

        $tituloAlta.textContent= "Eliminar/Modificar un Superheroe"
    }else if(e.target.matches("#btnDelete")){
        deleteElemento($elementoSeleccionado.id);
        $formulario.reset();
    }
    

});

function cargarArmas(){

    const $selectArmas = document.getElementById("selectArmas");
    const $armas = JSON.parse(localStorage.getItem("armas")) || [];
    const $fragment = document.createDocumentFragment();

    $armas.forEach((elemento) =>{

        const $opcion = document.createElement("option");
        $opcion.value = elemento;
        $opcion.innerHTML=elemento;

        $fragment.appendChild($opcion);
    })

    $selectArmas.appendChild($fragment);

}

function actualizarTabla(data){

    while($divTabla.hasChildNodes()){
        $divTabla.removeChild($divTabla.firstElementChild);
    }

    if(data != null){
          $divTabla.appendChild(crearTabla(data));
    }
}

$formulario.addEventListener("submit", (e) =>{
    e.preventDefault();
    
    const {txtId, txtNombre, txtAlias, rngFuerza, rdoEditorial, selectArmas}  = $formulario; //esto es destructuring
          
    const formAnuncio= new Superheroe(txtId.value, txtNombre.value, rngFuerza.valueAsNumber, txtAlias.value,  rdoEditorial.value, selectArmas.value);

    if(validarCadenaCantCaracteres(formAnuncio.nombre)){
        if(validarCadenaCantCaracteres(formAnuncio.alias)){
            console.log("Enviando...");
            if(formAnuncio.id== ''){
                createElemento(formAnuncio);
            }else{
                updateElemento(formAnuncio);
            }

            $formulario.reset();
            
        }else{
            alert("Alias invalido");
        }
    }else{
        alert("Nombre invalido");
    }

});

function cargarFormulario(a){
    let index=0;

    const {txtId, txtNombre, txtAlias, rngFuerza, rdoEditorial, selectArmas}  = $formulario; //esto es destructuring
    
    txtNombre.value=a.nombre;
    txtAlias.value=a.alias;
    rngFuerza.value=a.fuerza;
    rdoEditorial.value=a.editorial;
    selectArmas.value= a.arma;
    txtId.value=a.id;
}


$btnPrecio.addEventListener('click', () =>{

    const $tablaOrdenada= $anuncios.sort((a,b) => {
        return a.fuerza-b.fuerza;
    });

    actualizarTabla($tablaOrdenada);
});

$btnAlfabet.addEventListener('click', () =>{

    const $tablaOrdenada= $anuncios.sort((a,b) => {
        return(b.nombre>a.nombre) ? -1 :1;
    });

    actualizarTabla($tablaOrdenada);
});

$btnCancelar.addEventListener('click', () =>{

    $formulario.reset();
    $txtId.value='';
    $btnCancelar.style.visibility= 'hidden';
    $btnDelete.style.visibility= 'hidden';
    $btnEnviar.innerHTML=  "<i class='fa-solid fa-floppy-disk fa-xl'></i> Enviar";
    $tituloAlta.textContent= "Crud Heroes - Alta Superheroe"


});

$btnFiltrar.addEventListener('click', () =>{
    
    let opcion;
    let $tablaFiltrada;
    let $tablaFinal;
    
    if($selectEditorial.value == "DC"){
        $tablaFiltrada= $anuncios.filter( a => a.editorial=="DC"? true: false)
        console.log("ACA DC");
        console.log($tablaFiltrada);

    }else if($selectEditorial.value == "MARVEL"){
        $tablaFiltrada= $anuncios.filter( a => a.editorial=="Marvel"? true: false)

    }else if($selectEditorial.value == "TODOS"){
        $tablaFiltrada= $anuncios;

    }


    if($chkEditorial.checked && !$chkFuerza.checked && !$chkArma.checked){
        opcion = 1;
    }else if($chkEditorial.checked && $chkFuerza.checked && !$chkArma.checked){
        opcion=2;
    }else if($chkEditorial.checked && $chkFuerza.checked && $chkArma.checked){
        opcion = 3;
    }else if(!$chkEditorial.checked && !$chkFuerza.checked && !$chkArma.checked){
        opcion = 4;
    }else if(!$chkEditorial.checked && $chkFuerza.checked && !$chkArma.checked){
        opcion = 5;
    }else if(!$chkEditorial.checked && !$chkFuerza.checked && $chkArma.checked){
        opcion = 6;
    }else if($chkEditorial.checked && !$chkFuerza.checked && $chkArma.checked){
        opcion = 7;
    }
    else if(!$chkEditorial.checked && $chkFuerza.checked && $chkArma.checked){
        opcion = 8;
    }


    switch(opcion){
        case 1:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,editorial:a.editorial}));
            break;
        case 2:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,editorial:a.editorial, fuerza:a.fuerza}));
            break;
        case 3:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,editorial:a.editorial, fuerza:a.fuerza, arma:a.arma}));
            break;
        case 4:
            $tablaFinal= $tablaFiltrada.map( a => ({ alias:a.alias,nombre:a.nombre, alias:a.alias}));
            break;
        case 5:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,fuerza:a.fuerza}));
            break;
        case 6:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,arma:a.arma}));
            break;
        case 7:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,editorial:a.editorial, arma:a.arma}));
            break;
        case 8:
            $tablaFinal= $tablaFiltrada.map( a => ({alias:a.alias,fuerza:a.fuerza, arma:a.arma}));
            break;

    }
     

   
        const $pPromedio = document.getElementById("pPromedio")
        let total= $tablaFiltrada.reduce((anterior, actual) =>anterior + actual.fuerza,0);
            let promedio = total/ $tablaFiltrada.length;
    
            $pPromedio.classList.add("text-info", "bg-success")
            $pPromedio.innerHTML= 'Promedio total de fuerzas: ' + promedio.toFixed(2);
    
        
     
     


    $chkArma.checked=false;
    $chkFuerza.checked=false;
    $chkEditorial.checked=false;
    actualizarTabla($tablaFinal);  
});


document.querySelectorAll('.e-botones').forEach(button => {
    button.addEventListener('click', ()=>{
        $spinner.style.visibility='visible';
        $divTabla.style.visibility='hidden';

        if($anuncios.length>0){
    
            setTimeout(()=>{
                $divTabla.style.visibility='visible';
                $spinner.style.visibility= 'hidden';
        
            }, 2000);
        
           
        }else
        {
            setTimeout(() => {
                $divTabla.style.visibility='visible';

                $spinner.style.visibility= 'hidden';
                //$divTabla.insertAdjacentHTML("afterbegin", `<p>Aun no hay anuncios de Superheroes para mostrar</p>`);
            }, 2000);
        }
    });
});


function getAnuncios(){
    $spinner.style.visibility='visible';

    fetch(URL)
    .then((res)=> res.ok?res.json():Promise.reject(res))
    .then((data)=>{
        $anuncios=data;
        actualizarTabla($anuncios);
        $spinner.style.visibility='hidden';


    })
    .catch((err)=>{

        console.error(`Error: ${err.status} - ${err.statusText}`)
    })

};


function createElemento(data){
    $spinner.style.visibility='visible';

    fetch(URL,{
            method:"Post",
            headers:{"Content-Type" : "application/json;charset=utf-8"},
            body: JSON.stringify(data),
        })
    .then((res)=> res.ok?res.json():Promise.reject(res))
    .then((data)=>{
        console.log(data);
        actualizarTabla(data);
        $spinner.style.visibility='hidden';

    })
    .catch((err)=>{
        console.error(`Error: ${err.status} - ${err.statusText}`)
    })
};
    
function deleteElemento(id){
    
    fetch(URL+"/"+ id,{
        method: "DELETE"
    })
    .then((res)=>{
        if(!res.ok) return Promise.reject(res);
        actualizarTabla(data);
    })
    .catch((err)=>{

        console.error(`Error: ${err.status} - ${err.statusText}`)
    })
};

function updateElemento(data){
    $spinner.style.visibility='visible';

    fetch(URL + "/" + data.id,{
            method:"Put",
            headers:{"Content-Type" : "application/json;charset=utf-8"},
            body: JSON.stringify(data),
        })
    .then((res)=> res.ok?res.json():Promise.reject(res))
    .then((data)=>{
        console.log(data);
        actualizarTabla(data);
        $spinner.style.visibility='hidden';

    })
    .catch((err)=>{

        console.error(`Error: ${err.status} - ${err.statusText}`)
    })  
};