import React from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { StyleSheet, ScrollView } from 'react-native'
import { theme } from '../core/theme'
import { avg } from '../utils/avg'

export const Rating = ({ ratings, size, showNumber = true }) => {
    const scores = ratings.map((rating) => rating.score)
    const avgScore = avg(scores)

    const renderRating = () => {
        const qty = Math.round(avgScore)
        const stars = []
        for(let i = 0; i < qty;  i++) {
            stars.push(
                <Icon name ="star" family = "AntDesign" size = {size? size : 10} color = {theme.colors.primary} /> 
            )
        }
        return (
            stars
        )

    }

    console.log("Ratings")
    console.log(renderRating())

    return (
        <Block row style={styles.container} >
            <Text style={[styles.ratingNumber, {display: showNumber? 'flex': 'none'}]}>{avgScore.toFixed(1)}</Text>
            { renderRating() }
        </Block>
    )
}

const styles = StyleSheet.create({
    ratingNumber: {
        fontSize: theme.SIZES.FONT * 1.5,
        color: theme.colors.primary,
        marginEnd: 8
    },
    ratingIcon: {
        marginEnd: 4
    },
    container: {
        alignItems: 'center'
    }
})