import React, { useState } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import * as DateUtils from '../utils/DateUtils'
import { Calendar } from 'react-native-calendars'
import { StateScreen } from '../components/StateScreen'
import { Screen } from '../components/Screen'
import { FooterButton } from '../components/FooterButton'
import { useRoute } from '@react-navigation/native'

export const CalendarScreen = ({route, navigation}) => {

    const {startDate, paramName, previousRouteName, title} = route.params

    const [selectedDay , setSelectedDay] = useState(undefined)

    const selectDay = (selected) => {
        const day = DateUtils.dateFromCalendarDay(selected)
        setSelectedDay(day)
    }

    const getMarkedDates = () => {
        const marked = {}
        if(selectedDay) {
            marked[DateUtils.formatDate(selectedDay)] = {
                selected: true,
                selectedColor: theme.colors.primary
            }
        }
        return marked
    }

    const goBackWithResult = () => {
        const returnData = {}
        returnData[paramName] = selectedDay
        navigation.navigate(
            previousRouteName, 
            returnData
        )
    }

    return (
        <StateScreen>
            <Screen navigation = {navigation}>
                <Block style={styles.container}>
                <Text style={styles.subtitle}> {title} </Text>
                <Calendar style={theme.styles.m16}
                    onDayPress={selectDay}
                    day={selectedDay}
                    theme={{
                        selectedDayBackgroundColor: theme.colors.primary,
                        selectedDayTextColor: theme.colors.white
                    }}
                    markedDates = {getMarkedDates()}
                    minDate = {startDate}
                />
                </Block>
            </Screen>
            {
                selectedDay &&
                    <FooterButton buttonText = "Continuar" onClick = {() => goBackWithResult()} />
            }
        </StateScreen>
    )

}


export const openCalendar = (navigation, route, params) => {
   
    navigation.navigate("CalendarScreen", {
        previousRouteName: route.name,
        startDate: params.startDate,
        paramName: params.key,
        title: params.title
    })
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