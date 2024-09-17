import React from 'react'
import {Card, Block , Text } from 'galio-framework'
import { StyleSheet, ScrollView } from 'react-native'
import { theme } from '../core/theme'
import { RoomCard } from './RoomCard'


export const CarouselVertical = ({navigation, title, ownerRooms, style}) => {

    const openRoom = (room) => {
        navigation.push("RoomScreen", { roomId: room.id })
    }

    return (
        <Block style = {[style , styles.wrapper]}>
            <Text style = {styles.title}>{title}</Text>
            <ScrollView vertical = {true}
            style = {{
                width: '100%'
            }}
            showsHorizontalScrollIndicator={true} 
            contentContainerStyle={{width: '100%'}}>
                <Block style = {styles.ownerRoomsContainer}>
                    {/* <Text style = {styles.subtitle} >Tus salas</Text> */}
                    {ownerRooms.map((room) => (
                        <RoomCard room = {room} navigation = {navigation} />
                    ))}
                </Block>
            </ScrollView>
        </Block>
    )
}


const styles = StyleSheet.create({
    wrapper : {
        flexDirection: 'column',
        width: '100%',
        paddingTop: 8, 
        paddingBottom: 8
    },
    ownerRoomsContainer: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 12
    },
    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
        marginBottom: 24
        
    }

})