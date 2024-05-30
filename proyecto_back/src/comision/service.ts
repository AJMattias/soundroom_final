import  * as dao from "./dao"
import { ComisionDto, CreateComisionDto } from "./dto"
import { Comision } from "./model"
import {AuthenticationException, ServerException} from "../common/exception/exception"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()

export class ComisionService{

    dao : dao.ComisionDao;
    constructor(comisionDao : dao.ComisionDao){
        this.dao = comisionDao
    }

    mapToComision(comision: Comision): ComisionDto{
        return{
            id: comision.id,
            porcentaje: comision.porcentaje,
            createdAt: comision.createdAt,
            deletedAt: comision.deletedAt,
            enabled: comision.enabled
        }
    }

    async createComision(dto: CreateComisionDto): Promise<ComisionDto>{
        try{
        const comisionEnabled = this.findEnabled()
        const comisionNotEnabled = this.dao.updateComision((await comisionEnabled).id,{
            porcentaje: (await comisionEnabled).porcentaje,
            createdAt: (await comisionEnabled).createdAt,
            deletedAt: new Date(),
            enabled: false,
        })
    }catch(error){
        console.log("no comision enabled")
    }
        return this.mapToComision(
            await this.dao.store({
                porcentaje: dto.porcentaje,
                enabled: true,
                createdAt: new Date()
            })
        )
    }

    async getAllComisiones() : Promise<Array<ComisionDto>>{
        const comisiones = await this.dao.getAll()
        return comisiones.map((comision: Comision) => {
            return this.mapToComision(comision)
        })
    }

    async findComisionById(id : string) : Promise<ComisionDto>{
        const comision = await this.dao.findById(id)
        return this.mapToComision(comision)
    }

    async findEnabled() : Promise<ComisionDto>{
        const comision = await this.dao.findEnabled()
        return this.mapToComision(comision)
    }

    async updateComision(comisionId: string, dto: CreateComisionDto) : Promise<ComisionDto>{
        return this.mapToComision(
            await this.dao.updateComision(comisionId, {
                porcentaje: dto.porcentaje,
                enabled: dto.enabled,
                createdAt: new Date,
            })
        )
    }

    async deleteComision(comisionId: string) : Promise<ComisionDto>{
        return this.mapToComision(
            await this.dao.deleteComision(comisionId)
        )
    }

     async actualizarComision(comisionId: string, dto: CreateComisionDto) : Promise<ComisionDto>{
     
        const comisionEnabled = this.findEnabled()
        const comisionNotEnabled = this.dao.updateComision((await comisionEnabled).id,{
            porcentaje: (await comisionEnabled).porcentaje,
            createdAt: (await comisionEnabled).createdAt,
            deletedAt: new Date(),
            enabled: false,
        })
        const updated = this.updateComision(comisionId, {
            porcentaje: dto.porcentaje,
            enabled: true,
            createdAt: new Date()
        })
        return this.mapToComision({
            id: (await updated).id,
            porcentaje: (await updated).porcentaje,
            enabled: (await updated).enabled,
            createdAt: (await updated).createdAt,
        })
     }



}
export const instance = new ComisionService(dao.instance)
