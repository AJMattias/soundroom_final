export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "El campo email no puede estar vacío."
  if (!re.test(email)) return "Ingrese un email de formato de tipo email"
  //if(email =="mattias.alejandro@gmail.com") return "El email ya se encuentra registrado, por favor ingrese otro."
  return ''
}
