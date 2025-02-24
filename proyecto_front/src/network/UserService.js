
import {api} from './ApiClient'
import { getNewPasswordStatus, LocalPhoneStorage, setNewPasswordStatus, setPasswordChangeFalse, setPasswordChangeTrue, setTokenLocalStorage, STORAGE_JWT_KEY, STORAGE_USER, toggleNewPassword } from '../storage/LocalStorage'
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
        idPerfil,
        tipoArtista,
        password
    ) {
        const user =  await api.put("/users/update/?id="+userId, {
                email: email,
                name: name,
                last_name: lastName,
                enabled: enabled,
                idPerfil: idPerfil,
                tipoArtista: tipoArtista,
                password: password
            }
        )
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async habilitarUser(
        userId,
        email,
        name,
        lastName,
        enabled
    ) {
        const user =  await api.put("/users/changeUserState/?id="+userId, {
                email: email,
                name: name,
                last_name: lastName,
                enabled: enabled
            }
        )
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async hacerAdmin(
        userId
        
    ) {
        const user =  await api.put("/users/setAdmin/?id="+userId)
        await LocalPhoneStorage.set("user", user)
        return user
    }

    async deshacerAdmin(
        userId
        
    ) {
        const user =  await api.put("/users/unsetAdmin/?id="+userId)
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
        const user =  await api.put("/users/changeUserState/?id="+userId, {
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

    async getUsersUA (){
        let users = undefined
        try {
            users = await api.get("/usersUA/")
        } catch (ignored) {}
        return users
    }

    async getUser(userId) {
        return await merger.get(
            `/user/findUserbyId/?id=${userId}`,
            () =>  MockStore.findUser(userId) 
        )
    }

    async getUserBd(userId){
        let user = undefined
        try {
            user = await api.get('/user/findUserbyId/?id='+userId)
        } catch (ignored) {
        }
        return user
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
        //mio
        if(loginResponse.error){
            return loginResponse.msg
        }
        //original:
        if(loginResponse.token) {
            console.log("Got token")
            console.log(loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_JWT_KEY, loginResponse.token)
            await LocalPhoneStorage.set(STORAGE_USER, loginResponse.user)
        }
        return loginResponse.user
    }

    //recuperar password por link al mail
    async resetPassword (email){
        const resetPassword = await api.post("/user/forgot-password",{
        email: email
        })
        const data= resetPassword
        console.log('reset password link: ', data)
        if(data.resetLink){
            //toggleNewPassword()
            setPasswordChangeTrue()
            setTokenLocalStorage(data.token)
        }
        console.log(getNewPasswordStatus())
        return resetPassword
    }

    async changePassword(token, password){
        try {
            const changedPassword = await api.post(`/reset-password/${token}`, {
                newPassword: password,
            });
            if (changedPassword.token) {
                console.log("Got token");
                console.log(changedPassword.token);
                await LocalPhoneStorage.set(STORAGE_JWT_KEY, changedPassword.token);
                await LocalPhoneStorage.set(STORAGE_USER, changedPassword.user);
                setPasswordChangeFalse();
            }
            return changedPassword; // Devuelve la respuesta completa
        } catch (error) {
            console.error("Error changing password:", error);
            return null; // O un valor que indique un error
        }
    }
    
}

export const userService = new UserService()