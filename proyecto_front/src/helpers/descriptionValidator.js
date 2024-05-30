export function descriptionValidator(description) {
   // const pattern = new RegExp('^[ a-zA-Z ]', 'i');
   const pattern = /^[a-zA-Z0-9?$@()!,.\s]+$/ 
   if (!description) return "El campo es obligatorio."
    if (description.length <= 5) return "El campo Descrippcion es requerido de 5/100 caracteres."
    if (description.length > 100) return "El campo Descrippcion des requerido de 5/100 caracteres."
    //if(!pattern.test(description)) return "El campo Descrippcion solo debe tener letras, numeros y espacio y simbolos basicos"
    return ''
  }


