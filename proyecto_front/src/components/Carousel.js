import React, { useState } from 'react'
import {Card, Block , Text } from 'galio-framework'
import { StyleSheet, ScrollView } from 'react-native'
import { theme } from '../core/theme'


export const Carousel = ({navigation, title, rooms, style}) => {

    const openRoom = (room) => {
        navigation.push("RoomScreen", { roomId: room._id })
    }
    const userAvatar=require("../assets/user.png")
    const roomImage =require('../assets/theatre.png')
    

    return (
        <Block style = {[style , styles.wrapper]}>
            <Text style = {styles.title}>{title}</Text>
            <ScrollView horizontal= {true} 
            style = {{
                width: '100%'
            }}
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{width: '100%'}}>
                {rooms.map((room)=>  (
                    
                    <Card borderless
                    title = {room.nameSalaEnsayo}
                    caption = {room.nombreDueño}
                    avatar = {userAvatar}
                    location = {room.calleDireccion}
                    shadow
                    image = {roomImage}
                    style = {{marginRight: 5}}
                    onClick = {() => openRoom(room) }
                
                 />
                )
                    
                
                )}
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

    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
        marginBottom: 24
        
    }

})