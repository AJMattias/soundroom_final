export function cardNumberValidator(numero){
   
    const pattern = new RegExp('^[0-9]+$', 'i');
    if (!numero) return "El campo es obligatorio."
    if(!pattern.test(numero)) return 'El número de la tarjeta debe contener solo dígitos'

    // Verificar longitud
    const longitud = numero.length;
    if (longitud < 13 || longitud > 19) {
        return "El número de la tarjeta debe tener entre 13 y 19 dígitos.";
    }


    return''
}