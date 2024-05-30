
import { WebStorage } from "../storage/WebStorage"
import {Factory} from "./Factory"
import { MockStore } from "./MockStore"

const configs = {
    roomsNumber: 50,
    artistsNumber: 100,
}

/**
 *  Creamos los datos truchos , configurando la cantidad de habitaciones como de artistas.
 *  Esto se hace al iniciar la applicación.
 */
export const seed = async () => {
    if(WebStorage.getRooms().length) {
        MockStore.inflateFromStorage()
        return
    }
    MockStore.reset()
    for(let i = 0; i< configs.artistsNumber; i++) {
        Factory.createArtist()
    }

    await Factory.createRooms(configs.roomsNumber)

    MockStore.getRooms().forEach((room, idx, arr) => {
        Factory.createRatingsForRoom(room.id)
        Factory.createReservationsForRoom(room)
    })
    MockStore.getArtists().forEach((artist, idx, arr) => {
        Factory.createRatingsForArtist(artist.user.id)
    })
}