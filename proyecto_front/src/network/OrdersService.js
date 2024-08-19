import { useLinkBuilder } from "@react-navigation/native"
import { MockStore } from "../mock/MockStore"
import { getLoggedUser } from "../storage/LocalStorage"
import { comisionesService } from "./ComisionService"
import { emailService, emailServicios } from "./EmailService"
import { v4 as uuid } from "uuid"
import { reservationService } from "./ReservationService"


class OrdersService {
    
    getMyOrders = async () => {
         console.log(MockStore.getOrders())
        return MockStore.getOrders().filter(
            (order) => order.room.owner.id == getLoggedUser().id
        )
    }

    getMyOrdersBd = async ()=>{
        const response = await reservationService.getReservationsFromMyRoomsBd()
        return response
    }

    //creacion de reserva se suma la comision de soundroom
    // buscar comision habilitada al backend
    addOrder = async (newOrder) => {    
        let comision 
        try {
            const comisionDto  = await comisionesService.getComisionEnabled()
            if(comisionesService.porcentaje && comisionesService.porcentaje >= 0) {
                comision = comisionDto.porcentaje / 100
            } else {    
                comision = 0.10
            }
        } catch (apiError) {
            console.error(apiError)
            comision = 0.10
        }
        return MockStore.storeOrder({...newOrder,
            id: uuid(),
            created: new Date(),
            updated: new Date(),
            totalNet:  newOrder.totalGross * (1 - comision),
            status: "live",
            user: getLoggedUser()
        })

    }

    cancelOrder = async (order) => {
        // MockStore.updateOrder(order.id,{...order, status: 'cancelled', updated: new Date()})
        // MockStore.removeReservationByCondition((reservation) => {
        //     reservation.order && 
        //     reservation.order.id == order.id
        // })

        //const orderCanceled = await reservationService.cancelReservationBd(order.id)
       
        try {
            await emailService.sendEmailToUser(
                order.idUser,
                `Tu reserva para ${order.idRoom.nameSalaEnsayo} para el dia ${order.date.toLocaleDateString()}, ha sido cancelada por el dueño. Front message`
            )
        } catch(emailException) {
            console.error("Error sending email")
            console.error(emailException)
        }
    }

    findMyOrdersByMonth =  async (monthNumber) =>  {
        return MockStore.getOrders().filter(
            (order) => order.room.owner.id == getLoggedUser().id
                            && order.created.getMonth() == monthNumber
        )
    }

    findMyOrdersByRoomName = async (roomName) => {
        return MockStore.getOrders().filter(
            (order) => order.room.owner.id == getLoggedUser().id
                && order.room.name.toLowerCase().startsWith(roomName.toLowerCase())
        )
    }
}

export const ordersService = new OrdersService()