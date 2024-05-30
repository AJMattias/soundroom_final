export function tipoSalaValidator(tipoSala) {
    const pattern = new RegExp('^[A-Z]+$', 'i');
    if (!tipoSala) return "El campo Tipo de Sala de Ensayo es obligatorio."
    //if (tipoSala.length <= 3) return "El campo tipo de Sala de Ensayo debe contener al menos 3 caracteres."
    //if(!pattern.test(tipoSala)) return "El campo Tipo de Sala de Ensayo solo debe tener letras y espacios"
    return ''
  }
  