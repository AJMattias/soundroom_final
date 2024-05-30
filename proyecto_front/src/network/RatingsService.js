import { MockStore } from "../mock/MockStore";
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage";
import {v4 as uuid} from 'uuid'


class RatingsService {
    async getMyRatingsForOtherId(otherId) {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        return MockStore.getRatings().filter(
            (rating) => rating.otherId == otherId && rating.user.id == user.id
        )[0]
    }

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
        const opinion_created =  await api.post("salasdeensayo/createOpinion/", {
            id:otherId,
            descripcion: rating.comment,
            estrellas: rating.score
        })
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