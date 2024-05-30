import axios from  "axios"
import {LocalPhoneStorage, STORAGE_JWT_KEY} from "../storage/LocalStorage"
import {getBaseUrl} from "../network/Endpoints"
import { ApiException } from "../exception/ApiException"
import { convertIsoDates} from "../helpers/dateHelper"

/**
 * Este interceptor de las llamadas agrega el token jwt en las cabeceras.
 * De esta forma, y usando el middleware auth de Express, podemos acceder al usuario logeado.
 * 
 * También, cuando no hay internet, envía un ApiException con código 0.
 */
axios.interceptors.request.use(
    (config) => {
        config.headers.common['Content-Type'] = 'application/json'
        const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
        if(!jwt) {
            console.log("No JWT header")
            return config
        }
        config.headers.common.Authorization = "Bearer "+jwt
        return config 
    }, (error) => {
        console.error("Request error: ")
        console.error(error)
        return Promise.reject(
            new ApiException(
                0, "NO_INTERNET", "No hay conexion a Internet", undefined
            )
        )
    }
)

/**
 *  Este interceptor captura los errores del backend y los convierte en un ApiException
 *  para que podamos manejarlos cómodamente.
 */
axios.interceptors.response.use(
    (response) => {
        return Promise.resolve(convertIsoDates(response.data))
    },
    (error) => { 
        console.error("Response error:")
        console.log(error)
        console.log(error.response)
        const ex = new ApiException(
            error.response.status,
            error.response.data.error,
            error.response.data.errorCode,
            error.response.data.message,
            error.response.data.arguments
        )
        return Promise.reject(ex)
    }
)



/**
 * Transforma la url relativa que ingresamos en una URL absoluta que tenemos que usar.
 * Por ej , si hacemos transformUrl("/users") devuelve "http://localhost:3000/users"
 * @param {String} path el path relativo , que son las routes de Express.
 */
function transformUrl(path) {
   if(path[0] == "/") {
       path = path.substring(1)
   }
   return getBaseUrl()+"/"+path
}

/**
 *  Esta es la api que tenemos que utilizar para las llamadas de red. 
 *  Internamente maneja la sesión del usuario y los errores.
 * 
 *  Ejemplo:
 *   const user = await api.get("users/me")
 */
export const api = {

    get: async function(path) {
        return await axios.get(
            transformUrl(path)
        )
    },

    post: async function(path, body) {
    return await axios.post(
        transformUrl(path),
        body
        )
    },

    put: async function(path, body) {
        return await axios.put(
            transformUrl(path),
            body
        )
    },

    delete: async function(path) {
        return await axios.delete(
            transformUrl(path)
        )
    }

}

export const externalApi = {
    get: async function (url)  {
        return await axios.get(url)
    },

    post: async function (url, body) {
        return await axios.post(url, body)
    }

}