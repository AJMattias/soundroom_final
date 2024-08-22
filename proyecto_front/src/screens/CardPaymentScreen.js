import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, ScrollView, Alert } from 'react-native'
import { StateScreen } from '../components/StateScreen'
import { Rating } from '../components/Rating'
import { Screen } from '../components/Screen'
import { Block, Text, Card, Icon } from 'galio-framework'
import { theme } from '../core/theme'
import { roomService } from '../network/RoomService'
import { reservationService } from '../network/ReservationService'
import { RateComment } from '../components/RateComment'
import { FooterButton } from '../components/FooterButton'
import { Price } from '../components/Price'
import { TimeRangePicker } from '../components/TimeRangePicker'
import { MockStore } from '../mock/MockStore'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import TextInput from '../components/TextInput'
import { roomVerificator } from '../helpers/roomVerificator'
import { ordersService } from '../network/OrdersService'
import { userService } from '../network/UserService'
import { pagoService } from '../network/PaymentService'
import { nombreCompletoValidator } from '../helpers/nombreCompletoValidator'
import { fechaVencimientoValidator } from '../helpers/fechaVencimientoValidator'
import { cardNumberValidator } from './cardNumberValidator'
import { ccvValidator } from '../helpers/ccvValidator'
import { emailService } from '../network/EmailService'

