export function ccvValidator(ccv) {
    const pattern = new RegExp('^[0-9]+$', 'i');
    if (!ccv) return "El campo es obligatorio."
    if(!pattern.test(ccv)) return 'Solo debes ingresar numeros'
    const longitud = ccv.length;
    if (longitud < 3 || longitud > 3) {
        return "El número de la tarjeta debe tener 3 dígitos.";
    }
    return ''
  }

