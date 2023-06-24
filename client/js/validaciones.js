

   
    export function validarCadenaCantCaracteres(cadena){
        const regex = /^[a-zA-Z\s]+$/;

        if(cadena.length > 20 || !regex.test(cadena)){
            return false;
        }else{
            return true;
        }
        
    }

    export function validarPrecio(precio){
        if(precio<0 || precio > 50000){
            return false;
        }else{
            return true;
        }
    }



