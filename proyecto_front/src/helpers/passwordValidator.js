export function passwordValidator(password) {
  //const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
  const re = /^[A-Za-z0-9]+$/g
  if (!password) return "El campo contraseña es obligatorio."
  if (password.length < 5) return 'La contraseña debe poseer como mínimo 5 caracteres.'
  if(!re.test(password)) return 'Debe contener solo letras y números.'
  return ''
}
