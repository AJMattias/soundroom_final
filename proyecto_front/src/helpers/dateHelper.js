import { parseISO, isValid } from 'date-fns';

// Verificar si una cadena es una fecha ISO válida
export const isIsoDateString = (value) => {
  const date = parseISO(value);
  return isValid(date);
};

// Convertir fechas ISO a objetos Date en un objeto o array
export const convertIsoDates = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string' && isIsoDateString(obj)) {
    return parseISO(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(convertIsoDates);
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = convertIsoDates(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};

// export const  formatFecha = (fecha)  =>{
//   const date = new Date(fecha);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

export function formatFecha(fecha) {
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const fechaResult =  `${year}-${month}-${day}`
  return fechaResult;
}

 