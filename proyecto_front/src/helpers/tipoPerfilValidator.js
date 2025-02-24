export function tipoPerfilValidator(tipoPerfil) {
    const pattern = new RegExp('^[A-Z]+$', 'i');
    if (!tipoPerfil) return "El campo Tipo de Perfil es obligatorio."
    
    return ''
  }
  