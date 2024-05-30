import mongoose from "mongoose"
import {
    Schema,
    Document,
    ObjectId
} from "mongoose"

/**
import { Perfil} from "../perfil/models"
import {ArtistStyle} from "../artista/modelsStyle"
import {ArtistType} from "../artista/modelsType"

var Perfil = mongoose.model('Perfil');
var ArtistStyle = mongoose.model('ArtistStyle');
var ArtistType = mongoose.model('ArtistType');

/**
 *  Clase de dominio que usaremos en nuestra app. Tiene que sí o sí estar separada del Schema de mongoose. Es la clase que vamos a usar 
 *  en nuestros casos de uso internamente. Debe ir desacoplada del Schema y del Dto que nos envían los usuarios.
 *  Necesita extender de "Document" para poder utilizarlo en mongoose.model<User> (ver abajo). 
 */
export interface User {
    id: string;
    name : string;
    lastName:  string;
    password: string;
    email: string;
    createdAt : Date;
    deletedAt?: Date;
    imageId?: string;
    idPerfil: string;
    idArtistType?: string;
    idArtistStyle?: string;
    isAdmin: boolean;
    enabled: string;
    userType: string;// sala de ensayo o artist
    estadoUsuario?:[{type: string}];
    idSalaDeEnsayo:[{type: string}]
}



export interface UserDoc extends Document {
    _id: string;
    name : string;
    lastName:  string;
    password: string;
    email: string;
    createdAt : Date;
    deletedAt?: Date;
    imageId?: ObjectId;
    idPerfil: ObjectId;
    idArtistType?: ObjectId;
    idArtistStyle?: ObjectId;
    userType: string;
    isAdmin: boolean;
    enabled: string;
    estadoUsuario?:[{type: string}];
    idSalaDeEnsayo:[{type: string}]
}




/**
 *  Definicion de la "tabla" en Mongoose de  User.  No queremos hacer nada raro con ella, simplemente define los tipos de los campos.
 *  No nos interesa añadir lógica de negocio (por ejemplo validar campos) acá, porque eso sería acoplar las responsabilidades de una clase  
 *  que sólo debe encargarse de persistencia. Tampoco hay que meter búsquedas de BBDD ni nada parecido en los schemas. 
 * 
 */
export const UserSchema = new Schema({
    name : String,
    email: {type: String, unique: true},
    lastName : String,
    password:  String,
    createdAt : Date,
    deletedAt : Date,
    imageId : Schema.Types.ObjectId,
    isAdmin: Boolean,
    enabled: String,
    userType: String,
    idPerfil : {
        type: Schema.Types.ObjectId,
        ref: "Perfil",
    },
    idArtistType : {
        type: Schema.Types.ObjectId,
        ref: "ArtistStyle",
    },
    idArtistStyle : {
        type: Schema.Types.ObjectId,
        ref: "ArtistType",
    },
    estadoUsuario: [{
        type: Schema.Types.ObjectId, 
        ref:'EstadoUsuario'
    }],
    idSalaDeEnsayo:[{
        type: Schema.Types.ObjectId, 
        ref:'Sala_De_Ensayo'
    }]

})

export const UserModel = mongoose.model<UserDoc>("User", UserSchema)