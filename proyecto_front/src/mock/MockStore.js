import { reservationService } from "../network/ReservationService"
import { WebStorage } from "../storage/WebStorage"
import { ArrayUtils } from "../utils/ArrayUtils"
require("../utils/ArrayUtils")

export const MockStore = new function()  {
    let rooms = []
    let artists = []
    let reservations = []
    let ratings = []
    let users = []
    let reportes = []
    let orders = []


    const findById = (array, id) => {
        return array.find((element) => element.id == id)
    }

    this.storeRoom = (room) => {
        rooms.push(room)
        WebStorage.storeRooms(room)
    }

    this.storeReportes = (reporte) => {
        reportes.push(reporte)
        WebStorage.storeReportes(reporte)
    }

    this.editRoom = (roomAguardar) => {
        
        const roomDefinitivo = findById(rooms, roomAguardar.idRoom)
        
        console.log("antes de la modificacion");
        console.log(roomDefinitivo);
        roomDefinitivo.name = roomAguardar.name;
        roomDefinitivo.address = roomAguardar.address;
        roomDefinitivo.summary = roomAguardar.summary;
        roomDefinitivo.hourlyRate = roomAguardar.hourlyRate;
        roomDefinitivo.comodidades = roomAguardar.comodidades;
        roomDefinitivo.enabled = roomAguardar.enabled;
        console.log("despues de la modificacion");
        console.log(roomDefinitivo);
        this.removeRoom(roomAguardar.idRoom)
        this.storeRoom(roomDefinitivo)
        /*
        const idx = rooms.findIndex((room) => room.id == roomAguardar.idRoom)
        if(idx != -1) {
            WebStorage.removeRoom(roomAguardar.idRoom)
            return rooms.splice(idx, 1)
        }
        rooms.push(roomDefinitivo)
        WebStorage.storeRooms(roomDefinitivo)
        */
    }

    this.storeArtist = (artist) => {
        artists.push(artist)
        WebStorage.storeArtists(artist)
    }

    this.storeRating = (rating) => {
        ratings.push(rating)
        WebStorage.storeRankings(rating)
    }   

    this.storeUser = (user) => {
        users.push(user)
        WebStorage.storeUsers(user)
    }

    this.storeReservation = (reservation) => {
        reservations.push(reservation)
        WebStorage.storeReservations(reservation)
    }

    this.findRoom = (roomId) => {
        return findById(rooms, roomId)
    }

    this.findUser = (userId) => {
        return findById(users, userId)
    }

    this.findArtist = (artistId) => {
        return findById(artists, artistId)
    }

    this.findRoom = (roomId) => {
        return findById(rooms, roomId)
    }

    this.findReservation = (reservationId) => {
        return findById(reservations,reservationId)
    }

    this.findReservationsByUser = (userId) => {
        return reservations.filter((reserve) => reserve.userId == userId)
    }

    this.findRatingsByArtist = (artistId) => {
        return ratings.filter((rating) => rating.otherId == artistId)
    }

    this.findRatingsByUserAndArtist = (userId) => {
        return ratings.filter((rating) => rating )
    }

    this.findRatingsByRoom = (roomId) => {
        return ratings.filter((rating) => rating.otherId == roomId)
    }
    
    this.findRoomsByUser = (userId) => {
        console.log(rooms)
        return rooms.filter((room) => room.owner.id == userId)
    }

    this.getArtists = () => {
        return artists
    }

    this.getRooms = () => {
        return rooms
    }


    this.getReportes = () => {
        return reportes
    }
    this.getRatings = () => {
        return ratings

    }

    this.findArtistByUserId = (userId) => {
        return artists.find((artist) => artist.userId == userId)
    }

    this.storeRatings = (newRatings) => {
        console.log("New ratings")
        console.log(newRatings)
        console.log("Storing ratings")
        ratings = ratings.concat(newRatings)
        WebStorage.storeRankings(newRatings)
       
    }

    this.storeReservation = (reservation) => {
        reservations.push(reservation)
        WebStorage.storeReservations(reservation)
    }

    this.storeMultipleReservations = (reservations) => {
        reservations = reservations.concat(reservations)
        WebStorage.storeReservations(reservations)
    }

    this.findReservationsByRoom = (roomId) => {
        return reservations.filter((reservation) => reservation.room.id == roomId)
    }

    this.findReservationsByUser = (userId) => {
        return reservations.filter((reservation) => reservation.user.id == userId)
    }

    this.findReservationsByUserAndRoom = (userId, roomId) => {
        return reservations.filter((reservation) => reservation.user.id == userId && reservation.room.id == roomId)
    }

    this.removeReservation = (reservationId) => {
        const idx = reservations.findIndex((reservation) => reservation.id == reservationId)
        if(idx != -1) {
            WebStorage.removeReservation(reservationId)
            return reservations.splice(idx,1)
        }
    }

    this.removeReservationForOrder = (order) => {

    }

    this.removeRoom = (roomId) => {
        const idx = rooms.findIndex((room) => room.id == roomId)
        if(idx != -1) {
            WebStorage.removeRoom(roomId)
            return rooms.splice(idx, 1)
        }
    }

    this.removeRating = (ratingId) =>{
        ratings.delete((rating) => {
            rating.id == ratingId
        })
        WebStorage.removeRating(ratingId)
    }

    this.updateRating = (ratingId, newRating) =>  {
        console.log("updating rating")
        console.log(newRating)
        ArrayUtils.update(ratings, (rating) => { rating.id == ratingId}, newRating)
        WebStorage.updateRating(ratingId, newRating)
    }

    this.getRating = (ratingId) => {
        return ratings.find((rating) => rating.id == ratingId)
    }

    this.storeOrder = (order) => {
        orders.push(order)
        WebStorage.storeOrders([order])
        return order
    }

    this.updateOrder = (orderId, newOrder) => {
        ArrayUtils.update(orders, (order) => order.id == orderId, newOrder)
        WebStorage.updateOrder(orderId, newOrder)
    }

    this.getOrders = () => {
        return orders
    }

    this.inflateFromStorage = () => {
        rooms = WebStorage.getRooms()
        artists = WebStorage.getArtists()
        reservations = getStoredReservations()
        users = WebStorage.getUsers()
        ratings =  WebStorage.getRankings()
        orders = getStoredOrders()
    }

    this.removeReservationByCondition = (condition) => {
        const idx = reservations.findIndex(condition)
        if(idx == -1) return
        const removed = reservations.splice(idx,1)
        WebStorage.removeReservation(removed.id)
    }

    const getStoredReservations = () => {
        const reservations = WebStorage.getReservations()
        return reservations.map((reservation) => {
            return {...reservation, start: new Date(reservation.start), end: new Date(reservation.end)}
        })
    }

    const getStoredOrders = () => {
        const orders =  WebStorage.getOrders()
        return orders.map((order) => {
            return {...order, 
                updated: new Date(order.updated),
                created: new Date(order.created),
            }
        })
    }

 
    this.reset = () => {
        rooms = []
        artists = []
        reservations  = []
        users = []
        ratings = []
        reportes = []
        orders  = []
    }

}()