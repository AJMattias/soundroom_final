import React, { useState, Component } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import { roomService } from '../network/RoomService'
import { Rating } from './Rating'
import { reservationService } from '../network/ReservationService'
import { Alert } from 'react-native'


export const DeleteButton = ({onDelete, innerText , style , ...props}) => {
    const beforeText = innerText? innerText : "Eliminar"
    const confirmText = "¿Seguro?"

    const [confirmed, setConfirmed] =  useState(false)
    const [text, setText] = useState(beforeText)

    const onConfirmClicked = () => {
        onDelete()
        reset()
        
    }

    const onCancelClicked = () => {
        reset()
    }

    const reset = () => {
        setConfirmed(false)
        setText(beforeText)
    }

    const onClicked = () => {
        if(!confirmed) {
            setText(confirmText)
            setConfirmed(true)
        }
    }

    return (
        <Block style = {styles.deleteRow} >
            <Text style = {styles.deleteText} onPress = {() => onClicked()}>{text}</Text>
            {confirmed && 
            <Text style = {styles.deleteOption} onPress = {() => onCancelClicked()}>No</Text> }
            { confirmed && 
            <Text style = {styles.deleteOption} onPress = {() => onConfirmClicked()}>Si</Text>
            }
        </Block>
    )
    
}

const styles = StyleSheet.create({
    deleteText: {
        color: theme.colors.error,
        fontSize: theme.SIZES.FONT * 1.2,
        paddingStart: 8,
        paddingEnd: 8,
        alignItems: 'center'
    },
    deleteRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    deleteOption: {
        marginStart: 4,
        color: theme.colors.error,
        fontSize: theme.SIZES.FONT
    }

})
