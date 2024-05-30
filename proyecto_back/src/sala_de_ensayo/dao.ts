import { ModelNotFoundException } from "../common/exception/exception";
import { CreateOpinionDto, CreateSalaDeEnsayoDto, CreateSalaDeEnsayoDto2, CreateSalaDeEnsayoDtoOpinion, CreateSearchSdEDto, OpinionDto, SalaDeEnsayoDto} from "./dto";
import { Opinion, OpinionDoc, OpinionModel, SalaDeEnsayo, SalaDeEnsayoDoc, SalaDeEnsayoModel } from "./model";
import {StringUtils} from "../common/utils/string_utils";
import { ObjectId } from "mongoose"


var mongoose = require('mongoose');

export class SalaDeEnsayoDao{

async getAll():Promise<Array<SalaDeEnsayo>>{
    return(await SalaDeEnsayoModel.find({enabled:true}).exec())
    .map((doc:SalaDeEnsayoDoc)=>{
        return this.mapToSalaDeEnsayo(doc)
    })
}

async findById(salaEnsayoId: string): Promise<SalaDeEnsayo>{
    const model = await SalaDeEnsayoModel.findById(salaEnsayoId)
    .populate("idImagen").populate("idOwner").exec()
    if(!model) throw new ModelNotFoundException()
    console.log('dao get asala: ', model)
    return this.mapToSalaDeEnsayo(model)
}

async findById2(salaEnsayoId: string): Promise<SalaDeEnsayo>{
    console.log('findById2')
    if (!mongoose.Types.ObjectId.isValid(salaEnsayoId)) {
        throw new Error('ID de documento no válido');
    }
    const model = await SalaDeEnsayoModel.findOne({_id: salaEnsayoId, enabled: true})
    .populate("idOwner")
    .exec()
    if(!model) throw new ModelNotFoundException()
    console.log('dao get asala: ', model)
    return this.mapToSalaDeEnsayo(model)
}

/*<<
async findByName(query: string): Promise<Array<SalaDeEnsayo>> {
    const models = await SalaDeEnsayoModel.find({$text : { $search : query }}).exec()
    return models.map((model:SalaDeEnsayoDoc) => this.mapToSalaDeEnsayo(model))
}
*/

async findByName(query: string): Promise<Array<SalaDeEnsayo>> {
    return(await SalaDeEnsayoModel.find({nameSalaEnsayo: { $regex: query, $options: 'i' } , enabled: true}).populate("idOwner").exec())
    //return(await SalaDeEnsayoModel.find({$text : { $search : query }}, {enabled: true}).exec())
    .map((doc:SalaDeEnsayoDoc)=>{
        return this.mapToSalaDeEnsayo(doc)
    })
}

async getSearch(sala: CreateSearchSdEDto):Promise<Array<SalaDeEnsayo>>{
    return(await SalaDeEnsayoModel.find({
        idType: mongoose.Types.ObjectId(sala.idType), 
        //idLocality: mongoose.Types.ObjectId(sala.idLocality)
    }, {enabled: true}).exec())
    .map((doc:SalaDeEnsayoDoc)=>{
        return this.mapToSalaDeEnsayo(doc)
    })
}


async getByOwner(idOwner: string):Promise<Array<SalaDeEnsayo>>{
    return(await SalaDeEnsayoModel.find({
        idOwner: mongoose.Types.ObjectId(idOwner), 
        enabled: true}).exec())
    .map((doc:SalaDeEnsayoDoc)=>{
        return this.mapToSalaDeEnsayo(doc)
    })
}

async store(salaDeEnsayo: CreateSalaDeEnsayoDto): Promise<SalaDeEnsayo>{
    console.log("dao idImagen: ", salaDeEnsayo.idImagen)
    console.log("dao sde e imagen ", salaDeEnsayo)
    const idImagen = salaDeEnsayo.idImagen as string
    const SalaDeEnsayoDoc = await SalaDeEnsayoModel.create({
        nameSalaEnsayo: salaDeEnsayo.nameSalaEnsayo,
        calleDireccion: salaDeEnsayo.calleDireccion, 
        //numeroDireccion: salaDeEnsayo.numeroDireccion,
        // idLocality: salaDeEnsayo.idLocality,
        idImagen: idImagen,
        idType: salaDeEnsayo.idType, 
        precioHora: salaDeEnsayo.precioHora, 
        idOwner: salaDeEnsayo.idOwner,
        duracionTurno: salaDeEnsayo.duracionTurno,
        descripcion: salaDeEnsayo.descripcion,
        createdAt: new Date(),
        enabled: salaDeEnsayo.enabled,
        comodidades:salaDeEnsayo.comodidades,
    }); 
     return this.mapToSalaDeEnsayo(SalaDeEnsayoDoc)

}

async updateSala(salaEnsayoId: string, sala: CreateSalaDeEnsayoDto2): Promise<SalaDeEnsayo>{
    const updated = await SalaDeEnsayoModel.findByIdAndUpdate(salaEnsayoId,{
        nameSalaEnsayo : sala.nameSalaEnsayo,
        calleDireccion: sala.calleDireccion,
        numeroDireccion: sala.numeroDireccion,
        precioHora: sala.precioHora,
        createdAt: new Date()
    }).exec()
    if(!updated){
        throw new ModelNotFoundException() 
    }
    return this.mapToSalaDeEnsayo(updated)
}

async updateSalaOpinion(salaEnsayoId: string, sala: CreateSalaDeEnsayoDtoOpinion, idOpinion: string): Promise<SalaDeEnsayo>{
    const updated = await SalaDeEnsayoModel.findByIdAndUpdate(salaEnsayoId,{
        nameSalaEnsayo : sala.nameSalaEnsayo,
        calleDireccion: sala.calleDireccion,
        numeroDireccion: sala.numeroDireccion,
        precioHora: sala.precioHora, 
        $push: {opiniones: idOpinion}
    }).exec()
    console.log('dao, sala actualizada: ', updated)
    if(!updated){
        throw new ModelNotFoundException() 
    }
    return this.mapToSalaDeEnsayo(updated)
}

async deleteSala(salaEnsayoId: string, sala: CreateSalaDeEnsayoDto2): Promise<SalaDeEnsayo>{
    const updated = await SalaDeEnsayoModel.findByIdAndUpdate(salaEnsayoId,{
        nameSalaEnsayo : sala.nameSalaEnsayo,
        calleDireccion: sala.calleDireccion,
        precioHora: sala.precioHora, 
        numeroDireccion: sala.numeroDireccion,
        idOwner: sala.idOwner? StringUtils.toObjectId(sala.idOwner) : undefined, 
        idType: sala.idType? StringUtils.toObjectId(sala.idType) : undefined, 
        duracionTurno: sala.duracionTurno,
        deletedAt: sala.deletedAt,
        comodidades: sala.comodidades,
        enabled: false,
    }).exec()
    if(!updated){
        throw new ModelNotFoundException()
    }
    return this.mapToSalaDeEnsayo(updated)
}


mapToSalaDeEnsayo(document: SalaDeEnsayoDoc): SalaDeEnsayo {
    return{
        id: document._id as unknown as string,
        nameSalaEnsayo: document.nameSalaEnsayo,
        calleDireccion: document.calleDireccion,
        precioHora: document.precioHora, 
        numeroDireccion: document.numeroDireccion,
        idImagen:document.idImagen,
        idOwner: document.idOwner as unknown as string,
        duracionTurno: document.duracionTurno,
        createdAt: document.createdAt,
        idLocality: document.idLocality as unknown as string,
        idType: document.idType as unknown as string,
        deletedAt: document.deletedAt,
        enabled: document.enabled,
        descripcion: document.descripcion,
        comodidades:  document.comodidades,
        opiniones: document.opiniones
    }
} 

// Document opinion de sala de ensayo

async getAllOpiniones(): Promise<Array<Opinion>> {
    return (await OpinionModel.find().exec())
    .map((doc: OpinionDoc)=>{
        return this.mapToOpinion(doc)
    })
}

async createOpinion(opinion: CreateOpinionDto): Promise<Opinion>{
    const opinionDoc = await OpinionModel.create({
        descripcion: opinion.descripcion,
        idUser: opinion.idUser,
        estrellas: opinion.estrellas
    })
    return this.mapToOpinion(opinionDoc)
}

async updateOpinion(idOpinion: string, opinion: OpinionDto): Promise<Opinion>{
    const opinionUpdatedDoc = await OpinionModel.findByIdAndUpdate(idOpinion, {
        descripcion: opinion.descripcion,
        idUser: opinion.idUser,
        estrellas: opinion.estrellas
    }).exec()
    if(!opinionUpdatedDoc){
        throw new ModelNotFoundException() 
    }
    return this.mapToOpinion(opinionUpdatedDoc)
}

//TODO hacer delete de opinion y getters quizas


mapToOpinion(document: OpinionDoc): Opinion{
    return {
        id:  document._id as unknown as string,
        descripcion: document.descripcion,
        estrellas: document.estrellas,
        idUser:  document.idUser as unknown as string,
    }
}

}

export const instance = new SalaDeEnsayoDao()