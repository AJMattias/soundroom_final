import {api} from './ApiClient'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import {v4 as uuid} from 'uuid'

class PaymentService{

    async createPago (pago){
        console.log('pago servicio: ', pago)
        const payment = await api.post("/pago/create",{
            idSala: pago.idSala,
            idReservation: pago.idReservation,
            name: pago.name,
            ccv: pago.ccv,
            numeroTarjeta: pago.cardNumber,
            fechaVencimiento: pago.expirationDate
            }
        )
        return payment
    }

}

export const pagoService = new PaymentService()