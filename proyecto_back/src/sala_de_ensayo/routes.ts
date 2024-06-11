import * as service from "./service"
import * as validator from "express-validator"
import { run } from "../common/utils/run";
import { Application, Request, Response } from "express";
import * as dao from "./dao"
import { OpinionDto, SalaDeEnsayoDto} from "./dto";
import {StringUtils} from "../common/utils/string_utils"
import {ArgumentsException} from "../common/exception/exception"
import {ErrorCode} from "../common/utils/constants"
import { Opinion, OpinionModel, SalaDeEnsayo, SalaDeEnsayoModel } from "./model";
import {ValidatorUtils} from "../common/utils/validator_utils"
import multer from "../common/utils/storage";
import  * as imageService from "../imagen/service"
import { admin, auth } from "../server/middleware";
import { UserDto } from "src/users/dto";
import * as userService from "../users/service"


/**
 * 
 * @param {express} app 
 */

export const route = (app: Application) => {

    app.get("/salasdeensayo/", run(async (req: Request, resp: Response) => {
        const salas : SalaDeEnsayoDto[] = await  service.instance.getAll()
       resp.json(salas)    
    }))

    app.get("/salasdeensayo/findOne/",
        run(async (req:Request, resp: Response) => {
            const id = req.query.id as string
            const sala : SalaDeEnsayoDto = await service.instance.findSalaById(id);
            
            // const opinionesIds = sala.opiniones;
            // const opiniones = await OpinionModel.find({ _id: { $in: opinionesIds } });

            // const totalEstrellas = opiniones.reduce((total, opinion) => total + opinion.estrellas, 0);
            // const promedio = totalEstrellas / opiniones.length;
            // let salaResp={
            //     sala: sala,
            //     promedioEstrellas: promedio
            // }
            // if (opiniones.length === 0) {
            //     salaResp.promedioEstrellas = 0
            //   } else {
            //     salaResp.promedioEstrellas = promedio
            //   }
            // console.log(sala)
            
            resp.json(sala)
    }))
    /*
    app.get("/salasdeensayo/find", run(async (req: Request, resp: Response) => {
        const salas: SalaDeEnsayoDto[] = await dao.instance.finsdByName(req.query.q as string)
        resp.json(salas)    
    }))
   */
    app.get("/salasdeensayo/findByName/", run(async (req: Request, resp: Response) => {
        const busqueda = req.query.q
        console.log('req.query.q: ', req.query.q)
        console.log(busqueda)
        const salas : SalaDeEnsayoDto[] = await service.instance.findByName(req.query.q as string)
        resp.json(salas)    
    }))
    

    //TODO findbyOwner
    app.get("/salasdeensayo/findByOwner/", 
        run(async (req: Request, resp: Response) => {
            const id = req.query.id as string
            const salas : SalaDeEnsayoDto[] = await service.instance.findSalaByOwner(id)
            resp.json(salas)    
    }))


    app.get("/salasdeensayo/search/", 
    validator.body("idType").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("idLocality").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    run(async (req: Request, resp: Response) => {
        console.log("routes llega")
        const dto = req.body
        const salas : SalaDeEnsayoDto[] = await  service.instance.getSearch({        
            nameSalaEnsayo: dto["nameSalaDeEnsayo"],
            calleDireccion: dto["calleDireccion"],
            //numeroDireccion: dto["numeroDireccion"],
            //idLocality: dto["idLocality"],
            idType: dto["idType"],
            precioHora: dto["precioHora"],
            idOwner: dto["idOwner"],
            duracionTurno: dto["duracionTiempo"],
            descripcion: dto["descripcion"]
        })
        resp.json(salas)    
    }))
    

   app.post('/email/',
   validator.body("receptor").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
   validator.body("sala").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
   validator.body("inicio").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
       run(async (req: Request, resp: Response) => {
           const dto = req.body
           var Email = require('../server/MailCtrl');
           const mailOptions = {
                    from: 'proyectofinal2021mmaa@gmail.com',
                    to: dto["receptor"],
                    subject: "Cancelacion de la sala " + dto["sala"],
                    html:'<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">'+"Usted acaba de cancelar su turno en la sala de ensayo " + dto["sala"] + " del dia " + dto["inicio"] + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
                    text: "Usted acaba de cancelar su turno en la sala de ensayo " + dto["sala"] + " del dia " + dto["inicio"]
              };
           Email.sendEmail(mailOptions);
           resp.json("envio exitoso");
       })
    )

    app.post('/emailReserva/',
        validator.body("receptorCliente").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("sala").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("inicio").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async (req: Request, resp: Response) => {
            const dto = req.body
            var Email = require('../server/MailCtrl');
            const mailOptionsCliente = {
                from: 'proyectofinal2021mmaa@gmail.com',
                to: dto["receptorCliente"],
                subject: "Reserva de la sala " + dto["sala"],
                html: '<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">' + "Usted acaba de realizar una reserva en la sala de ensayo " + dto["sala"] + " el dia " + dto["inicio"] + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
                text: "Usted acaba de realizar una reserva en la sala de ensayo " + dto["sala"] + " el dia " + dto["inicio"]
            };
            Email.sendEmail(mailOptionsCliente);
            if (dto["receptorSala"]!= "") {
                const mailOptionsDueno = {
                    from: 'proyectofinal2021mmaa@gmail.com',
                    to: dto["receptorSala"],
                    subject: "Realizacion de reserva de la sala " + dto["sala"],
                    html: '<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">' + "Han realizado una reserva para su sala  " + dto["sala"] + " el dia " + dto["inicio"] + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
                    text: "Han realizado una reserva para su sala  " + dto["sala"] + " el dia " + dto["inicio"]
                };
                Email.sendEmail(mailOptionsDueno);
            };
            
            resp.json("envio exitoso");
        })
    )
   app.post('/emailOwner/',
   validator.body("receptor").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
   validator.body("sala").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
   validator.body("inicio").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
   validator.body("nombreUsuario").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
       run(async (req: Request, resp: Response) => {
           const dto = req.body
           var Email = require('../server/MailCtrl');
           const mailOptions = {
                    from: 'soundroomapp@gmail.com',
                    //from: process.env.EMAIL
                    to: dto["receptor"],
                    subject: "Cancelacion de la sala " + dto["sala"],
                    html:'<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">'+"El usuario " + dto["nombreUsuario"] + " ha cancelado la reserva de la sala "+ dto["sala"] + " del dia " + dto["inicio"] + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
                    text: "El usuario " + dto["nombreUsuario"] + " ha cancelado la reserva de la sala "+ dto["sala"] + " del dia " + dto["inicio"]
              };
           Email.sendEmail(mailOptions);
           resp.json("envio exitoso");
       })
   )



    app.post("/salasdeensayo/", 
    auth,
    validator.body("nameSalaDeEnsayo").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("calleDireccion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    // validator.body("numeroDireccion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    //validator.body("duracionTiempo").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("idType").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("descripcion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("precioHora").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    //validator.body("idLocality").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        
        run(async ( req: any, resp: Response) =>{
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body
            //obtener usuario logueado con:
            const logged : UserDto = req.user 
            const user: UserDto = await userService.instance.findUserById(logged.id)
            //console.log(user)
            //console.log(user.id)
            

            //create  sala de ensayo
            const sala = await service.instance.createSalaDeEnsayo({
                nameSalaEnsayo: dto["nameSalaDeEnsayo"],
                calleDireccion: dto["calleDireccion"],
                precioHora: dto["precioHora"],
                idType: dto["idType"],
                idOwner: user.id,
                duracionTurno: dto["duracionTurno"],
                descripcion: dto["descripcion"],
                comodidades: dto["comodidades"]
                //numeroDireccion: dto["numeroDireccion"],
                //idLocality: dto["idLocality"],
                
            })
            //añadir sala creado al array idSalaDeEnsayo de User
            const idSala = sala.id
            const userUpdate = await userService.instance.updateAddSala(user.id, {
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                password: user.password,
                idPerfil: user.idPerfil,
                idArtistType: user.idArtistType,
                idArtistStyle: user.idArtistStyle,
                image_id: undefined,
                enabled: user.enabled,
                userType: user.userType,
                idSalaDeEnsayo: idSala
            })

           // copiar a perfil con usuario
            resp.json(sala)
        
          }
        ) 
    )  

    //endpint with 1 image
    app.post("/salasdeensayo_imagen/", multer.single('img'),
    validator.body("nameSalaDeEnsayo").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("calleDireccion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("numeroDireccion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("precioHora").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    validator.body("idType").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    //validator.body("idLocality").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        
        run(async ( req: Request, resp: Response) =>{
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body
            //guardo imagen
            const titulo = dto["titulo"]
            const descripcion = dto["descripcionImg"]
            const imageUrl = req.file?.path as string
            const newImagen = {
                titulo: titulo,
                descripcion: descripcion, 
                url: imageUrl
            };
            console.log("route image ", newImagen)
            const newurl = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${req.file?.filename}`
            console.log(newurl)
            console.log("image name: ", req.file?.filename);
            const imagen = await imageService.instance.createImagen(newImagen) 
            console.log("id imagen: ", imagen.id)
            //guardo sala de ensayo con el id de la imagen
            const sala = await service.instance.createSalaDeEnsayo({
                nameSalaEnsayo: dto["nameSalaDeEnsayo"],
                calleDireccion: dto["calleDireccion"],
                //numeroDireccion: dto["numeroDireccion"],
                //idLocality: dto["idLocality"],
                precioHora: dto["precioHora"],
                idImagen: imagen.id,
                idType: dto["idType"],
                idOwner: dto["idOwner"],
                duracionTurno: dto["duracionturno"],
                descripcion: dto["descripcion"],
                comodidades: dto["comodidades"]
            })
            resp.json(sala)
          }
        ) 
    )

    app.put("/salasdeensayo/update/", 
    validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    run( async(req: Request, resp: Response) => {
        const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body
            const id = req.query.id as string
            const salaOriginal : SalaDeEnsayoDto = await service.instance.findSalaById(id)
            if(!dto["nameSalaEnsayo"]){
                dto["nameSalaEnsayo"] = salaOriginal["nameSalaEnsayo"];
            }
            if(!dto["calleDireccion"]){
                dto["calleDireccion"] = salaOriginal["calleDireccion"];
            }
            if(!dto["numeroDireccion"]){
                dto["numeroDireccion"] = salaOriginal["numeroDireccion"];
            }
            if(!dto["precioHora"]){
                dto["precioHora"] = salaOriginal["precioHora"];
            }
            if(!dto["duracionTurno"]){
                dto["duracionTurno"] = salaOriginal["duracionTurno"];
            }
            if(!dto["descripcion"]){
                dto["descripcion"] = salaOriginal["descripcion"];
            }
            if(!dto["comodidades"]){
                dto["comodidades"] = salaOriginal["comodidades"];
            }
            console.log('ruta update sala: ', dto)
            const sala = await service.instance.updateSalaDeEnsayo(id,{
                nameSalaEnsayo: dto["nameSalaEnsayo"],
                calleDireccion: dto["calleDireccion"],
                numeroDireccion: dto["numeroDireccion"],
                duracionTurno: dto["duracionTurno"],
                precioHora: dto["precioHora"],
                comodidades: dto["comodidades"],
                descripcion: dto["descripcion"]
            })
            resp.json(sala)
        })
    )
        
    app.post("/salasdeensayo/reportesNuevasSdE", 
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
            const NewUsersReport = await  service.instance.obtenerCantidadNuevasSdEPorMes(dto.fechaI, dto.fechaH)
            
        resp.json(NewUsersReport)    
        })
    )

    app.post("/salasdeensayo/createOpinion/",
        auth,
        validator.query("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("descripcion").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("estrellas").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run( async(req: any, resp: Response) => {
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body
            const idRoom = req.query.idRoom as string
            console.log('ruta create Pinion idRoom: ', idRoom)
            console.log('ruta create opinion, idUser: ', req.user.id)

            //obtener usuario logueado con:
            const logged : UserDto = req.user 
            const user: UserDto = await userService.instance.findUserById(logged.id)
            //create opinion
            const opinion = await service.instance.createOpinion({
                descripcion: dto["descripcion"],
                estrellas: dto["estrellas"] ,
                idUser: user.id,
                idRoom: idRoom,
            })
            console.log('Ruta, opinion creada: ', opinion)
            if(!opinion){
                resp.json("No se pude crear la opinon, intentalo de nuevo mas tarde")
            }
            const salaOriginal : SalaDeEnsayoDto = await service.instance.findSalaById(idRoom);
            console.log('ruta sala encontrada original', salaOriginal)   
            
            //update sala con la opinion
            console.log('ruta opinion: ',opinion)
            let sala = await service.instance.updateSalaDeEnsayoOpinion(idRoom,{
                nameSalaEnsayo: salaOriginal["nameSalaEnsayo"],
                calleDireccion: salaOriginal["calleDireccion"],
                numeroDireccion: salaOriginal["numeroDireccion"],
                precioHora: salaOriginal["precioHora"],
                opiniones: opinion.id
            })
            // realizar calculos de promedio luego de crear la opinion
            const salaUpdated : SalaDeEnsayoDto = await service.instance.findSalaById(idRoom);
            const opinionesIds = salaUpdated.opiniones;
            const opiniones = await OpinionModel.find({ _id: { $in: opinionesIds } });

            const totalEstrellas = opiniones.reduce((total, opinion) => total + opinion.estrellas, 0);
            const promedio = totalEstrellas / opiniones.length;
            const nameSala = salaOriginal.nameSalaEnsayo
            console.log('ruta, sala actualizada con opinion', salaOriginal)
            console.log('nombre de sala', nameSala)
            let salaResp={
                sala: salaUpdated,
                promedioEstrellas: promedio
            }
            resp.json(salaResp)

        
        })
    )

    //TODO update opinion
    app.put("/saladeensayo/updateOpinion/",
        auth,
        validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async (req: any, resp: Response) =>{
            const errors = validator.validationResult(req)
                if(errors && !errors.isEmpty()){
                    throw ValidatorUtils.toArgumentsException(errors.array())
                }
            const dto = req.body
            const id = req.query.id as string
            console.log("ruta update Opinion: ", dto)
            const opinionOriginal: OpinionDto = await service.instance.getOpinionById(id)
            if(!dto["descripcion"]){
                dto["descripcion"] = opinionOriginal["descripcion"];
            }
            if(!dto["estrellas"]){
                dto["estrellas"] = opinionOriginal["estrellas"];
            }
            if(!dto["idUser"]){
                dto["idUser"] = req.user.id
            }
            const opinionUpdate = await service.instance.updateOpinion(id,{
                descripcion:dto["descripcion"],
                estrellas:dto["estrellas"],
                idUser:dto["idUser"],
                idRoom: id,
            })
            resp.json(opinionUpdate)
        }))

    app.get("/salaPromedio/", run( async(req: Request, res: Response)=>{

        const id = req.query.id as string
        const salaDeEnsayo:SalaDeEnsayoDto = await service.instance.findSalaById(id);

        const opinionesIds = salaDeEnsayo.opiniones;
        const opiniones = await OpinionModel.find({ _id: { $in: opinionesIds } });

        const totalEstrellas = opiniones.reduce((total, opinion) => total + opinion.estrellas, 0);
        const promedio = totalEstrellas / opiniones.length;

        //retorna solo el numero, ej: 3.5
        res.json(promedio)

    }) )


    //get opiniones de sala que se pasa por id en la query
    app.get("/salaOpiniones/", run(async (req: Request, res: Response)=>{
        const id = req.query.id as string
        //buscar sala de ensayo
        const salaDeEnsayo = await service.instance.findSalaById(id);
        if (!salaDeEnsayo) {
            return res.status(404).json({ message: 'Sala de ensayo no encontrada' });
        }
        const opinionesIds = salaDeEnsayo.opiniones;
        const opiniones = await OpinionModel.find({ _id: { $in: opinionesIds } }).populate("idUser");

        res.json({ opiniones });

    }))

    //get opinion hecha por usuario logueado artista,  get mi opinion sobre una sala e particular
    app.get("/salaOpinion/getMyOpinionToRoom", 
    auth, 
    validator.query("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
    run(async (req: any, resp: Response)=>{
        const errors = validator.validationResult(req)
        if(errors && !errors.isEmpty()){
            throw ValidatorUtils.toArgumentsException(errors.array())
        }
        //const idUser = req.query.id as string
        const idUser = req.user.id
        const dto = req.body
        const idRoom = dto["idRoom"]
        //const opinion = await service.instance
        const opinion = await service.instance.getOpinionByUserAndRoom(idUser, idRoom)
        resp.json(opinion)

    })
    )

    interface GrafTortaTipoSala {
        name: string;
        population: number;
    }

    app.post(
        "/salasDeEnsayo/reporteTipoSalaTorta",
        auth,
        admin,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async (req: Request, resp: Response) => {
          const errors = validator.validationResult(req);
          if (errors && !errors.isEmpty()) {
            throw ValidatorUtils.toArgumentsException(errors.array());
          }
      
          const dto = req.body;
          console.log("ruta reporte tipo sala de ensayo");
          console.log(dto.fechaI);
          console.log(dto.fechaH);
      
          const fechaInicioObj = new Date(dto.fechaI);
          const fechaFinObj = new Date(dto.fechaH);
      
          async function obtenerGrafTortaTipoSala(fechaInicio: Date, fechaFin: Date): Promise<GrafTortaTipoSala[]> {
            try {
              const resultados = await SalaDeEnsayoModel.aggregate([
                {
                  $match: {
                    createdAt: { $gte: fechaInicio, $lte: fechaFin },
                    deletedAt: { $exists: false }
                  }
                },
                {
                  $group: {
                    _id: "$idType",
                    count: { $sum: 1 }
                  }
                },
                {
                  $lookup: {
                    from: "types", // Nombre de la colección de tipos en MongoDB
                    localField: "_id",
                    foreignField: "_id",
                    as: "typeInfo"
                  }
                },
                {
                  $unwind: "$typeInfo"
                },
                {
                  $project: {
                    _id: 0,
                    name: "$typeInfo.name",
                    population: "$count"
                  }
                }
              ]);
      
              return resultados as GrafTortaTipoSala[];
            } catch (error) {
              console.error("Error al obtener el gráfico de torta por tipo de sala:", error);
              throw error;
            }
          }
      
          try {
            const resultados = await obtenerGrafTortaTipoSala(fechaInicioObj, fechaFinObj);
            return resp.status(200).json(resultados);
          } catch (error) {
            return resp.status(500).json({ error: "Error al generar el reporte" });
          }
        })
      );

   
      app.get("/salasdeensayo/cantidadVaoraciones", 
      auth,
      run(async (req: any, resp: Response) => {
          const errors = validator.validationResult(req)
          if(errors && !errors.isEmpty()){
              throw ValidatorUtils.toArgumentsException(errors.array())
          }
          const dto = req.body 
          const id = req.query.id as string
          
          console.log("ruta cantidad valoraciones")
        
          //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
          //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
          const NewUsersReport = await  service.instance.obtenerCantidadValoraciones(id)
          
      resp.json(NewUsersReport)    
      })

      

  )




}