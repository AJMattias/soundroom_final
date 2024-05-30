import { MockStore } from '../mock/MockStore'
import {api} from './ApiClient'
import {avatarForId, pickMany} from '../mock/Factory'
import { LocalPhoneStorage , STORAGE_USER } from '../storage/LocalStorage' 
import {v4 as uuid} from 'uuid'
import { formatFecha } from '../helpers/dateHelper'
const faker = require("faker")

class ReportesService{
    async storeReportes(reportes){
        MockStore.storeReportes(reportes)
    }

    async getReportes(){
        return MockStore.getReportes()
    }

    async reportesNuevosUsuarioss(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/users/reportesNuevosUsers", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    //primero funcionando
    async reportesNuevosArtistas(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/users/reportesNuevosArtistas", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async reportesSalasNuevas(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/salasdeensayo/reportesNuevasSdE", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async reportesUsuariosActivos(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/users/reportesUsuariosActivos", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async reportesUsuariosBaja(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/users/reportesUsuariosBaja", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async reportesPropAlquianSala(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/users/reportesPropietariosAlquilan", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async reporteGrafTortaTipoSala(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/salasDeEnsayo/reporteTipoSalaTorta", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }
    //reportes para sala de ensayo
    async cantidadSalaReservas(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/reservations/reservationsPorSalaMes/", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    async valoraciones (fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.get("/salasdeensayo/cantidadVaoraciones", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }

    //dia ams reservado

    //cancelaciones reserva
    async cantidadCanceledSalaReservas(fechaInicio, fechaHasta){
        console.log('fechaI: ', fechaInicio)
        console.log('fechaH: ', fechaHasta)
        //parsear fechas
        let fechaIn = formatFecha(fechaInicio)
        let fechaHa = formatFecha(fechaHasta)
        
        console.log('fechaI: ', fechaIn)
        console.log('fechaH: ', fechaHa)
        console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
        console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

        const reportena = api.post("/reservations/reservationsCanceladasPorSalaMes/", {
            fechaI: fechaIn, 
            fechaH: fechaHa})
        console.log('reportena: ', reportena)
        return reportena  
    }



}

export const reportesService = new ReportesService()