import { ArrayUtils } from "../utils/ArrayUtils"

const WEB_STORAGE_ROOMS = "rooms"

const WEB_STORAGE_USERS = "users"

const WEB_STORAGE_RESERVATIONS  = "reservations"

const WEB_STORAGE_RANKINGS = "rankings"

const WEB_STORAGE_ARTISTS = "artists"

const WEB_STORAGE_REPORTES = "reportes"
const WEB_STORAGE_ORDERS = "orders"

require("../utils/ArrayUtils")



export const WebStorage = new function () {
    const storage = window.localStorage

    this.storeRooms = (rooms) => {
        addToStoredArray(rooms , WEB_STORAGE_ROOMS)
    }

    this.getRooms = () => {
        return getElements(WEB_STORAGE_ROOMS)
    }

    this.storeReportes = (reportes) => {
        addToStoredArray(reportes , WEB_STORAGE_ROOMS)
    }

    this.getReportes = () => {
        return getElements(WEB_STORAGE_REPORTES)
    }

    this.storeUsers = (users) => {
        addToStoredArray(users, WEB_STORAGE_USERS)
    }

    this.getUsers = () => {
        return getElements(WEB_STORAGE_USERS)
    }

    this.storeReservations = (reservations) => {
        addToStoredArray(reservations, WEB_STORAGE_RESERVATIONS)
    }

    this.getReservations = () => {
        return getElements(WEB_STORAGE_RESERVATIONS)
    }

    this.storeRankings = (rankings) => {
        addToStoredArray(rankings, WEB_STORAGE_RANKINGS)
    }

    this.getRankings = () => {
        return getElements(WEB_STORAGE_RANKINGS)
    }

    this.storeArtists = (artists) => {
        addToStoredArray(artists, WEB_STORAGE_ARTISTS)
    }

    this.getArtists = () => {
        return getElements(WEB_STORAGE_ARTISTS)
    }

    this.removeReservation = (reservationId) => {
        const reservations = getElements(WEB_STORAGE_RESERVATIONS)
        const  idx = reservations.findIndex((reservation) => reservation.id == reservationId)
        const removed = reservations.splice(idx, 1)
        storage.setItem(WEB_STORAGE_RESERVATIONS, JSON.stringify(reservations))
        console.log("Removed reservation")
        console.log(removed)

    }

    this.removeRoom = (roomId) => {
        const rooms = getElements(WEB_STORAGE_ROOMS)
        const idx = rooms.findIndex((room) => room.id == roomId)
        rooms.splice(idx, 1)
        storage.setItem(WEB_STORAGE_ROOMS, JSON.stringify(rooms))
    }

    this.removeRating = (ratingId) => {
        const ratings = getElements(WEB_STORAGE_ARTISTS)
       ArrayUtils.delete(ratings, (rating) => rating.id == ratingId)
        storage.setItem(WEB_STORAGE_RANKINGS, JSON.stringify(ratings))
    }

    this.updateRating = (ratingId, newRating ) => {
        const ratings = getElements(WEB_STORAGE_RANKINGS)
        ArrayUtils.update(ratings, (rating) => rating.id == ratingId, newRating)
        storage.setItem(WEB_STORAGE_RANKINGS, JSON.stringify(ratings))
    }

    this.storeOrders = (orders) => {
        addToStoredArray(orders, WEB_STORAGE_ORDERS)
    }

    this.updateOrder = (orderId, newOrder) => {
        const orders = getElements(WEB_STORAGE_ORDERS)
        ArrayUtils.update(orders, (order) => order.id == orderId, newOrder)
        setElements(WEB_STORAGE_ORDERS, orders)
    }

    this.getOrders = () => {
        return getElements(WEB_STORAGE_ORDERS)
    }

    this.clear = () => {
        storage.clear()
    }

    this.downloadBackup = () => {
        const json = {}
        for(let i = 0; i < storage.length; i++) {
            const key = storage.key(i)
            json[key] = JSON.parse(storage.getItem(key))
        }
        download(JSON.stringify(json))
    }


    const download = (content) => {
        console.log("downloading backup")
        const blob = new Blob([content], {
            'type': 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'backup.json';
        a.click();
        window.URL.revokeObjectURL(url);
    }



    const  addToStoredArray = (element, key) => {
        let arr = getElements(key)
        if(Array.isArray(element)) {
            arr = arr.concat(element)
        } else {
            arr.push(element)
        }
        removeDuplicatedIds(arr)
        storage.setItem(key, JSON.stringify(arr))
    }
    

    const removeDuplicatedIds = (arr) => {
        if(arr.length < 1 ){
            return
        }
        const ids = []
        for(let i = arr.length - 1 ; i >= 0 ; i-- ){
            const elm = arr[i]
            if(!elm.id){
                continue
            }
            if(ids.indexOf(elm.id) != -1){
                arr.splice(i,1)
                removeDuplicatedIds(arr)
                return
            } else {
                ids.push(elm.id)
            } 
        }
    }

    const getElements  = (key) => {
        const json  = storage.getItem(key)
        if(!json) {
            return []
        } else {
            return JSON.parse(json)
        }
    }

    const setElements = (key, elements) => {
        storage.setItem(
            key,
            JSON.stringify(elements)
        )
    }
   
}() 