import React, { useState } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import Button from './Button'
import { TimeSlot } from './TimeSlot'
import { formatDate, getWeekDay, dateFromCalendarDay } from '../utils/DateUtils'
import { roomService } from '../network/RoomService'
import { Price } from './Price'
import { Calendar } from 'react-native-calendars'

export const CalendarPicker = ({ reservations, onDaySelected }) => {
    const [selectedDay, setSelectedDay] = useState()
    const selectDay = (calendarDay) => {
        console.log("selecting date")
        console.log(calendarDay)
        const day = dateFromCalendarDay(calendarDay)
        setSelectedDay(day)
        onDaySelected(day)
    }


    const getMarkedDays = () => {

        const dates = {}

        const dateHoursDict = countHoursByDate()

        console.log("Hours per date")
        console.log(dateHoursDict)

        for (let dateKey in dateHoursDict) {
            if (dateHoursDict[dateKey] >= 3 && dateHoursDict[dateKey] < 5) {
                dates[dateKey] = {
                    marked: true,
                    dotColor: theme.colors.warning
                }
            } else if (dateHoursDict[dateKey] >= 5) {
                dates[dateKey] = {
                    marked: true,
                    dotColor: theme.colors.error
                }
            }
        }

        if (selectedDay) {
            const dateDay = formatDate(selectedDay)
            dates[dateDay] = {
                selected: true,
                selectedColor: theme.colors.primary
            }
        }

        return dates
    }

    const countHoursByDate = () => {
        const hoursDict = {}
        reservations.forEach((reservation, idx, arr) => {
            const key = formatDate(reservation.hsStart)
            if (!hoursDict[key]) {
                hoursDict[key] = 0
            }
            const diff = (reservation.hsEnd.getTime() - reservation.hsStart.getTime()) / (3600 * 1000)
            hoursDict[key] += diff
        })
        return hoursDict
    }



    return (
        <Block style={styles.container}>
            <Text style={styles.subtitle}>Selecciona una fecha </Text>
            <Calendar style={theme.styles.m16}
                onDayPress={selectDay}
                day={selectedDay}
                theme={{
                    selectedDayBackgroundColor: theme.colors.primary,
                    selectedDayTextColor: theme.colors.white
                }}
                markedDates={getMarkedDays()}
                minDate = {new Date()}
            />
            <Block row style = {theme.styles.m24}>
                <Block style = {[styles.refCube, {backgroundColor: theme.colors.warning}]}/>
                <Text style = {styles.text}>D&iacute;as con moderada ocupaci&oacute;n</Text>
            </Block>
            <Block row >
                <Block style = {[styles.refCube, {backgroundColor: theme.colors.error}]}/>
                <Text style = {styles.text}>D&iacute;as con alta ocupaci&oacute;n</Text>
            </Block>
        </Block>
    )
}



const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column'
    },

    refCube: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginEnd: 16
    },

    text: {
        fontSize: 16,
        color: theme.colors.grey600
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
        color: theme.colors.blueAccent700
    }

})