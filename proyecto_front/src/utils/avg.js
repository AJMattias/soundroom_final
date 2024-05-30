export const avg = (times) => {
    const sum = times.reduce((a, b) => a + b, 0);
   return (sum / times.length) || 0;

}

export const hasDecimals = (number) => {
    return  (number - Math.floor(number)) !== 0
}