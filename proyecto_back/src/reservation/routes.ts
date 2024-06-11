import { Application, Request, Response } from "express";
import { run } from "../common/utils/run";
import { admin, auth } from "../server/middleware";
import * as service from "./service"
import { ReservationDto } from "./dto";
import * as validator from "express-validator"
import {ErrorCode} from "../common/utils/constants"
import { ValidatorUtils } from "../common/utils/validator_utils";


export const route = (app: Application) =>{
 
    app.get("/reservations/",
        auth,
        run( async(req: any, res: Response)=>{
            const reservations: ReservationDto[] = await service.instance.getAll()
            res.json(reservations)
    }))

    app.get("/reservation/findReservationbyId/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto = await  service.instance.getReservationById(id)
        resp.json(reservation) 
     }))

    app.post("/reservation/create/",
        //con auth, obtengo en req.use el usuairo logueado con req.user
        auth,
        validator.body("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("idOwner").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED), 
        //validator.body("idUser").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("hsStart").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("hsEnd").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("date").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("totalPrice").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async( req: any, resp: Response)=>{
            const errors = validator.validationResult(req)
                    if(errors && !errors.isEmpty()){
                        throw ValidatorUtils.toArgumentsException(errors.array())
                    }
            const dto = req.body
            //idUser hace la reserva
            const idUser = req.user.id
            const email = req.user.email
            console.log('dto', dto)
            const reservation = await service.instance.createReservation({
                idRoom: dto['idRoom'],
                idOwner: dto['idOwner'],
                hsStart: dto['hsStart'],
                hsEnd: dto['hsEnd'],
                idUser: idUser,
                canceled: "false",
                date:dto["date"],
                totalPrice: dto["totalPrice"]
            }, email)

            resp.json(reservation)
        })
    )

    app.post("/reservation/update/",
        //con auth, obtengo en req.use el usuairo logueado con req.user
        auth,
        validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async( req: any, resp: Response)=>{
            const errors = validator.validationResult(req)
                    if(errors && !errors.isEmpty()){
                        throw ValidatorUtils.toArgumentsException(errors.array())
                    }
            const dto = req.body
            const idUser = req.user.id
            const email = req.user.email
            const id = req.query.id as string
            console.log('dto', dto)
            const reservationOriginal : ReservationDto = await service.instance.getReservationById(id)
            if(!dto["idRoom"]){
                dto["idRoom"] = reservationOriginal["idRoom"];
            }
            if(!dto["idOwner"]){
                dto["idOwner"] = reservationOriginal["idOwner"];
            }
            if(!dto["idUser"]){
                dto["idUser"] = reservationOriginal["idUser"];
            }
            if(!dto["hsStart"]){
                dto["hsStart"] = reservationOriginal["hsStart"];
            }
            if(!dto["hsEnd"]){
                dto["hsEnd"] = reservationOriginal["hsEnd"];
            }
            if(!dto["canceled"]){
                dto["canceled"] = reservationOriginal["canceled"];
            }
            if(!dto["createdAt"]){
                dto["createdAt"] = reservationOriginal["createdAt"];
            }
            if(!dto["deletedAt"]){
                dto["deletedAt"] = reservationOriginal["deletedAt"];
            }
            const reservation = await service.instance.createReservation({
                createdAt: dto["createdAt"],
                deletedAt: dto["deletedAt"],
                idRoom: dto['idRoom'],
                idOwner: dto['idOwner'],
                hsStart: dto['hsStart'],
                hsEnd: dto['hsEnd'],
                idUser: idUser,
                canceled: "false",
                date:dto["date"],
                totalPrice: dto["totalPrice"]
            }, email)

            resp.json(reservation)
        })
    )

    //TODO endpointpara cancel reservation

    app.get("/reservation/cancel/",
        //con auth, obtengo en req.use el usuairo logueado con req.user
        auth,
        validator.query("id").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run(async( req: any, resp: Response)=>{
            const errors = validator.validationResult(req)
                    if(errors && !errors.isEmpty()){
                        throw ValidatorUtils.toArgumentsException(errors.array())
                    }
            const dto = req.body
            const idUser = req.user.id
            const email = req.user.email
            const id = req.query.id as string
            console.log('dto', dto)
            const reservationOriginal : ReservationDto = await service.instance.getReservationById(id)
            if(!dto["idRoom"]){
                dto["idRoom"] = reservationOriginal["idRoom"];
            }
            if(!dto["idOwner"]){
                dto["idOwner"] = reservationOriginal["idOwner"];
            }
            if(!dto["idUser"]){
                dto["idUser"] = reservationOriginal["idUser"];
            }
            if(!dto["hsStart"]){
                dto["hsStart"] = reservationOriginal["hsStart"];
            }
            if(!dto["hsEnd"]){
                dto["hsEnd"] = reservationOriginal["hsEnd"];
            }
            if(!dto["canceled"]){
                dto["canceled"] = reservationOriginal["canceled"];
            }
            if(!dto["createdAt"]){
                dto["createdAt"] = reservationOriginal["createdAt"];
            }
            if(!dto["deletedAt"]){
                dto["deletedAt"] = reservationOriginal["deletedAt"];
            }
            const reservation = await service.instance.cancelReservation(id, {
                createdAt: dto["createdAt"],
                deletedAt: dto["deletedAt"],
                idRoom: dto['idRoom'],
                idOwner: dto['idOwner'],
                hsStart: dto['hsStart'],
                hsEnd: dto['hsEnd'],
                idUser: idUser,
                canceled: "true",
                date:dto["date"],
                totalPrice: dto["totalPrice"]
            }, email)

            resp.json(reservation)
        })
    )

    app.get("/reservation/findReservationbyOwner/", 
        auth, 
        run(async (req: any ,resp: Response) => {
        const id = req.user.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByOwner(id)
        resp.json(reservation) 
    }))

    app.get("/reservation/findReservationbyOwnerCanceled/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByOwnerCanceled(id)
        resp.json(reservation) 
    }))

    app.get("/reservation/findReservationbyUser/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByUser(id)
        resp.json(reservation) 
    }))

    //idUser hace la reserva
    app.get("/reservation/findReservationbyUserAndRoom/:userId/:roomId",
        run(async (req: Request,resp: Response) => {
        const id = req.params.userId as string
        //Probar una vez mas con este roomId en la query
        const roomId = req.params.roomId as string;
        // const dto = req.body
        // const idRoom = dto["idRoom"]
        console.log('ruta get opinion by user', id + ' and sala, idRoom: ', roomId)
        const reservation : ReservationDto[] = await  service.instance.getReservationByUserAndRoom(id, roomId)
        console.log('ruta reservation: ', reservation)
        resp.json(reservation) 
    }))

    app.get("/reservation/findReservationbyUserCanceled/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByUserCanceled(id)
        resp.json(reservation) 
    }))

    app.get("/reservation/findReservationbyRoom/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByRoom(id)
        resp.json(reservation) 
    }))

    app.get("/reservation/findReservationbyRoomCanceled/",
        run(async (req: Request,resp: Response) => {
        const id = req.query.id as string
        const reservation : ReservationDto[] = await  service.instance.getReservationByRoomCanceled(id)
        resp.json(reservation) 
    }))

    app.post("/reservations/reservationsPorSalaMes/", 
        auth,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const idUser = req.user.id
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            console.log('dto fechas I y H: ', dto)
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte reservas por mes")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            const NewUsersReport = await  service.instance.getReservasPorMes(idUser, dto.fechaI, dto.fechaH)
            console.log(NewUsersReport)
            resp.json(NewUsersReport)    
    }))
    

    app.post("/reservations/reservationsCanceladasPorSalaMes/", 
        auth,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const idUser = req.user.id
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            console.log('dto fechas I y H: ', dto)
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte reservas por mes")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            const NewUsersReport = await  service.instance.getReservasPorMes(idUser, dto.fechaI, dto.fechaH)
            console.log(NewUsersReport)
            resp.json(NewUsersReport)    
    }))

}