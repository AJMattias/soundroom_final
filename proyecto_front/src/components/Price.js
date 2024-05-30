import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'
import { hasDecimals } from '../utils/avg'


export const Price = ({price, style , hourlyRate = true, fontSize = 1.5}) => {

    const formatPrice = (price) => {
        if (!hasDecimals(price)) {
            return price
        } else {
            return price.toFixed(1)
        }
    }

    return (
        <Text style = {[styles.price, {fontSize: theme.SIZES.FONT * fontSize} ,style]}>
            ${formatPrice(price)} {hourlyRate? "/hr": ""}
        </Text>
    )
}


const styles = StyleSheet.create({
    price: {
        color: theme.colors.success,
        fontWeight: 600
    }
})