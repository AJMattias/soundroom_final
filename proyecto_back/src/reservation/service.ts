import  * as dao from "./dao"
import {AuthenticationException, AuthorizationException, ServerException} from "../common/exception/exception"
import { CreateReservationDto, DeleteReservationDto, ReservationDto } from "./dto";
import { Reservation, ReservationModel } from "./model";
import * as Email from "../server/MailCtrl"
import { User, UserModel } from "../users/models"
var mongoose = require('mongoose');


export class ReservationService{

    dao : dao.ReservationDao;
    constructor(reservationDao : dao.ReservationDao){
        this.dao = reservationDao
    }

    mapToDto(reservation: Reservation): ReservationDto{
        return {
            createdAt: reservation.createdAt,
            deletedAt: reservation.deletedAt,
            id: reservation.id,
            hsStart: reservation.hsStart,
            hsEnd: reservation.hsEnd,
            idOwner: reservation.idOwner,
            idUser: reservation.idUser,
            idRoom: reservation.idRoom,
            canceled: reservation.canceled,
            date: reservation.date,
            totalPrice: reservation.totalPrice
        }
    }

    async sendMailPiola(to: string, message: string) {
        const mailOptions = {
            from: 'soundroomapp@gmail.com',
            to: to,
            subject: "Reserva de Sala de ensayo",
            html: '<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">' + "Usted ha creado la cuenta exitosamente. Gracias por elegir SoundRoom" + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
            text: message,
            //borrar todo html en caso de que se rompa je
            }
      await Email.sendEmailAsync(mailOptions)
    }

    async createReservation(dto: CreateReservationDto, email: string): Promise<ReservationDto>{
        const reservation = await this.dao.store({
            createdAt: new Date(),
            deletedAt: new Date(),
            hsStart: dto.hsStart,
            hsEnd: dto.hsEnd,
            canceled: "false",
            idOwner: dto.idOwner,
            idRoom: dto.idRoom,
            idUser: dto.idUser,
            date: dto.date,
            totalPrice: dto.totalPrice
        })
        await this.sendMailPiola(email, "Usted ha realizado una reserva exitosamente. Gracias por elegir SoundRoom")
        return this.mapToDto(reservation)
    }

    async UpdateReservation(reservationId: string, dto: CreateReservationDto): Promise<ReservationDto>{
        const toUpdate = await this.dao.findById(reservationId)

        return this.mapToDto(
             await this.dao.update(reservationId, {
                createdAt: new Date(),
                deletedAt: new Date(),
                hsStart: dto.hsStart,
                hsEnd: dto.hsEnd,
                canceled: "false",
                idOwner: dto.idOwner,
                idRoom: dto.idRoom,
                idUser: dto.idUser,
                date: dto.date,
                totalPrice: dto.totalPrice
        }))
    }
    
    async cancelReservation(reservationId: string, dto: DeleteReservationDto, email: string): Promise<ReservationDto>{
        const toUpdate = await this.dao.findById(reservationId)

        const canceledReservation = await this.dao.cancel(reservationId, {
            createdAt: dto.createdAt,
            deletedAt: dto.deletedAt,
            hsStart: dto.hsStart,
            hsEnd: dto.hsEnd,
            canceled: "true",
            idOwner: dto.idOwner,
            idRoom: dto.idRoom,
            idUser: dto.idUser,
            date: dto.date,
            totalPrice: dto.totalPrice,
            canceledDate: new Date() 
        })
        let msg = `Usted ha cancelado la reserva del dia ${dto.date}  a las ${dto.hsStart}exitosamente. Gracias por elegir SoundRoom`
        await this.sendMailPiola(email, msg)
        return this.mapToDto(canceledReservation)
        
        
    }

  

    async getAll(): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getAll()
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationById(id: string): Promise <ReservationDto>{
        const reservation =  await this.dao.getById(id)
        return this.mapToDto(reservation)   
    }

