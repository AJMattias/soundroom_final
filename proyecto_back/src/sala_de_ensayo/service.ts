import * as dao from "./dao"
import { CreateOpinionDto, CreateSalaDeEnsayoDto2, CreateSalaDeEnsayoDtoOpinion, OpinionDto, SalaDeEnsayoDto} from "./dto";
import { Opinion, OpinionModel, SalaDeEnsayo, SalaDeEnsayoModel } from "./model";
var mongoose = require('mongoose');

export interface CreateSalaDeEnsayoDto{
    id?: string;
    nameSalaEnsayo: string;
    calleDireccion: string;
    // numeroDireccion: number;
    // idLocality: string;
    idImagen?: string;
    duracionTurno: number;
    precioHora: number;
    idOwner: string;
    idType: string;
    //enabled: boolean;
    enabled?: string;
    descripcion: string;
    comodidades?:undefined; 
}


export class SalaService{

    dao: dao.SalaDeEnsayoDao;
    constructor(salaDeEnsayoDao: dao.SalaDeEnsayoDao){
        this.dao = salaDeEnsayoDao
    }
    

    async findByName(nombre: string): Promise<Array<SalaDeEnsayoDto>>{
        const salas = await this.dao.findByName(nombre)
        return salas.map((sala: SalaDeEnsayo) =>{
            return this.mapToDto(sala)
        })
    }

    /*

    async findByName(nombre: string): Promise<Array<SalaDeEnsayoDto>>{
        const salas = await this.findByName(nombre)
        return salas.map((sala: SalaDeEnsayo) =>{
            return this.mapToDto(sala)
        })
    }
    */
    async createSalaDeEnsayo(dto: CreateSalaDeEnsayoDto): Promise<SalaDeEnsayoDto>{
        console.log("servicio idImagen: ", dto.idImagen)
        console.log("service sde e imagen ", dto)
        if(dto.enabled === undefined){
            console.log('back service, create sala dto.enabled: ', dto.enabled)
            dto.enabled= 'habilitado'
        }
        return this.mapToDto(
            await this.dao.store({
                nameSalaEnsayo: dto.nameSalaEnsayo,
                calleDireccion: dto.calleDireccion,
                //estos campos no van mas
                //numeroDireccion: dto.numeroDireccion,
                //idLocality: dto.idLocality,
                idImagen: dto.idImagen,
                idType: dto.idType,
                idOwner: dto.idOwner,
                precioHora: dto.precioHora,
                duracionTurno: dto.duracionTurno,
                createdAt: new Date(),
                enabled:  dto.enabled,
                descripcion: dto.descripcion,
                comodidades: dto.comodidades,

            })
        )
    }


    async getAll(): Promise<Array<SalaDeEnsayoDto>>{
        const salas = await this.dao.getAll()
        return salas.map((sala: SalaDeEnsayo) =>{
            return this.mapToDto(sala)
        })
    }

    async counterSalasActivas(): Promise<Array<SalaDeEnsayoDto>> {
        const salas = await this.dao.getAll()
        /*
        * var salasActivas = salas.filter( enabled => enabled = true).length
        */
        var salasActivas = salas
        return salasActivas.map((salasActivas: SalaDeEnsayo)=> {
            return this.mapToDto(salasActivas)
        })
    }

    async getSearch(dto: CreateSalaDeEnsayoDto): Promise<Array<SalaDeEnsayoDto>>{
        const salas = await this.dao.getSearch({
            idOwner: dto.idOwner,
            idType: dto.idType
            //idLocality: dto.idLocality
        })
        return salas.map((sala: SalaDeEnsayo) =>{
            return this.mapToDto(sala)
        })
    }

    async findSalaById(id: string): Promise<SalaDeEnsayoDto>{
        const sala = await this.dao.findById2(id)
        console.log("service get sala: ", sala)
        return this.mapToDto(sala)
    }

    async findSalaByOwner(idOwner: string): Promise<Array<SalaDeEnsayoDto>>{
        const salas = await this.dao.getByOwner(idOwner)
        console.log('service salas, salas by user: ', salas)
        return salas.map((sala: SalaDeEnsayo)=>{
            return this.mapToDto(sala)
        })
    }


    // rehacer, modificar codigo update y delete
    async updateSalaDeEnsayo(id: string, dto: CreateSalaDeEnsayoDto2): Promise<SalaDeEnsayoDto>{
        console.log('service update Sala:', dto)
        return this.mapToDto(
            await this.dao.updateSala(id,{
                nameSalaEnsayo: dto.nameSalaEnsayo,
                calleDireccion: dto.calleDireccion,
                numeroDireccion: dto.numeroDireccion,
                duracionTurno: dto.duracionTurno,
                precioHora: dto.precioHora,
                comodidades: dto.comodidades,
                descripcion: dto.descripcion,
                enabled: dto.enabled
            })
        
        )
    }

    async updateSalaDeEnsayoOpinion(id: string, dto: CreateSalaDeEnsayoDtoOpinion): Promise<SalaDeEnsayoDto>{
        const opinion= dto.opiniones as unknown as string;
        console.log('service, sala:', dto)
        console.log('service, opinion:', opinion)
        return this.mapToDto(
            await this.dao.updateSalaOpinion(id,{
                nameSalaEnsayo: dto.nameSalaEnsayo,
                calleDireccion: dto.calleDireccion,
                numeroDireccion: dto.numeroDireccion,
                precioHora: dto.precioHora
            }, opinion)
           
        )
    }

