import { Opinion, SalaDeEnsayo } from "./model";

export class SalaDeEnsayoDto{
    id: string;
    nameSalaEnsayo: string;
    calleDireccion: string;
    numeroDireccion: number;
    createdAt?: Date;
    idImagen?: string;
    duracionTurno: number;
    precioHora: number;
    idOwner?: string;
    idType?: string;
    idLocality?: string;
    enabled?: boolean;
    descripcion: string;
    comodidades:[{type: string}];
    opiniones:[{type: string}];

    constructor(sala: SalaDeEnsayo){
        this.id = sala.id
        this.nameSalaEnsayo= sala.nameSalaEnsayo;
        this.calleDireccion = sala.calleDireccion;
        this.numeroDireccion = sala.numeroDireccion;
        this.duracionTurno = sala.duracionTurno;
        this.precioHora = sala.precioHora;
        this.idImagen = sala.idImagen;
        this.idOwner = sala.idOwner;
        this.idType = sala.idType;
        this.idLocality = sala.idLocality;
        this.createdAt = sala.createdAt;
        this.descripcion = sala.descripcion;
        this.comodidades = sala.comodidades;
        this.opiniones = sala.opiniones;
    }
}


export interface CreateSalaDeEnsayoDto2{
    nameSalaEnsayo: string,
    calleDireccion: string,
    numeroDireccion: number,
    precioHora: number,
    duracionTurno: number,
    deletedAt?: Date,
    comodidades: undefined; 
    idOwner?: string;
    idType?: string; 
    opiniones?: string; 
}
export interface CreateSalaDeEnsayoDto{
    nameSalaEnsayo: string;
    calleDireccion: string;
    // numeroDireccion: number;
    // idLocality: string;
    createdAt: Date;
    idImagen?: string;
    duracionTurno: number;
    precioHora: number;
    idOwner?: string;
    idType: string;
    enabled: boolean;
    descripcion: string;
    comodidades:undefined;
}
export interface UpdateSalaDeEnsayoDto{
    name: string,
    calleDireccion: string,
    numeroDireccion: number,
    precioHora: number,
    duracionturno: number,
    comodidades:undefined;
}

export interface CreateSalaDeEnsayoDtoOpinion{
    nameSalaEnsayo: string,
    calleDireccion: string,
    numeroDireccion: number,
    precioHora: number,
    opiniones?: string,
}

export interface CreateSearchSdEDto{
    idOwner:string,
    idType: string,
    //idLocality: string
}

export class OpinionDto{
    id?: string;
    descripcion: string;
    estrellas: number;
    idUser:  string

    constructor(opinion: Opinion){
        this.id = opinion.id,
        this.descripcion= opinion.descripcion,
        this.estrellas = opinion.estrellas,
        this.idUser = opinion.idUser

    }
}

export interface CreateOpinionDto{
    descripcion: string;
    estrellas: number;
    idUser:  string
}

export interface OpinionDto{
    descripcion: string;
    estrellas: number;
    idUser:  string
}