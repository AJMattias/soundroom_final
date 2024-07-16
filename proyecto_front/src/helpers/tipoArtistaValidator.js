export function tipoArtistaValidator(name) {
    //const pattern = new RegExp('^[A-Z]+$', 'i');
    const pattern = new RegExp('^[A-Za-z\\s\\-]+$');
    if (!name) return "El campo Tipo de Artista es obligatorio."
    if (name.length < 3) return "El campo tipo de artista debe contener al menos 3 caracteres."
    if(!pattern.test(name)) return "El campo tipo de artista solo debe tener letras, espacios, y guion medio"
    return ''
  }
  