    async deleteSalaDeEnsayo(id: string, dto: CreateSalaDeEnsayoDto2): Promise<SalaDeEnsayoDto>{
        return this.mapToDto(
            await this.dao.deleteSala(id,{
            nameSalaEnsayo: dto.nameSalaEnsayo,
            calleDireccion: dto.calleDireccion,
            numeroDireccion: dto.numeroDireccion,
            duracionTurno: dto.duracionTurno,
            deletedAt: new Date(),
            precioHora: dto.precioHora,
            comodidades: dto.comodidades,
            descripcion: dto.descripcion,
            enabled: dto.enabled
            })
        )
    }

    async borrarSalaBd(id: string): Promise<Boolean>{
    return await this.dao.borrarSala(id)
    }
     

     async obtenerCantidadNuevasSdEPorMes(fechaInicio: string, fechaFin: string): Promise<{ mes: string, cantidad: number }[]> {
        try {
            // Parsear fechas
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            console.log("fecha Inicio", fechaInicioObj)
            console.log("fecha Fin", fechaFinObj)
            // Obtener la diferencia en meses
            const diffMeses = (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinObj.getMonth() - fechaInicioObj.getMonth() + 1;

            // Inicializar el array de resultados
            const resultados: { año: number, mes: string, cantidad: number }[] = [];

            // Consultar la cantidad de documentos por mes
            for (let i = 0; i < diffMeses; i++) {
                const fechaActual = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i, 1);
                const fechaSiguiente = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i + 1, 1);

                const cantidad = await SalaDeEnsayoModel.countDocuments({
                    createdAt: {
                        $gte: fechaActual,
                        $lt: fechaSiguiente
                    }
                });

                const nombreDelMes = this.obtenerNombreDelMes(fechaActual.getMonth());
                resultados.push({ año: fechaActual.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad });
            }

            return resultados;
        } catch (error) {
            console.error('Error al obtener la cantidad de documentos por mes:', error);
            throw error;
        }
        
        
    }

    obtenerNombreDelMes = (mes: number): string => {
        const nombresDeMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return nombresDeMeses[mes];
    }

    

    mapToDto(sala: SalaDeEnsayo): SalaDeEnsayoDto{
        return{
            id: sala.id,
            nameSalaEnsayo: sala.nameSalaEnsayo,
            calleDireccion: sala.calleDireccion,
            numeroDireccion: sala.numeroDireccion,
            idImagen: sala.idImagen,
            idLocality: sala.idLocality,
            idOwner: sala.idOwner,
            precioHora: sala.precioHora,
            idType: sala.idType,
            duracionTurno: sala.duracionTurno,
            enabled: sala.enabled,
            descripcion: sala.descripcion,
            comodidades: sala.comodidades,
            opiniones: sala.opiniones,
        }
    }

    mapToDtoOpinion(document: Opinion): OpinionDto{
        return {
            id:  document.id as unknown as string,
            descripcion: document.descripcion,
            estrellas: document.estrellas,
            idUser:  document.idUser as unknown as string,
            idRoom:  document.idRoom as unknown as string,
            idArtist:  document.idArtist as unknown as string,
        }
    }

    
async  obtenerCantidadValoraciones(idOwner: string) {
    try {
        // Buscar todas las salas de ensayo del usuario
        const salas = await SalaDeEnsayoModel.find({ idOwner: mongoose.Types.ObjectId(idOwner) });

        // Crear un objeto para almacenar la cantidad de valoraciones de cada tipo
        const valoracionesCount: { [key: string]: number } = {};

        // Iterar sobre cada sala de ensayo
        for (const sala of salas) {
            // Buscar las opiniones asociadas a la sala
            const opiniones = await OpinionModel.find({ _id: { $in: sala.opiniones } });

            // Contar la cantidad de valoraciones de cada tipo
            for (const opinion of opiniones) {
                const valoracionStr = opinion.estrellas.toString();
                if (valoracionesCount[valoracionStr]) {
                    valoracionesCount[valoracionStr]++;
                } else {
                    valoracionesCount[valoracionStr] = 1;
                }
            }
        }

        // Devolver el resultado en el formato deseado
        return Object.keys(valoracionesCount).map((valoracionStr) => ({
            valoracion: valoracionStr,
            cantidad: valoracionesCount[valoracionStr]
        }));
    } catch (error) {
        console.error("Error al obtener cantidad de valoraciones:", error);
        throw error;
    }
}
    
    // service para opinion
    async createOpinion(dto: CreateOpinionDto):Promise <OpinionDto>{
        return this.mapToDtoOpinion(
            await this.dao.createOpinion({
                descripcion: dto.descripcion,
                estrellas: dto.estrellas,
                idUser: dto.idUser,
                idRoom: dto.idRoom,
                idArtist: dto.idArtist
            })
        )
    }

    async updateOpinion(id: string, dto: CreateOpinionDto):Promise <OpinionDto>{
        return this.mapToDtoOpinion(
            await this.dao.updateOpinion({
                id: id,
                descripcion: dto.descripcion,
                estrellas: dto.estrellas,
                idUser: dto.idUser,
                idArtist: dto.idArtist,
                idRoom: dto.idRoom
            })
        )
    }

    //TODO hacer delete de opinion y getters quizas

    async getOpinionByUserAndRoom (idUser: string, idRoom: string):Promise<OpinionDto>{
        const opinion = await this.dao.getOpinionByUserAndRoom(idUser, idRoom)
        return this.mapToDtoOpinion(opinion)
    }

    async getOpinionById(idOpinion: string): Promise<OpinionDto>{
        const opinion = await this.dao.getOpinionById(idOpinion)
        return this.mapToDtoOpinion(opinion)
    }

    //get opiniones sobre un artista
    async getOpinionToArtist(idArtist: string): Promise<Array<OpinionDto>>{
        const opiniones = await this.dao.getOpinionToArtist(idArtist)
        return opiniones.map((opinion: Opinion) => {
            return this.mapToDtoOpinion(opinion)
        })
    }
}

export const instance = new SalaService(dao.instance)