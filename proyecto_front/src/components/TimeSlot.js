import React from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'

export const TimeSlot = ({ date, hour, reservations, onSelected, isSelected }) => {

    const getHours = () => {
        const time = new Date(date)
        time.setHours(hour, 0, 0)
        return time
    }

    const isCurrentTimeBeforeSlot = () => {
        const now = new Date();
        const slotTime = getHours();
        return now > slotTime;
    }

    const checkIsUsed = () => {
        const time = getHours()
        const turns = reservations.filter(
            (reservation) => (reservation.hsStart <= time && reservation.hsEnd >= time)
        )
        return turns.length > 0
    }

    const isUsed = checkIsUsed() || isCurrentTimeBeforeSlot();

    const onTimeClicked = () => {
        if(!isUsed) {
            onSelected(getHours())
        } else {
            const time = getHours()
            console.log("used time" )
            console.log(time)
            console.log(
                reservations.filter(
                    (reservation) => (reservation.hsStart < time && reservation.hsEnd > time)
                )
            )
        }
    }

    const getBackgroundColor = () => {
        if(isUsed) {
            return theme.colors.grey200
        } else if (isSelected) {
            return theme.colors.green50
        } else {
            return theme.colors.white
        }
    }

    const getForegroundColor = () => {
        if(isUsed) {
            return theme.colors.grey600
        } else if (isSelected) {
            return theme.colors.success
        } else {
            return theme.colors.primary
        }
    }   

    const getTextColor = () => {
        if(isUsed) {
            return theme.colors.grey600
        } else if (isSelected) {
            return theme.colors.success
        } else {
            return theme.colors.black
        }
    }


    return (
        <Block shadow row 
            onClick = {onTimeClicked}
            style = {[styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderStartColor: getForegroundColor()
                }
            ]} 
         >
              <Text
                    style = {[
                        styles.hoursText,
                        {
                            color: getTextColor()
                        }
                    ]}
                >{ getHours().toLocaleTimeString()}</Text>
                {isUsed && (
                    <Text style = {styles.usedText}>Ocupado</Text>
                )}
        </Block>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        borderStartWidth: 3,
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
        paddingTop: 16,
        paddingBottom: 16,
        paddingStart: 16,
        paddingEnd: 16
    },

    usedText: {
        color: theme.colors.grey600,
        fontSize: theme.SIZES.FONT,
        fontWeight: 600,
        width: '50%',
        textAlign: 'center'
    },

    freeText: {
        color: theme.colors.blueAccent700,
        fontSize: theme.SIZES.FONT,
        width: '50%',
        textAlign: 'center'
    },

    hoursText: {
        fontSize: theme.SIZES.FONT,
        fontWeight: 600,
        width: '50%'
    }




})