    async getReservationByOwnerAndArtist(idOwner: string, idArtist: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByOwnerAndArtist(idOwner, idArtist)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })   
    }

    async getReservationByOwner(ownerId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByOwnerA(ownerId)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationByOwnerCanceled(ownerId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByOwnerACanceled(ownerId)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationByUser(userId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByUser(userId)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }
    async getReservationByUserAndRoom(userId: string, idRoom: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByUserAndRoom(userId, idRoom)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationByUserCanceled(userId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByUserCanceled(userId)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationByRoom(roomId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByRoom(roomId)
        console.log('reservations: ', reservations)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservationByRoomCanceled(roomId: string): Promise <Array<ReservationDto>>{
        const reservations =  await this.dao.getByRoomCanceled(roomId)
        return reservations.map((reservation: Reservation) => {
            return this.mapToDto(reservation)
        })
    }

    async getReservasPorMes (idOwner: string, fechaInicio: Date, fechaFin: Date) {
        try {
            console.log(`Buscando usuario con id: ${idOwner}`);
            
            // Obtener el usuario por idUser
            const user = await UserModel.findById(idOwner);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
            const salasDeEnsayo = user.idSalaDeEnsayo;
            console.log(`Salas de ensayo del usuario: ${salasDeEnsayo}`);
    
            // Crear el objeto para almacenar las reservas por mes
            let reservasPorMes: { [key: string]: number } = {};
    
            // Recorrer cada sala de ensayo del usuario
            for (let sala of salasDeEnsayo) {
                console.log(`Buscando reservas para la sala: ${sala}`);
                const idSala = mongoose.Types.ObjectId(sala)
    
                // Encontrar las reservas que coincidan con las condiciones
                const reservas = await ReservationModel.find({
                    idRoom: idSala,
                    idOwner: idOwner,
                    canceled: "false",
                    createdAt: { $gte: fechaInicio, $lte: fechaFin }
                });
    
                console.log(`Reservas encontradas para la sala ${sala}: ${reservas.length}`);
                // Agrupar las reservas por mes
                reservas.forEach(reserva => {
                    const mes = reserva.createdAt.toISOString().substring(0, 7); // formato YYYY-MM
                    if (!reservasPorMes[mes]) {
                        reservasPorMes[mes] = 0;
                    }
                    reservasPorMes[mes]++;
                });
            }
    
            console.log(`Reservas agrupadas por mes: ${JSON.stringify(reservasPorMes)}`);
            // Convertir el objeto en un array de objetos con formato { mes: string, cantidad: number }
            const resultado = Object.keys(reservasPorMes).map(mes => ({
                mes,
                cantidad: reservasPorMes[mes]
            }));
    
            return resultado;
        } catch (error) {
            console.error(error);
            throw new Error('Error obteniendo las reservas por mes');
        }
    }

    //reservas canceladas reporte
    async getReservasCanceladasPorMes (idOwner: string, fechaInicio: Date, fechaFin: Date) {
        try {
            console.log(`Buscando usuario con id: ${idOwner}`);
            
            // Obtener el usuario por idUser
            const user = await UserModel.findById(idOwner);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
            const salasDeEnsayo = user.idSalaDeEnsayo;
            console.log(`Salas de ensayo del usuario: ${salasDeEnsayo}`);
    
            // Crear el objeto para almacenar las reservas por mes
            let reservasPorMes: { [key: string]: number } = {};
    
            // Recorrer cada sala de ensayo del usuario
            for (let sala of salasDeEnsayo) {
                console.log(`Buscando reservas para la sala: ${sala}`);
                const idSala = mongoose.Types.ObjectId(sala)
    
                // Encontrar las reservas que coincidan con las condiciones
                const reservas = await ReservationModel.find({
                    idRoom: idSala,
                    idOwner: idOwner,
                    canceled: "true",
                    createdAt: { $gte: fechaInicio, $lte: fechaFin }
                });
    
                console.log(`Reservas encontradas para la sala ${sala}: ${reservas.length}`);
                // Agrupar las reservas por mes
                reservas.forEach(reserva => {
                    const mes = reserva.createdAt.toISOString().substring(0, 7); // formato YYYY-MM
                    if (!reservasPorMes[mes]) {
                        reservasPorMes[mes] = 0;
                    }
                    reservasPorMes[mes]++;
                });
            }
    
            console.log(`Reservas agrupadas por mes: ${JSON.stringify(reservasPorMes)}`);
            // Convertir el objeto en un array de objetos con formato { mes: string, cantidad: number }
            const resultado = Object.keys(reservasPorMes).map(mes => ({
                mes,
                cantidad: reservasPorMes[mes]
            }));
    
            return resultado;
        } catch (error) {
            console.error(error);
            throw new Error('Error obteniendo las reservas por mes');
        }
    }


     // helper parsea
     obtenerNombreDelMes = (mes: number): string => {
        const nombresDeMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return nombresDeMeses[mes];
    }

    // const reservas = await ReservationModel.find({
    //     canceled: "false",
    //     idRoom: sala,
    //     idOwner: idOwner,
    //     createdAt: { $gte: fechaInicio, $lte: fechaFin }
    // }).exec();

}

export const instance = new ReservationService(dao.instance)