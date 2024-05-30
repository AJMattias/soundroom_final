//Este patrón es horrible . Por ahora lo dejamos pero nos conviene mover todo a módulos.
// Tener una carpeta "user/validators" , otra "sala_de_ensayo/validators" , etc.
export function lastNameValidator(lastName) {
   // return lastName ? "" : "El campo Apellido es obligatorio"
   const pattern = new RegExp('^[A-Z]+$', 'i');
    if (!lastName) return "El campo Apellido no puede estar vacío."
    if (lastName.length < 3) return "El campo Apellido debe contener al menos 3 caracteres."
    if(!pattern.test(lastName)) return "El campo Apellido solo debe tener letras"
    return ''
}