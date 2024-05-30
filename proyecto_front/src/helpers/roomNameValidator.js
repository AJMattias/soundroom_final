export function roomNameValidator(name) {
    //const pattern = new RegExp('^[A-Z]+$|[^ ]', 'i')
    const pattern = new RegExp('^[ a-zA-Z 0-9]+$', 'i');
    //^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$
    if (!name) return "El campo es obligatorio."
    if (name.length <= 5) return "El campo Nombre debe contener al menos 5 caracteres."
    if(!pattern.test(name)) return "El campo Nombre solo debe tener letras, numeros y espacio"
    return ''
  }


