
export const STORAGE_JWT_KEY = "jwt_key"

export const STORAGE_ENDPOINT = "network_endpoint"

export const STORAGE_ARTIST_PROFILE = "profile_artist"

export const STORAGE_USER = "user"

export const STORAGE_ROOMOWNED = "room"

/**
 *  Esta clase nos permite guardar de manera genérica datos del usuario locales.
 *  Por ejemplo, nos va a permitir guardar el jwt token del usuario logueado, 
 *  de manera análoga a las cookies de web.
 */
export const LocalPhoneStorage = new function (){
    var cache = {}

    this.set = async function (key, value) {
       cache[key] = value
    }

    this.get = function(key) {
        return cache[key]
    }
    this.reset = function () {
        for(let key in cache) {
            cache[key] = undefined
        }
    }
}()

export const getLoggedUser = () => {
    return LocalPhoneStorage.get(STORAGE_USER)
}

export const getRoomCreated = () => {
    return LocalPhoneStorage.get(ROOM_STORAGEOWNED)
    //setear localphonestorage roomstorage
    LocalPhoneStorage.set()
}