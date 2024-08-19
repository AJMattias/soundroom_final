import {api} from './ApiClient'

class comisionService{

    async createComision(porcentaje){
        let comision = undefined
        comision = await api.post("comision", {
            porcentaje: porcentaje
        })
        return comision
    }

    async getComisiones(){
        let comisiones = undefined
        try {
            comisiones = await api.get("/comisiones/")
        } catch (ignored) {    
        }
        return comisiones
    //     return comisiones.map((comision) => {
    //         return {...comision, createdAt: new Date(comision.createdAt) }
    //    })
    }


    async getComision(comisionId){
        let comision = undefined
        try {
            comision =  await api.get("comision/?id="+comisionId)
        } catch (ignored) {
        }
        return comision
    }
    
    async getComisionEnabled(){
        return await api.get("/comision/getEnabled/")
    }

    async updateComision(idComision, porcentaje){
        return await api.put("comision/update/?id="+idComision, {
            porcentaje: porcentaje
        })
    }
    async actualizarComision(idComision){
        return await api.put("/comision/actualizarComision/?id="+idComision,
        //{porcentaje: porcentaje}
        )
    }
    

    async deleteComision(idComision){
        return await api.put("/comision/deleteComision/?id="+idComision)
    }
    

}

export const comisionesService = new comisionService()
