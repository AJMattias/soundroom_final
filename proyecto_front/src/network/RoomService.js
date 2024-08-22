import { MockStore } from '../mock/MockStore'
import {api} from './ApiClient'
import {avatarForId, pickMany} from '../mock/Factory'
import { LocalPhoneStorage , STORAGE_ROOMOWNED, STORAGE_USER } from '../storage/LocalStorage' 
import {v4 as uuid} from 'uuid'
const faker = require("faker")

class RoomService {
    async recomended(number) {
        const rooms = MockStore.getRooms()
        return pickMany(rooms, number).filter(
            (room) => room.enabled
        )
    }

    async getRoom(roomId) {
        return MockStore.findRoom(roomId)
    }

    async getRoomBd(roomId) {
        const room = await api.get("/salasdeensayo/findOne/?id="+roomId)
        console.log(room)
        return room
    }

    async getRatings(roomId) {
        return MockStore.findRatingsByRoom(roomId)
    }
    async getRoomsByUserId(userId) {
        return MockStore.findRoomsByUser(userId)
    }

    async getRoomsByUserIdBd(userId) {
        const ownerRooms = await api.get("/salasdeensayo/findByOwner/?id="+userId)
        console.log(ownerRooms)
        return ownerRooms
    }

    //buscar salas populares
    async getPopulars() {
        console.log('fetching popular rooms')
        const response  = await api.get("/salasdeensayo/findPopulars/")
        const popularRooms = response; // Asegúrate de acceder a los datos correctamente
        console.log('popularRooms: ', popularRooms);
    
        // Actualiza los datos con el nuevo atributo nombreDueño
        const updatedData = popularRooms.map((item) => ({
          ...item,
          nombreDueño: item.idOwner
            ? `${item.idOwner.name} ${item.idOwner.lastName}`
            : '', // Usa una cadena vacía si idOwner es null
        }));
    
        console.log('updatedData: ', updatedData);
        return updatedData;
        return updatedData
    }

    async findByName(name) {
        return MockStore.getRooms().filter(
            (room) => room.name.toLowerCase().startsWith(name.toLowerCase())
            && room.enabled
        )
    }

    //Llamada a la base de datos busqueda por nombre
    async findByNameBd(name){
        const room = await api.get("/salasdeensayo/findByName/?q="+name)
        return room
    }

    async getMyRooms() {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return await this.getRoomsByUserId(user.id)
         
    }
    async getMyRoomsBd(userId) {
        const rooms = await api.get("salasdeensayo/findByOwner/?id="+userId)
        return rooms
    }
    
    // async editRoom(room) {
    //     MockStore.editRoom(room)
    //     return room
    // }
    async storeRoom(room) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        room.owner = user
        room.ownerImage = user.image? user.image : avatarForId(user.id)
        room.ownerName = user.name +" "+user.last_name  
        room.id = uuid()      
        MockStore.storeRoom(room)
        return room
    }

    //crear y guardar sala en el servidor
    async saveRoom(room){
        console.log('Room service', room)
        const roomCreated =  await api.post("salasdeensayo", {
            nameSalaDeEnsayo: room.nameSalaDeEnsayo,
            calleDireccion: room.calleDireccion,
            idType: room.tipoSala,
            descripcion: room.descripcion,
            precioHora: room.precioHora,
            comodidades: room.comodidades,
            enabled: room.enabled
        })
        if(roomCreated){
            await LocalPhoneStorage.set(STORAGE_ROOMOWNED, roomCreated)
        }
        
        return roomCreated
    }

    async editRoom(room){
        console.log('Room service to update', room)
        let roomCreated
        try{
        roomCreated =  await api.put("/salasdeensayo/update/?id="+room.idRoom, {

            nameSalaEnsayo: room.nameSalaDeEnsayo,
            calleDireccion: room.calleDireccion,
            idType: room.tipoSala,
            descripcion: room.descripcion,
            precioHora: room.precioHora,
            comodidades: room.comodidades,
            enabled: room.enabled
        })
        console.log('room updated: ', roomCreated)
        if(roomCreated){
            await LocalPhoneStorage.set(STORAGE_ROOMOWNED, roomCreated)
        }
        }catch(error){
            console.log('error updateing room', error)
        }
        return roomCreated
    }

    async saveRoom2(nameSalaDeEnsayo, calleDireccion, descripcion, precioHora, comodidades){
        console.log('Room service', room)

        const roomCreated =  await api.post("salasdeensayo", {
            nameSalaDeEnsayo: nameSalaDeEnsayo,
            calleDireccion: calleDireccion,
            idType: tipoSala,
            descripcion: descripcion,
            precioHora: precioHora,
            comodidades: comodidades
        })
        if(roomCreated){
            await LocalPhoneStorage.set(STORAGE_ROOMOWNED, roomCreated)
        }
        return roomCreated
    }

    //delete room from db
    async deleteRoomBd(roomId){
        const deleted = await api.get("salasdeensayo/deletefrombd/?id="+roomId)
        return deleted
    }

    async deleteRoom(roomId) {
        return MockStore.removeRoom(roomId)
    }
    
    async searchProvinces() {
        console.log("buscando provincias")
        const lala = await api.get("province")
        return lala
    }

    async searchLocalities(idProvincia) {
        console.log("a search localities llega " + idProvincia)
        return await api.get("province/locality?id=" + idProvincia)
    }

    async searchType() {
        return await api.get("managementType")
    }

    async searchRooms() {
        return await api.get("salasdeensayo/search")
    }

    async storeRating(room, rating) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        rating.user = user
        rating.id = uuid()
        rating.otherId = room.id
        rating.artist = {
            user: user
        }
        MockStore.storeRatings([
            rating
        ]) 
    }

    async deleteRating(ratingId) {
        MockStore.removeReservation(ratingId)
    }
    
    async getPromedioSala(roomId){
        const promedio = await api.get("/salaPromedio/?id="+roomId)
        return promedio
    }

    async getMyRatingForRoom(roomId) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        const ratings = await this.getRatings(roomId)
        console.log("room ratings")
        console.log(ratings)
        const found =  ratings.filter((rating) => rating.user.id === user.id)
        return found.length? found[0] : undefined
    }
    

    async updateRating(previousRatingId, newRating) {
        const rating = MockStore.getRating(previousRatingId)
        if(rating) {
            rating.comment = newRating.comment
            rating.score = newRating.score
        }
        MockStore.updateRating(previousRatingId, rating)
    }
}

export const roomService = new RoomService()