import {api} from './ApiClient'
const faker = require("faker")
import { v4 as uuid } from 'uuid'
import { MockStore } from '../mock/MockStore'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'

class ArtistService {
    async featured(number) {
        return MockStore.getArtists().slice(0,number)
    }

    async create(artist) {
        artist.id = uuid()
        return MockStore.storeArtist(artist)
    }

    async getArtist(artistId) {
        return MockStore.findArtist(artistId)
    }

    async getArtistByUserId(userId) {
        return MockStore.findArtistByUserId(userId)
    }

    async getPromedioArtista(artistId){
        const promedio = await api.get("/artistaPromedio/?id="+artistId)
        console.log('promedio opiniones artista: ', promedio)
        return promedio
    }
    getMyOpinionToArtist

    async getMyOpinionToArtist(idArtist){
        const opinion = await api.get("/salaOpinion/getMyOpinionToArtist/?idArtist="+artistId)
        console.log('mi opinion a artista: ', opinion)
        return opinion
    }

    async getPopularArtists(){
        const artistas = await api.get("/user/findPopularsArtists/")
        console.log('artistas populares: ', artistas)
        return artistas
    }

}

export const artistService = new ArtistService()