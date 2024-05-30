import React, { useState } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import { roomService } from '../network/RoomService'
import { Rating } from './Rating'

export const RoomCard = ({ room, navigation, style }) => {
    const openRoom = () => {
        navigation.navigate("RoomScreen", {
            roomId: room.id
        })
    }

    const [ratings, setRatings] = useState([])
    const [ratingsFetched, setRatingsFetched] = useState(false)

    const fetchRatings = async () => {
        try {
            setRatings(
                await roomService.getRatings(room.id)
            )
            setRatingsFetched(true)
        } catch (ignored) {
            console.error(ignored)
        }
    }

    const renderRatings = () => {
        if(ratings.length) {
            return (
                <Rating ratings = {ratings} showNumber = {false} />
            )
        }
    }

    if(!ratingsFetched) {
        fetchRatings().then()
    }

    return (
        <Block shadow style={[styles.container, style]} onClick={() => openRoom()} >
            <Block row style = {{alignItems: 'center'}}>
                <Image style={styles.image} source={room.image? room.image : require('../assets/theatre.png')} />
                <Block style={styles.roomInfoRow} >
                    <Text style={styles.title}> {room.nameSalaEnsayo} </Text>
                    <Block row style={styles.locationWrapper} >
                        <Icon size={24} color={theme.colors.grey600} name='location-pin' family='MaterialIcons' />
                        <Text style={styles.text}>{room.calleDireccion}</Text>
                    </Block>
                    {renderRatings()}
                </Block>
            </Block>
        </Block>
    )

}

const styles = StyleSheet.create({
    roomInfoRow: {
        flexDirection: 'column',
        marginStart: 16
    },
    locationWrapper: {
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginEnd: 8
    },


    container: {
        width: '100%',
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
        fontWeight: 600,
        flexWrap: 'wrap'
    },

    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
        marginTop: 8,
        marginBottom: 8,
        flexWrap: 'wrap'
    }
})