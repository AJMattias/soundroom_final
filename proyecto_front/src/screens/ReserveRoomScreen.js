import React, { useState } from 'react'
import { StyleSheet, Image, ScrollView } from 'react-native'
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
import { CalendarPicker } from '../components/CalendarPicker'


export const ReserveRoomScreen = ({ route, navigation }) => {

    const { roomId } = route.params
    const [reservations, setReservations] = useState([])
    const [reservationsFetched, setReservationsFetched] = useState(false)
    const [room, setRoom] = useState({
        id:"",
        nameSalaEnsayo:"",
        calleDireccion:"",
        numeroDireccion:0,
        idOwner:"",
        precioHora:0,
        idType:"",
        enabled:true,
        descripcion:"",
        comodidades:[],
        opiniones:[],
        idImagen:""
    })
    const [roomImage, setRoomImage] = useState('../assets/theatre.png')
    const [selectedDay, setSelectedDay] = useState()
    const [selectedStart, setSelectedStart] = useState()
    const [selectedEnd, setSelectedEnd] = useState()
    const [totalReserva, settotalReserva] = useState(0)


    const fetchData = async () =>{
        try {
            console.log('fetching room reservation')
            const reservationRoom = await reservationService.getReservationsByRoomBd(roomId)
            
            const response = reservationRoom
            setReservations(response)
            console.log('Room reservations: ', reservationRoom)

            const roomfetched = await roomService.getRoomBd(roomId)
            if(roomfetched.idImagen ==''){
                setRoomImage('../assets/theatre.png')
            }
            console.log(roomfetched)
            setRoom(roomfetched)
            console.log("Room: ", room)

        } catch (error) {
            console.error(error)
        }
    }

    const fetchReservations = async () => {
        try {
            const reservationRoom = await reservationService.getReservationsByRoom(roomId)
            setReservations(reservationRoom)
            console.log('Room reservations: ', reservations)
        } catch (apiError) {
            console.error(apiError)
        }
    }

    const fetchRoom = async () => {
        try {
            //const _room = await roomService.getRoom(roomId)
            let room2 = await roomService.getRoomBd(roomId)
            setRoom(room2)
            console.log("Room")
            console.log(room)
            //setReservationsFetched(true)
        } catch (apiError) {
            console.error("Error fetching room")
            console.error(apiError)
        }
    }

    if (!reservationsFetched) {
        //fetchReservations().then()
        //fetchRoom().then()
        fetchData().then()
        setReservationsFetched(true)
    }

    const onDaySelected = (day) => {
        console.log("On day selected")
        console.log(day)
        setSelectedDay(day)
    }

    const clearDay = () => {
        setSelectedDay(undefined)
        setSelectedStart(undefined)
        setSelectedEnd(undefined)
    }

    const renderTimePicker = () => {
        if (!selectedDay) {
            return
        }
        return (
            <TimeRangePicker
                room={room}
                reservations={reservations}
                date={selectedDay}
                onSelected={onSelectedTimes}
                onChangeClicked={clearDay}
            />
        )
    }

    const renderCalendarPicker = () => {
        if (selectedDay) {
            return
        }
        return (<CalendarPicker onDaySelected={onDaySelected}  reservations = {reservations}/>)
    }

    const onSelectedTimes = (start, end) => {
        console.log("On selected times s: "+start+" e: "+end)
        
        setSelectedStart(start)
        if (typeof(end) !== 'undefined') {
            setSelectedEnd(end)
        } else {
            setSelectedEnd(
                new Date(start.getTime() + 3600 * 1000)
            )
        }
    }


    const onContinue = () => {
        console.log("On continue")
        console.log(selectedStart)
        console.log(selectedEnd)
        if(!selectedStart) {
            return
        }
        const start = selectedStart
        const end =  selectedEnd? selectedEnd :  new Date(start.getTime()+3600*1000)
        
        const hs =   Math.round(
            (end.getTime() - start.getTime()) / (3600*1000)
         ) 
         //+ 1
         console.log("order hours "+hs) 

        //const total = hs * room.hourlyRate
        const total = hs * room.precioHora
        console.log(total)
        //settotalReserva(total)
        //console.log('tipo de variable, total:', typeof total)
        
        
        navigation.push("CardPaymentScreen", {
            order: {
                start: start,
                end: end,
                //enviar room id, xq room la pantalla pagos, lo ve como [object] [Object]
                room: room.id,
                total: total,
                selectedDay: selectedDay
            }
        })    
    }




    return (
        <StateScreen loading={!reservationsFetched}>
            <Screen navigation={navigation} >
                <Block style={styles.roomContainer}>
                    <Block row style={styles.roomRow}>
                        <Image source={ require('../assets/theatre.png')} style={styles.roomImage} />
                        <Text style={styles.title}>{room.nameSalaEnsayo}</Text>
                    </Block>
                    <Block row center >
                            <Price price={room.precioHora} fontSize={1} />
                    </Block>
                </Block>
                <ScrollView>
                    {renderCalendarPicker()}
                    {renderTimePicker()}
                </ScrollView>
            </Screen>
            <FooterButton buttonText="Reservar" onClick = {onContinue}></FooterButton>
        </StateScreen>
    )
}



const styles = StyleSheet.create({
    roomImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginEnd: 16
    },

    subtitle: {
        fontSize: theme.SIZES.FONT,
        fontWeight: 600
    },

    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
    },

    roomRow: {
        alignItems: 'center',
        width: '100%'
    },

    roomContainer: {
        paddingTop: 16,
        marginBottom: 48,
        paddingStart: 16,
        paddingEnd: 16,
        flexDirection: 'column'
    }

})