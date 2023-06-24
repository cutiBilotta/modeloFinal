
import { crearTarjeta } from "./tarjeta.js";
const URL= "http://localhost:3000/anuncios";

const $divAnuncios = document.getElementById("divAnuncios");
const data = await getAnuncios();
actualizarAnuncios(data); 


function actualizarAnuncios(data){
    while($divAnuncios.hasChildNodes()){
        $divAnuncios.removeChild($divAnuncios.firstElementChild);
    }

    if(data != null){
        $divAnuncios.appendChild(crearTarjeta(data));          
    }
}

async function getAnuncios(){

    try{
        let {data} = await axios.get(URL);
        return data;
    }catch(err)
    {
        console.log(err.message);
    }  
    
};