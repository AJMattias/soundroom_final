import { MockStore } from "../mock/MockStore";
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage";
import {v4 as uuid} from 'uuid'
import {api} from './ApiClient'


class RatingsService {
    // buscar opiniones para la sala otherId con mi id de usuario q reservo
    async getMyRatingsForOtherId(otherId) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return MockStore.getRatings().filter(
            (rating) => rating.otherId == otherId && rating.user.id == user.id
        )[0]
    }

    //buscar opiniones padera la sala de ensayo
    async getRatingsForOtherId(otherId) {
        return MockStore.getRatings().filter(
            (rating) => rating.otherId == otherId
        )
    }

    async createRating(rating, otherId) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        rating.id = uuid()
        rating.otherId = otherId
        rating.user = user
        MockStore.storeRatings([
            rating
        ])
        
    }
    
    async createOpinion(rating, otherId){
        const opinion_created =  await api.post("salasdeensayo/createOpinion/?idRoom="+otherId, {
            idRoom :otherId,
            descripcion: rating.comment,
            estrellas: rating.score
        })
        return opinion_created
    }

    async getRoomOpinions (roomId){
        //const opinions = await api.get("/salaOpiniones/?id="+roomId)
        //nueva formade buscar opiniones a saladeensayo
        const opinions = await api.get("/salaOpinionesdos/?id="+roomId)
        console.log('front service get room opinions: ', opinions)
        return opinions
    }

    // buscar opiniones para la sala otherId con mi id de usuario q reservo
    async getMyRatingsForOtherIdBd(otherId) {
        //const user = LocalPhoneStorage.get(STORAGE_USER)
        const opinion = await api.get("/salaOpinion/getMyOpinionToRoom/?idRoom="+otherId)
        console.log('Opinion fetcheada: ', opinion)
        return opinion
    
    }

    async updateRatingBd(ratingId, opinion) {
        const rating = await api.put("/salasdeensayo/updateOpinion/?id="+ratingId,{
            descripcion: opinion.comment,
            estrellas: opinion.score
        })
        
    }

     async createCommet(idRoom, descripcion, estrellas){
        const comment = await api.post("/salasdeensayo/createOpinion/")
        console.log("front comment service, opinion created: ", comment )
        return comment
    }

    // geto opiniones a artista
    async getArtistOpinions (artistId){
        const opiniones = await api.get("/opinionToArtista/?id="+artistId)
        return opiniones
    }

    async updateRating(ratingId, newRating) {
        const rating = MockStore.getRating(ratingId)
        if(rating) {
            rating.comment = newRating.comment
            rating.score = newRating.score
        }
        MockStore.updateRating(ratingId, rating)
    }

    

    async deleteRating(ratingId) {
        MockStore.removeRating(ratingId)
    }
}

export const ratingsService = new RatingsService()