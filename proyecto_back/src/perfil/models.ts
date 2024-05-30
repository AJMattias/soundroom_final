import mongoose from "mongoose"
import {
    Schema,
    Document,
    ObjectId
} from "mongoose"

export interface Perfil{
    id: string;
    name: string;
    createdAt : Date;
    deletedAt?: Date;
    // permisos?: [] | undefined;
    permisos?: [{type: string, unique: true}];
}

export interface PerfilDoc extends Document{
    _id: string;
    name: string;
    createdAt: Date;
    deletedAt?: Date;
    permisos?: [{type: string, unique: true}];
}

export const PerfilSchema = new Schema({
    name: {type: String, unique: true},
    createdAt: Date,
    permisos: [{
        type: Schema.Types.ObjectId,
        unique: true, 
        ref:'Permiso'}]
});

export const PerfilModel = mongoose.model<PerfilDoc>("Perfil", PerfilSchema)