
import {api} from './ApiClient'
import { LocalPhoneStorage, STORAGE_JWT_KEY, STORAGE_USER } from '../storage/LocalStorage'
import { MockStore } from '../mock/MockStore'
import { ApiException } from "../exception/ApiException"
import { merger } from '../mock/MockMerger'

class UserService {
    /**
     *  Loguea al usuario y almacena el token JWT.
     * @param {String} email 
     * @param {String} password 
     */
    async login(email, password) {
        const loginResponse = await api.post("auth",
            {
                email: email,
                password: password
            }
        )
        console.log("Login response:")
        console.log(loginResponse)
        if(loginResponse.token) {
            console.log("Got token")
            console.log(loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_JWT_KEY, loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_USER, loginResponse.user)
        }
        return loginResponse.user
    }
    async backupBD() {
        const backup = await api.put("/configuraciones/backup")
        return backup

    }

    async backupBDLoad() {
        const backup = await api.put("/configuraciones/backupLoad")
        return backup

    }


    async me() {
        const user =  await api.get("users/me")
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async register(
        email,
        name,
        lastName,
        password,
        idPerfil
    ) {
        return await api.post("users", {
            email: email,
            name: name,
            last_name: lastName,
            password: password,
            idPerfil:idPerfil
        })
    }

    async registerSr(
        email,
        name,
        lastName,
        password,
        idPerfil
    ) {
        const user = await api.post("users", {
            email: email,
            name: name,
            last_name: lastName,
            password: password,
            idPerfil:idPerfil
        })
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async update(
        userId,
        email,
        name,
        lastName,
        enabled,
        idPerfil
    ) {
        const user =  await api.put("/users/update/?id="+userId, {
                email: email,
                name: name,
                last_name: lastName,
                enabled: enabled,
                idPerfil: idPerfil,
            }
        )
        await LocalPhoneStorage.set("user", user)
        return user
    }
    async deshabilitarUser(
        userId,
        email,
        name,
        lastName,
        enabled
    ) {
        const user =  await api.put("/users/update/?id="+userId, {
                email: email,
                name: name,
                last_name: lastName,
                enabled: enabled
            }
        )
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async getUsers (){
        let users = undefined
        try {
            users = await api.get("/users/")
        } catch (ignored) {}
        return users
    }

    async getUser(userId) {
        return await merger.get(
            `/user/findUserbyId/?id=${userId}`,
            () =>  MockStore.findUser(userId) 
        )
    }

    //getUser to db
    async getUserDb (userId){
        let user
        try {
            user = await api.get(`/user/findUserbyId/?id=${userId}`)
        } catch (ignored) {}
        return user
    }

    async forgotPassword(email) {
       const tokenResponse = await api.post("/auth/create_token" , {
           email: email
       })
       return tokenResponse.token
    }

    async loginWithCode(email, code) {
        const loginResponse = await api.post("/auth/token", 
            {
                email: email, 
                token: code
            }
        )
        if(loginResponse.token) {
            console.log("Got token")
            console.log(loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_JWT_KEY, loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_USER, loginResponse.user)
        }
        return loginResponse.user
        
    }
}

export const userService = new UserService()