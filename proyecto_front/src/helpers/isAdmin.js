export const isAdmin = (user) => {
      // Verifica que user y user.email existan
  if (!user || !user.isAdmin) {
    return false;
  }
  
  // Verifica si el usuario es admin por la propiedad isAdmin o si el email empieza con 'admin'
  return user.isAdmin || user.email.toLowerCase().startsWith('admin');
}