import { Application, Request, Response } from "express";
import { run } from "../common/utils/run";
import { admin, auth } from "../server/middleware";
import * as service from "./service"
import { ReservationDto } from "./dto";
import * as validator from "express-validator"
import {ErrorCode} from "../common/utils/constants"
import { ValidatorUtils } from "../common/utils/validator_utils";
import { ReservationModel } from "./model";
var mongoose = require('mongoose');


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

     app.get("/reservations/findReservationByOwnerAndArtist",
        auth,
        run( async(req: any, res: Response)=>{
            const idArtist = req.query.idArtist as string
            const idOwner = req.user.id as string
            const reservations: ReservationDto[] = await service.instance.getReservationByOwnerAndArtist(idOwner, idArtist)
            res.json(reservations)
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
            if(!dto["date"]){
                dto["date"] = reservationOriginal["date"];
            }
            if(!dto["totalPrice"]){
                dto["totalPrice"] = reservationOriginal["totalPrice"];
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
        console.log('back get room reservations')
        const reservation : ReservationDto[] = await  service.instance.getReservationByRoom(id)
        console.log('back room reservation response: ', reservation)
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
        validator.body("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        run(async (req: any, resp: Response) => {
            const idUser = req.user.id
            const errors = validator.validationResult(req)
            if(errors && !errors.isEmpty()){
                throw ValidatorUtils.toArgumentsException(errors.array())
            }
            const dto = req.body 
            console.log('dto sala, fechas I y H: ', dto)
            //fechaID = 'YYYY-MM-DD'
            console.log("ruta reporte reservas por mes")
            console.log(dto.fechaI)
            console.log(dto.fechaH)
            console.log(dto.idRoom)
            // const users : UserDto[] = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            let dtoNewUsersReport = [] 
            //dias = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //const NewUsersReport = await  service.instance.reporteUserByDateRange2(dto.fechaI, dto.fechaH)
            //falta pasar parametro idRoom
            const NewUsersReport = await  service.instance.getReservasPorMes(dto.idRoom, dto.fechaI, dto.fechaH)
            console.log(NewUsersReport)
            resp.json(NewUsersReport)    
    }))
    
//TODO;: revisar
    app.post("/reservations/reservationsCanceladasPorSalaMes/", 
        auth,
        validator.body("fechaI").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        validator.body("fechaH").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
        validator.body("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),        
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
            const NewUsersReport = await  service.instance.getReservasCanceladasPorMes(dto.idRoom, idUser, dto.fechaI, dto.fechaH)
            console.log(NewUsersReport)
            resp.json(NewUsersReport)    
    }))

    //endpoint para  contar la cantidad de reserva por dia de semana por sala
    app.get("/reservations/cantidadReservasPorDia/", 
        auth, 
        validator.query("idRoom").notEmpty().withMessage(ErrorCode.FIELD_REQUIRED),
        run (async (req: any, res: Response)=>{
            const idRoom = req.query.idRoom as string
            const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

                const reservations = await ReservationModel.aggregate([
                {
                    $match: {
                        idRoom: new mongoose.Types.ObjectId(idRoom),
                    },
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$date" }, // Agrupa por día de la semana
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { "_id": 1 }, // Ordena por día de la semana (1 = Domingo, 7 = Sábado)
                },
            ]);

            // Mapea los resultados a los días de la semana y asegura que cada día tenga un conteo, incluso si es 0
            const data = daysOfWeek.map((day, index) => {
                const reservation = reservations.find(res => res._id === (index + 1));
                return reservation ? reservation.count : 0;
            });
            let response = {
            labels: daysOfWeek,
            datasets: [
                {
                    data,
                },
            ],
            }
            console.log('response dia mas valorado: ', response)
            res.json(response)
        })
    )

}