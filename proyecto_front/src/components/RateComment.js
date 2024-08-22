import React from 'react'
import {  Block, Text } from 'galio-framework'
import { StyleSheet, Image } from 'react-native'
import { theme } from '../core/theme'
import { avg } from '../utils/avg'
import { Rating } from '../components/Rating'
import { UserImage } from './UserImage'

export const RateComment = ({ user, rate, style, onClick }) => {
    const _onClick = () => {
        if(onClick) {
            onClick()
        }
    }

    const openArtistScreen = (artist) => {
        navigation.navigate("ArtistProfileScreen", {
            userId: artist.id
        })
    }
    
    const lastname = user.lastName ? user.lastName : user.last_name;
    console.log(lastname)
    console.log('user: ', user)
    return (
        <Block shadow style={[style, styles.container]} onClick = {() => _onClick()}>
            <Block row style= {styles.userWrapper}>
                <UserImage user={user} size = {40} />
                <Block style={styles.ratingRow}>
                    <Text style={styles.title}>{user.name + " " + lastname}</Text>
                    <Rating ratings={rate.estrellas} showNumber={false} />
                </Block>
            </Block>
            <Text style = {styles.comment} >{rate.descripcion}</Text>
        </Block>
    )
}

const styles = StyleSheet.create({
    ratingRow: {
        flexDirection: 'column',
        marginStart: 16
    },

    userWrapper: {
        alignItems: 'center'
    },

    container: {
        width: '100%',
        paddingStart: 16,
        paddingEnd: 16,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 4,
        flexDirection: 'column',
        backgroundColor: theme.colors.white
    },
    title: {
        fontSize: theme.SIZES.FONT,
        fontWeight: 600
    },
    comment: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
        marginTop:8,
        flexWrap: 'wrap'
    }
})