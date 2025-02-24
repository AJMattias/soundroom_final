import React, { useState } from 'react'
import { Block, Text,Icon  } from 'galio-framework'
import { StyleSheet } from 'react-native'
import {theme} from '../core/theme'
import {useRoute} from '@react-navigation/native';
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage';
import { isAdmin } from '../helpers/isAdmin';




export const TabNavigation = ({navigation}) => {

    const route  = useRoute()

    const user = LocalPhoneStorage.get(STORAGE_USER)

    return (
        <Block row bottom style = {styles.tabContainer}>
            <Tab navigation = {navigation} route = {route} icon = 'user' text = "Perfil"  routeName = 'UserProfileScreen2' />
            <Tab navigation = {navigation} route = {route} icon = 'search1' text = "Salas" routeName = "SearchScreen"/>
            <Tab navigation = {navigation} route = {route} icon = 'calendar' text = "Reservas" routeName = "ReservationsScreen" />
            {
                user 
                //&& isAdmin(user) 
                && user.isAdmin && (
                    <Tab navigation = {navigation} route = {route} icon = 'tool' text = 'Admin' routeName = "AdminStartScreen" />
                )
            }
            
        </Block>
    )
}


const Tab = ({ navigation , route,   icon, text, routeName}) => {
    const navigate = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: routeName }],
          })
    }

    const color = route.name == routeName ? theme.colors.primary : theme.colors.grey600
    
    return (
        <Block style = {styles.tab} onClick = {navigate}> 
            <Icon name = {icon} family = {'AntDesign'} size = {24} color = {color} />
            <Text style = {[styles.tabText, {color: color}]}>{text}</Text>
        </Block>
    )
}


const styles = StyleSheet.create({
    tabContainer: {
       width: '100%',
       justifyContent: 'space-evenly',
       position: 'fixed',
       bottom: 0,
       borderStyle: 'solid',
       borderTopWidth: 1,
       backgroundColor: theme.colors.background,
       borderTopColor: theme.colors.grey200
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    tabText: {
       fontSize: theme.SIZES.FONT*0.9,
       fontWeight: 400,
       marginTop: 8
    }
})