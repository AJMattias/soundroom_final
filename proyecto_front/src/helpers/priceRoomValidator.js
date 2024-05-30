export function priceRoomValidator(price) {
    const pattern = new RegExp('^[0-9]+$', 'i');
    if (!price) return "El campo es obligatorio."
    if(!pattern.test(price)) return 'Solo debes ingresar numeros enteros'
    // if( price instanceof Number) {return ''}
    // else{ return 'Solo debes ingresar numeros enteros'}
    return ''
  }

