import * as service from "./service"
import * as validator from "express-validator"
import {run} from "../common/utils/run"
import {Application, Request, Response} from "express"
import {admin, auth} from "../server/middleware"
import {LoginResponseDto, LoginWithTokenDto, UserDto} from "./dto"
import {StringUtils} from "../common/utils/string_utils"
import {ArgumentsException, AuthorizationException} from "../common/exception/exception"
import {ErrorCode} from "../common/utils/constants"
import {ValidatorUtils} from "../common/utils/validator_utils"
import { dangerouslyDisableDefaultSrc } from "helmet/dist/middlewares/content-security-policy"
import { generateBarChartExample, generatePDF, generateBarChart   } from '../common/utils/generatePdf'
import { convertirMeses } from "../common/utils/mesesDiccionario"
import path from "path"
//import fs from 'fs';
const fs = require('fs-extra');

/**
 * 
 * @param {Express} app 
 */
export const route = (app: Application) => {
    /**
     *  Listamos todos los usuarios en el backend.  Esto es solo a fines de la demo
     *  Ademas nos servira para el desarrollo de los otros tickets.
     */
    app.get("/users/", 
        auth,
        admin,
        run(async (req: any, resp: Response) => {
        //NOTA: tengan cuidado de no olvidar el await. Si omitimos el await
        // la respuesta de backend sería un objeto Promise sin resolver queç
        // se serializa como {}
        const users : UserDto[] = await  service.instance.getAllUsers()
        resp.json(users)    
    }))

    app.get("/users/findByEmail/", 
        validator.query("email").notEmpty().isEmail().withMessage(ErrorCode.INVALID),
        run(async (req: Request,resp: Response) => {  
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            //TODO  : 
            // retornar json de objeto User segun un id pasado 
            // ej : {"id" : "124", "name":  "Zahi" , "last_name": }
            const email = req.query.email as string
            const users : UserDto = await  service.instance.findUserByEmail(email)
            resp.json(users) 
    }))
    app.get("/user/findUserbyId/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const users : UserDto = await  service.instance.findUserById(id)
        resp.json(users) 
     }))

     app.put("/users/update/",
        auth,
        validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async (req: Request,resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body
            const id = req.query.id as string
            const userOriginal : UserDto = await  service.instance.findUserById(id)
            if (!dto["name"]) {
                dto["name"] = userOriginal["name"];
            }
            if (!dto["last_name"]) {
                 dto["last_name"] = userOriginal["last_name"];
            }
            if (!dto["email"]) {
                 dto["email"] = userOriginal["email"];
            }
            if (!dto["enabled"]) {
                dto["enabled"] = userOriginal["enabled"];
            }
            if (!dto["password"]) {
                dto["password"] = userOriginal["password"];
            }
            if (!dto["createdAt"]) {
                dto["createdAt"] = userOriginal["createdAt"];
            }   
            if (!dto["idPerfil"]) {
                dto["idPerfil"] = userOriginal["idPerfil"];
            } 
            if (!dto["idSalaDeEnsayo"]) {
                dto["idSalaDeEnsayo"] = userOriginal["idSalaDeEnsayo"];
            } 
            if (!dto["createdAt"]) {
                dto["createdAt"] = userOriginal["createdAt"];
            } 
            if (!dto["estadoUsuario"]) {
                dto["estadoUsuario"] = userOriginal["estadoUsuario"];
            } 
            if (!dto["userType"]) {
                dto["userType"] = userOriginal["userType"];
            } 
            if (!dto["tipoArtista"]) {
                dto["tipoArtista"] = userOriginal["tipoArtista"];
            } 
            console.log(" ruta update user, baja:? ", dto["enabled"])
            console.log('idPerfil: ', dto["idPerfil"])
            const user = await service.instance.updateUser(id,{
                name: dto["name"],
                last_name: dto["last_name"],
                email: dto["email"],
                password: dto["password"],
                enabled: dto["enabled"],
                idPerfil: dto["idPerfil"],
                idArtistType: dto["idArtistType"],
                idArtistStyle: dto["idArtistStyle"],
                image_id: undefined,
                userType: dto["userType"],
                idSalaDeEnsayo: dto["idSalaDeEnsayo"],
                tipoArtista: dto['tipoArtista']
            })
            resp.json(user)
        })
     )
     app.post("/users/updatePassword/",
        validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async (req: Request,resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }

            const dto = req.body
            const id = req.query.id as string
            const user = await service.instance.updatePassword(id,{
                name: dto["name"],
                last_name: dto["last_name"],
                email: dto["email"],
                password: dto["password"],
                image_id: undefined,
                idArtistType: dto["idArtistType"],
                idArtistStyle: dto["idArtistStyle"],
                idPerfil: dto["idPerfil"],
                enabled: dto["enabled"],
                userType: dto["userType"],
                idSalaDeEnsayo: dto["idSalaDeEnsayo"],
                tipoArtista: dto['tipoArtista']
            })
            resp.json(user)
     }))
     
     app.post("/users/", 
            validator.body("name").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
            validator.body("last_name").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
            validator.body("password").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED)
                    .isLength({min: 8}).withMessage(ErrorCode.PASSWORD_TOO_SHORT),
            validator.body("email").isEmail().withMessage(ErrorCode.INVALID),
            //validator.body("userType").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
            validator.body("idPerfil").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),

            run(async (req: Request, resp: Response) =>{
                const errors = validator.validationResult(req)
                if(errors && !errors.isEmpty()){
                    throw ValidatorUtils.toArgumentsException(errors.array())
                }
                const dto = req.body
                console.log(dto.idPerfil)
                const user = await service.instance.createUser({
                    name: dto["name"],
                    last_name: dto["last_name"],
                    email: dto["email"],
                    password: dto["password"],
                    idPerfil: dto["idPerfil"],
                    idArtistType: dto["idArtistType"],
                    idArtistStyle: dto["idArtistStyle"],
                    image_id: undefined,
                    enabled: dto["enabled"],
                    userType: dto["userType"],
                    idSalaDeEnsayo: dto["idSalaDeEnsayo"],
                    tipoArtista: dto['tipoArtista']
                })
                resp.json( )    
             }
         )
     )
     app.post("/users2/", 
     validator.body("name").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
     validator.body("last_name").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
     validator.body("password").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED)
             .isLength({min: 8}).withMessage(ErrorCode.PASSWORD_TOO_SHORT),
     validator.body("email").isEmail().withMessage(ErrorCode.INVALID),
     run(async (req: Request, resp: Response) =>{
         const errors = validator.validationResult(req)
         if(errors && !errors.isEmpty()){
             throw ValidatorUtils.toArgumentsException(errors.array())
         }
         const dto = req.body
         const user = await service.instance.createUser2({
             name: dto["name"],
             last_name: dto["last_name"],
             email: dto["email"],
             password: dto["password"],
            //  idPerfil: dto["idPerfil"],
            //  idArtistType: dto["idArtistType"],
            //  idArtistStyle: dto["idArtistStyle"],
             image_id: undefined
         })
         resp.json(user)    
      }
  )
)
     app.post("/auth", 
        validator.body("email").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("password").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: Request, resp: Response) => {
         // https://dev.to/jahangeer/node-js-api-authentication-with-jwt-json-web-token-auth-middleware-ggm
         // autenticar a un usuario a partir de un email y password.
         // retornar jwt token para el usuario creado.
         const errors = validator.validationResult(req)
          if(errors && !errors.isEmpty()){
            throw ValidatorUtils.toArgumentsException(errors.array())
         }
         const loginResponse = await service.instance.login(req.body.email, req.body.password)
         resp.json(loginResponse)
     }))

     app.get("/users/me",
        auth,
        run(async (req: any, resp : Response) => {
            const logged : UserDto = req.user 
            const user: UserDto = await service.instance.findUserById(logged.id)
            resp.json(user)
        })
     )

     app.post("/auth/create_token", run(async(req: Request, resp: Response) => {
         const tokenDto: LoginWithTokenDto = await service.instance.resetPassword(req.body.email)
         resp.json(tokenDto)
     }))

     
     app.post("/auth/token", run(async(req: Request, resp: Response) => {
        const tokenDto: LoginResponseDto = await service.instance.loginWithToken(req.body.email, req.body.token)
        resp.json(tokenDto)
    }))


    // reportes de usuario

    app.post("/users/reportesNuevosUsers", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            const NewUsersReport = await  service.instance.obtenerCantidadDocumentosPorMes(dto.fechaI, dto.fechaH)
            
            resp.json(NewUsersReport)    
    }))

    app.post("/users/reportesNuevosArtistas/", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            console.log('dto fechas I y H: ', dto)
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            const NewUsersReport = await  service.instance.obtenerArtistasNuevosPorMes(dto.fechaI, dto.fechaH)
            
            resp.json(NewUsersReport)    
    }))

    app.post("/users/reportesUsuariosActivos", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            const NewUsersReport = await  service.instance.obtenerUsuariosActivosPorMes(dto.fechaI, dto.fechaH)
            
            resp.json(NewUsersReport)    
    }))

    app.post("/users/reportesUsuariosBaja", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            
            const NewUsersReport = await  service.instance.obtenerUsuariosBajaPorMes(dto.fechaI, dto.fechaH)
            
            resp.json(NewUsersReport)    
    }))

    //Reporte: contar cantidad de usuarios que alquilan sala de ensayo
    app.post("/users/reportesPropietariosAlquilan", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            
            const NewUsersReport = await  service.instance.propietariosAlquilanSala2(dto.fechaI, dto.fechaH)
            
            resp.json(NewUsersReport)    
    }))

    //Reporte: contar cantidad de usuarios que alquilan sala de ensayo con enlace de descarga pdf
    app.get("/users/reportesPropietariosAlquilanPdf", 
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte nuevos usuarios")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            
            const NewUsersReport = await  service.instance.propietariosAlquilanSala(dto.fechaI, dto.fechaH)
            console.log('ruta:', NewUsersReport)

            //armar dos array uno con mes y otro con cantidad
            let arrMeses : string[]= []
            let arrCantidades : number[] = []
            NewUsersReport.forEach(item => {
                // meses esta designado con el nro de mes q le corresponde
                arrMeses.push(item.mes);
                arrCantidades.push(item.cantidad);
            });
            console.log('NewUsersReport:', NewUsersReport)

            //newUserReports  es un arreglo de objects 
            //resultados: { año: number, mes: number, cantidad: number }
            
            //convierto array de numeros a array de string, que contiene los meses
            const mesesString = convertirMeses(arrMeses)
            //codigo typescript
            // //crear chart
            // const { barChart, pieChart } = await createCharts(mesesString, arrCantidades);
            
            // // Generar el PDF
            // const pdfBytes = await generatePDF(mesesString, arrCantidades);

            // // Guardar el PDF en un archivo
            // const fileName = 'graficos.pdf';
            // await fs.promises.writeFile(fileName, pdfBytes);

            // // Devolver la URL de descarga
            // const downloadUrl = `${req.protocol}://${req.get('host')}/${fileName}`;

            // resp.json({NewUsersReport, downloadUrl})    
            
            
            //Codigo Javascript :
            const chartImage = await generateBarChartExample(mesesString, arrCantidades); // Generar el gráfico de barras
            //const chartImageBasic = await generateBarChart(mesesString, arrCantidades); // Generar el gráfico de barras
            const pdfBytes = await generatePDF(chartImage); // Generar el PDF con el gráfico
    
            const pdfPath = '/generated.pdf'; // Ruta donde se guardará el archivo PDF
            //await fs.writeFile(pdfPath, pdfBytes); // Guardar el PDF en el servidor
            
            // const imageUrl2 = `/public/${pdfPath}`
            // const fileUrl = `${req.protocol}://${req.get('host')}/generated.pdf`; // Obtener la URL del archivo PDF
            const directorioPDF = path.join(__dirname, './generated.pdf');
            console.log(directorioPDF)
            
            // crear nombre de archivo irrepetible
            const currentDate = new Date().toISOString().replace(/:/g, '-');
            const rutaPdf = `report_${currentDate}.pdf`
            
            await fs.writeFile( `E:/Usuarios/matti/Escritorio/pdf_soundroom/${rutaPdf}`, pdfBytes); // Guardar el PDF en el servidor
            
            resp.json({NewUsersReport, directorioPDF}) 
    }))

}