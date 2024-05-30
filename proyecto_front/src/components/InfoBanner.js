import React, { useState } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { StyleSheet } from 'react-native'
import { theme } from "../core/theme"


export const InfoBanner = ({icon, text, textColor, onClick}) => {
    const _textColor = textColor? textColor : theme.colors.blueAccent700

    return (
        <Block row style = {styles.container} onClick = {onClick}>
            <Icon name = {icon} family = {'AntDesign'} size = {24} color = {_textColor} style = {styles.image} />
            <Text style = {[styles.text, {color: _textColor}]} >{text}</Text> 
        </Block>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingStart: 8,
        paddingEnd: 8,
        paddingTop: 4,
        paddingBottom: 4,
        width: '100%',
        alignItems: 'center'
    },
    
    image : {
        marginEnd: 16,

    },

    text: {
        fontSize: theme.SIZES.fontSize,
        fontWeight: 400
    }
    
})