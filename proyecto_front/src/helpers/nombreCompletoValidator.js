export function nombreCompletoValidator(name) {
    const pattern = new RegExp('^[a-zA-Z]+(?: [a-zA-Z]+)*$');
    if (name.length <= 3) return "El campo Nombre debe contener el nombre y apellido completo."
    if(!pattern.test(name)) return "El campo Nombre solo debe tener letras y espacios"
    return '';
  }
  