import * as dotenv from "dotenv"
import * as express from "express"
import * as jwt from "jsonwebtoken"
import {AuthenticationException, AuthorizationException, ServerException} from "../common/exception/exception"
import {Application, Request, Response} from "express"
import * as  rateLimiter  from "express-rate-limit"
import helmet from "helmet"
import {ApiQuotaException}  from "../common/exception/exception.js"
import { UserDto } from "src/users/dto"
const cors = require("cors")
/**
 *  Acá se configuran todos los middleware globales de nuestra app.
 *  @param {Express} app
 */
export const middleware = (app: Application) => {
    app.use(express.json())
    app.use(defaultRateLimiter())
    app.use(helmet())   //Varias configuraciones de seguridad
    app.use(cors())
}


/**
 *  Rate limiter:  Limitamos la cantidad de requests que un usuario puede realizar por minuto.
 */
export function defaultRateLimiter() {
    const windowTime : number = process.env.MAX_REQUEST_WINDOW? parseInt(process.env.MAX_REQUEST_WINDOW) : 1
    const maxTimes :  number = process.env.MAX_REQUEST_NUMBER?  parseInt(process.env.MAX_REQUEST_NUMBER) : 100
    return rateLimiter.default({
        windowMs : windowTime * 1000,
        max:  maxTimes,
        handler : (req : any,res: any) =>{
            console.log(`ApiQuota exceeded for ip ${req.connection.remoteAddress}`)
            throw new ApiQuotaException(60000)
        }
    })
}

/**
 * Devuelve un middleware para limitar ciertas rutas con un menor nro de requests por minuto permitidas.
 * @param {Int} maxRequests 
 * @returns {rateLimiter.RateLimit}
 */
export const quota = (maxRequests: number) => {
    const windowTime =  process.env.MAX_REQUEST_WINDOW ? parseInt(process.env.MAX_REQUEST_WINDOW) : 1
    return rateLimiter.default({
        windowMs : windowTime * 1000,
        max: maxRequests,
        handler : (req,res) =>{
            console.log(`ApiQuota exceeded for ip ${req.connection.remoteAddress}`)
            throw new ApiQuotaException(60000)
        }
    })
} 


export const auth =  function (req : any , resp:  any, next : any) {
        console.log("auth()")
        var token = req.header("Authorization")
        if(!token) {
           console.error("Emtpy token") 
           return (new AuthenticationException()).send(resp)
            
        }
        token = token.replace("Bearer ","")
        const jwtKey =  process.env.JWT_KEY
        if(!jwtKey){
            console.error("empty jwtKey")
            const err = new ServerException()
            return err.send(resp)
        }
        try {
            const decoded = jwt.verify(token,jwtKey)
            req.user = decoded
            console.log('auth, req.user', req.user)
            next()
        } catch(error){
             return (new AuthenticationException()).send(resp)
        }

}

export const admin = function(req: any, resp: any, next: any) {
    const user: UserDto = req.user
    if(user && user.isAdmin) {
       next() 
    } else {
        return (new AuthorizationException()).send(resp)
    }
}