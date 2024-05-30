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

}

export const artistService = new ArtistService()