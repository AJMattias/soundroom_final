import {api} from './ApiClient'


class perfilService{
    
    async createPerfil(namePerfil){
        let perfil = undefined
        perfil = await api.post("perfiles", {
            name: namePerfil
        })
        return  perfil
        // await api.post("perfiles", {
        //     name: namePerfil
        // })
        
    }

    async createPermiso(namePermiso, idPerfil){
        let permiso = undefined
            permiso = await api.post("permisos", {
                name: namePermiso,
                idPerfil: idPerfil
            })
        return permiso
        //   await api.post("permiso", {
        //     name: namePermiso,
        //     idPerfil: idPerfil
        // })
    }

    async createPermisoSolo(
        namePermiso
    ){
        return await api.post("permisos", {
            name: namePermiso
        })
    }
    
    async getPermisos(){
        return await api.get("/permisos/")
    }

    async getPermiso(permisoId){
        let permiso = undefined 
        try {
            permiso = await api.get("/permiso/findPermisoById/?id="+permisoId)
        } catch (ignored) {
            
        }
        return permiso
    }

    async updatePermiso(
        permisoId, 
        namePermiso
    ){
        return await api.put("/permiso/?id="+permisoId, {
            name: namePermiso
        })
    }

    async deletePermiso(id){
        return await api.put("/permiso/deletePermiso/?id="+id) 
    }

    async addPermisosToProfile(
        idPerfil,
        permisos,
    ){
        //return await api.put("perfil/update/?id="+idPerfil,{
            return await api.put("perfil/addPermisoToPerfil/?id="+idPerfil,{
            permisos : permisos,
        })
    }

    async deletePermisosFromProfile(
        idPerfil,
        idPermiso,
    ){
        return await api.put("/perfil/deletePermisoFromPerfil/?id="+idPerfil,{
            permisos : idPermiso,
        })
    }

    async getPerfiles(){
        return await api.get("perfiles")
    }

    async getPerfil(perfilId){
        let perfil = undefined 
        try {
            perfil = await api.get("perfil/?id="+perfilId)
        } catch (ignored) {
            
        }
        return perfil
    }

}

export const perfilesService = new perfilService()