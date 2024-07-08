export function fechaVencimientoValidator(fecha) {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    
  // Verificar el formato
  if (!regex.test(fecha)) {
      return "Formato inválido. Use MM/AA.";
  }

  const [mes, año] = fecha.split('/').map(Number);
  const fechaActual = new Date();
  const añoActual = fechaActual.getFullYear() % 100; // Últimos dos dígitos del año actual
  const mesActual = fechaActual.getMonth() + 1; // Mes actual (0-indexado)

  // Verificar si el mes es válido (esto ya lo hace la regex, pero podemos agregar una verificación extra)
  if (mes < 1 || mes > 12) {
      return "Mes inválido. Use un valor entre 01 y 12.";
  }

  // Verificar si la fecha no está en el pasado
  if ((año < añoActual) || (año === añoActual && mes < mesActual)) {
      return "La fecha de vencimiento no puede estar en el pasado.";
  }

  return '';
}
  