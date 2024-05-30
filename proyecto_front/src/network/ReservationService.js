import { MockStore } from '../mock/MockStore'
import {api} from './ApiClient'
import {pickMany} from '../mock/Factory'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import {v4 as uuid} from 'uuid'
import { lessThan } from 'react-native-reanimated'
import { roomService } from './RoomService'
const faker = require("faker")

class ReservationService {
    async getReservationsByUserId(userId) {
        return MockStore.findReservationsByUser(userId)
    }

    async getReservationsByRoom(roomId) {
        let reservations
        try{
            reservations = await api.get(`/reservation/findReservationbyRoom/?id=${roomId}`)
        } catch (ignored) {}
        return reservations
    }
    // /reservation/findReservationbyRoom/
    async getReservationsByRoom(roomId) {
        return MockStore.findReservationsByRoom(roomId)
    }
    async sendEmailReserva(email) {
        console.log("Enviando email")
        return await api.post("/emailReserva", {
            receptorSala: email.duenoSala,
            receptorCliente: email.receptor,
            sala: email.sala,
            inicio: email.inicio,
            nombreUsuario: email.nombreUsuario
        })
    }

    async sendEmail(email) {
        console.log("Enviando email")
        //return await api.post("/email/send/", {
        return await api.post("/email", {
            receptor: email.receptor,
            sala: email.sala,
            inicio: email.inicio,
            nombreUsuario: email.nombreUsuario
        })
    }

    async sendEmailOwner(email) {
        console.log("Enviando email Owner")
        console.log(email)
        return await api.post("emailOwner", {
            receptor: email.duenoSala,
            sala: email.sala,
            inicio: email.inicio,
            nombreUsuario: email.nombreUsuario

        })
    }

    async getReservationsFromMyRooms() {
        const rooms = await roomService.getMyRooms()
        let reservations = []
        for(let room of rooms) {
            reservations = reservations.concat(await this.getReservationsByRoom(room.id))
        }
        return reservations
    }

    async getReservationsFromMyRoomsBd() {
        const reservatioinsToMyRooms = await api.get("/reservation/findReservationbyOwner/")
        return reservatioinsToMyRooms.map((reservation) =>{
            reservation.hsStart = new Date(reservation.hsStart)
            reservation.user = reservation.idOwner
            return reservation
         })
    }

    async getMyReservations() {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return MockStore.findReservationsByUser(user.id)
        //buscar reservas hechas por mi usuariologeado a la bd
    }

    async getMyReservationsBd() {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        const myReservations = await api.get("/reservation/findReservationbyUser/?id="+user.id)
        return myReservations.map((reservation) =>{
           reservation.hsStart = new Date(reservation.hsStart)
           reservation.user = reservation.idOwner
           return reservation
        })
        //return MockStore.findReservationsByUser(user.id)
        //buscar reservas hechas por mi usuariologeado a la bd
    }

    async getMyReservationsForRoom(roomId) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return MockStore.findReservationsByUserAndRoom(user.id, roomId)
    }

    //buscar reservas hechos por el usuario logueado a la sala q se renderiza
    async getMyRoomReservationBd(userId, roomId){
        const roomReservations = api.get("/reservation/findReservationbyUserAndRoom/?id="+userId, 
        {
            idRoom: roomId
        })
        return roomReservations
    }

    async reserve(order) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        const reservation = {
            id: uuid(),
            user: user,
            room: order.room,
            start:  order.start,
            end: order.end,
            order: order
        }
        console.log("Storing reservation")
        console.log(reservation)
        MockStore.storeReservation(reservation)
        return reservation
    }

    async createReservation (reserva){
        const resevation = await api.post("/reservation/create/",{
            idRoom: reserva.idRoom,
            idOwner:reserva.idOwner,
            hsStart:reserva.hsStart,
            hsEnd:reserva.hsEnd,
            date:reserva.date,
            totalPrice:reserva.totalPrice
        })
        return resevation
    }

    async cancelReservationBd (reservationId){
        const canceledReservation = await api.get("/reservation/cancel/?id="+reservationId)
        return canceledReservation
    }

    async findByNameReservations(query){
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return MockStore.findReservationsByUser(user.id).filter(
            (reservation) => reservation.room.name.toLowerCase().startsWith(query.toLowerCase())
        )
    }

    async findByNameOwnerReservations(query){
        const rooms = await roomService.getMyRooms()
        let reservations = []
        for(let room of rooms) {
            reservations = reservations.concat(await this.getReservationsByRoom(room.id))
        }
        return reservations.filter(
            (reservation) => reservation.room.name.toLowerCase().startsWith(query.toLowerCase())
        )
    }

    async cancelReservation(reservationId) {
        const removed = MockStore.removeReservation(reservationId)
        if(removed && removed.length > 0) {
            return removed[0]
        }
    }
    

}

export const reservationService = new ReservationService()