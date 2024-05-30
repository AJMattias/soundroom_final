export function nameValidator(name) {
  // const pattern = new RegExp('^[A-Z]+$', 'i');
  const pattern = new RegExp('^[a-zA-Z()!,.\s]');
  if (!name) return "El campo Nombre es obligatorio."
  if (name.length <= 3) return "El campo Nombre debe contener al menos 3 caracteres."
  if(!pattern.test(name)) return "El campo Nombre solo debe tener letras y espacios"
  return ''
}
