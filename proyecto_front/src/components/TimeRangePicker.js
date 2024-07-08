import React, { useState } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import Button from './Button'
import { TimeSlot } from './TimeSlot'
import { getWeekDay } from '../utils/DateUtils'
import { roomService } from '../network/RoomService'
import { Price } from './Price'

export const TimeRangePicker = ({ date, reservations, room, onSelected, onChangeClicked }) => {

    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [subtotal, setSubTotal] = useState(0)



    const renderTimeSlots = () => {
        const slots = []
        for (let i = 0; i < 24; i++) {
            slots.push(
                <TimeSlot
                    hour={i}
                    date={date}
                    reservations={reservations}
                    isSelected={isHourSelected(i)}
                    onSelected={onHoursTapped}
                />
            )
        }
        return (slots)
    }

    const onHoursTapped = (hours) => {
        console.log("Tapped " + hours)
        if (start && !end && hours > start) {
            checkRangeAndSelect(hours)
        } else {
            setStart(hours)
            setEnd(undefined)
            calculateSubtotal(hours, undefined)
            if(onSelected) {
                onSelected(hours, undefined)
            }
        }
    }

    const isHourSelected = (hr) => {
        if (start && !end) {
            return hr == start.getHours()
        } else if (start && end) {
            return hr >= start.getHours()
                && hr <= end.getHours()
        }
    }

    const checkRangeAndSelect = (hours) => {
        console.log("Checking hour")
        console.log(hours)
        console.log("start")
        console.log(start)
        const overlapped = reservations.filter(
            (reservation) => {
                (reservation.start > start && reservation.start < hours)
            }
        )
        console.log("overlapped")
        console.log(overlapped)
        if (overlapped.length > 0) {
            console.error("Overlapping hours")
            setEnd(undefined)
        } else {
            setEnd(hours)
            if (onSelected) {
                console.log("calling on selected")
                onSelected(start, hours)
            }
            calculateSubtotal(start, hours)
        }
    }

    const calculateSubtotal = (start, end)  => {
        if(start && !end) {
            console.log("return subtotal")
            setSubTotal(room.precioHora)
            return
        }
        const hs =   Math.round(
            (end.getTime() - start.getTime()) / (3600*1000)
         ) 
         //+ 1
         console.log("subtotal hs: "+hs)
         setSubTotal(hs * room.precioHora)
    }

    return (

        <Block styles={styles.container}>
            <Text style = {styles.subtitle}>Selecciona un horario</Text>
            <Block style = {styles.orderRow}>
                <Block row style={{ alignItems: 'center' }}>
                    <Icon name="calendar" family="AntDesign" size={24} color={theme.colors.grey600} style={styles.calendarIcon} />
                    <Text style={styles.dateText}>{getWeekDay(date)} {date.toLocaleDateString()}</Text>
                </Block>
                <Block row style = {styles.subtotalRow}>
                    <Text style = {styles.subtotal}>Total </Text>
                    <Price price = {subtotal} hourlyRate = {false} />
                </Block>
            </Block>
            <Text style = {styles.changeButton} onClick = {onChangeClicked}>Cambiar fecha</Text>
            {renderTimeSlots()}
        </Block>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column'
    },

    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    subtitle: {
        fontSize: theme.SIZES.FONT,
        fontWeight: '600'
    },

    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600
    },

    dateText: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600
    },

    time: {
        fontSize: theme.SIZES.FONT * 1.1,
        color: theme.colors.primary,
        paddingEnd: 16,
        paddingStart: 16,
        paddingTop: 8,
        paddingBottom: 8
    },

    changeDate: {
        fontSize: 16,
        color: theme.colors.primary,
        paddingTop: 8,
        paddingBottom: 8,
        paddingStart: 16,
        paddingEnd: 16,
        marginStart: 16
    },

    calendarIcon: {
        marginStart: 16,
        marginEnd: 8
    },

    subtotal: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.success,
        marginEnd: 8
    },

    subtotalRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    orderRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },

    changeButton: {
        paddingStart: 16,
        paddingEnd: 16,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: theme.SIZES.FONT,
        color:  theme.colors.blueAccent700
    }

})