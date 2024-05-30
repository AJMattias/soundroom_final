export const isAdmin = (user) => {
    return user.isAdmin || user.email.toLowerCase().startsWith('admin')
}