export const CardPaymentScreen = ({ route, navigation }) => {
  const { order } = route.params

  const { total, start, end, room, selectedDay } = order
  const [name, setName] = useState({ value: '', error: '' })
  const [cardNumber, setCardNumber] = useState({ value: '', error: '' })
  const [expirationDate, setExpirationDate] = useState({ value: '', error: '' })
  const [cCV, setCCV] = useState({ value: '', error: '' })
  const [errorMessage, setErrorMessage] = useState({ error: '' })
  const [orderState, setorderState] = useState({
    total: 0,
    start: 0,
    end: 0,
    room: '',
    selectedDay: null,
  })

  const [totalReserva, settotalReserva] = useState(0)
  const [sala, setSala] = useState({
    id: '',
    nameSalaEnsayo: '',
    calleDireccion: '',
    numeroDireccion: 0,
    idOwner: '',
    precioHora: 0,
    idType: '',
    enabled: true,
    descripcion: '',
    comodidades: [],
    opiniones: [],
    idImagen: '',
  })
  const [roomImage, setRoomImage] = useState('../assets/theatre.png')

  const [owner, setOwner] = useState({})
  const loggedUser = LocalPhoneStorage.get(STORAGE_USER)

  const reserva = {
    start: order.start,
    end: order.end,
    roomId: order.room,
    total: order.total,
    selectedDay: order.selectedDay,
  }

  const makePayment = async () => {
    const cardNumberError = cardNumberValidator(cardNumber.value)
    const expirationDateError = fechaVencimientoValidator(expirationDate.value)
    const cCVError = ccvValidator(cCV.value)
    const nameError = nombreCompletoValidator(name.value)
    console.log(order)
    setErrorMessage({ ...errorMessage, error: '' })
    if (cCVError || expirationDateError || cardNumberError) {
      setName({ ...name, error: nameError })
      setCardNumber({ ...cardNumber, error: cardNumberError })
      setExpirationDate({ ...expirationDate, error: expirationDateError })
      setCCV({ ...cCV, error: cCVError })
      return
    } else {
      //const newOrder = await ordersService.addOrder({
      //     name: order.name,
      //     room: order.room,
      //     totalGross: order.total,
      //     user: order.user
      // })
      // const reservation = await reservationService.reserve(order)
      // navigation.reset({
      //     index: 0,
      //     routes: [{name: 'ReservationsScreen'}]
      // })
      // await reservationService.sendEmailReserva(email)

      // guardar orden/reserva en la bd
      let reserva = {
        idRoom: sala.id,
        idOwner: sala.idOwner,
        hsStart: start.toISOString(),
        hsEnd: end.toISOString(),
        date: selectedDay.toISOString(),
        totalPrice: total,
      }
      console.log(reserva)
      const reservation = await reservationService.createReservation(reserva)
      console.log('reservation created: ', reservation)
      console.log('order:', order)
      console.log('pago, cardNumber, ccv, nombre, fecha vto')
      console.log(cardNumber, cCV, name, expirationDate)
      let pago = {
        idSala: reserva.idRoom,
        idReservation: reservation.id,
        name: name.value,
        cardNumber: cardNumber.value,
        ccv: cCV.value,
        expirationDate: expirationDate.value,
      }
      // endpoint en backend
      console.log('pago: ', pago)
      const pagoCreated = await pagoService.createPago(pago)
      if(pagoCreated.name){
         await emailService.sendEmailToUser(loggedUser, "Usted ha realizado una reserva exitosamente. Gracias por elegir SoundRoom")
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'ReservationsScreen' }],
      })
    }
  }

  const email = {
    receptor: String(loggedUser.email),
    nombreUsuario: String(loggedUser.name),
    sala: String(sala.name),
    inicio: String(
      order.start.toLocaleDateString() +
        ' desde la hora ' +
        order.start.toLocaleTimeString()
    ),
    //mail del dueño
    duenoSala: String(
      sala.idOwner
      //order.sala.email
      //.owner.email
    ),
  }

  // get Room by id from bd
  const fetchData = async () => {
    console.log('order por parametro:', order)
    console.log('total: ', total)
    settotalReserva(order.total)
    console.log('total por parametro: ', order.total)
    orderState.total = total
    orderState.selectedDay = selectedDay
    orderState.start = start
    orderState.end = end
    orderState.room = room
    //buscar sala de ensayo
    const salaFetched = await roomService.getRoomBd(order.room)
    if (salaFetched.idImagen == '') {
      setRoomImage('../assets/theatre.png')
    }
    setSala(salaFetched)

    //get dueño de la sala para obtener su email para mandarle mail
    const dueñoSalaId = salaFetched.idOwner
    email.sala = salaFetched.nameSalaEnsayo
    email.duenoSala = salaFetched.idOwner
    const owner = await userService.getUser(dueñoSalaId)
    setOwner(owner)

    console.log(email)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <StateScreen>
      <Screen navigation={navigation}>
        <ScrollView>
          <Block style={styles.roomContainer}>
            <Block row style={styles.roomRow}>
              <Image
                source={
                  require('../assets/theatre.png')
                  //roomImage
                  //order.room.image
                }
                style={styles.roomImage}
              />
              <Text style={styles.title}>
                {
                  sala.nameSalaEnsayo
                  //order.room.name
                }
              </Text>
            </Block>
          </Block>
          <Text style={styles.title}>Orden de compra</Text>
          <Block row style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Price
              hourlyRate={false}
              price=//{reserva.total}
              {order.total}
            />
          </Block>
          <TextInput
            label="Nombre Completo"
            //onChange = {(text) => setName({ ...name, value: text.target.value, error: '' })}
            onChangeText={(text) => setName({ value: text, error: '' })}
            error={!!name.error}
            errorText={name.error}
          />
          <TextInput
            label="Tarjeta de credito"
            onChangeText={(text) => setCardNumber({ value: text, error: '' })}
            error={!!cardNumber.error}
            errorText={cardNumber.error}
          />
          <TextInput
            label="Vencimiento"
            onChangeText={(text) =>
              setExpirationDate({ value: text, error: '' })
            }
            error={!!expirationDate.error}
            errorText={expirationDate.error}
          />
          <TextInput
            label="CCV"
            onChangeText={(text) => setCCV({ value: text, error: '' })}
            error={!!cCV.error}
            errorText={cCV.error}
          />
        </ScrollView>
      </Screen>
      <FooterButton onClick={makePayment} buttonText="Pagar"></FooterButton>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  roomImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginEnd: 16,
  },

  subtitle: {
    fontSize: theme.SIZES.FONT,
    fontWeight: 600,
  },

  title: {
    fontSize: theme.SIZES.FONT * 1.5,
    fontWeight: 600,
  },

  roomRow: {
    alignItems: 'center',
    width: '100%',
  },

  roomContainer: {
    paddingTop: 16,
    marginBottom: 48,
    paddingStart: 16,
    paddingEnd: 16,
    flexDirection: 'column',
  },

  title: {
    fontSize: theme.SIZES.FONT * 1.5,
    fontWeight: 600,
  },

  totalText: {
    color: theme.colors.success,
    fontSize: theme.SIZES.FONT * 1.5,
    fontWeight: 600,
  },

  totalRow: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 24,
    paddingEnd: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
