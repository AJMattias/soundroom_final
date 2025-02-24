import React, { useState } from 'react'
import { Block, Text } from 'galio-framework'
import { Image, View , StyleSheet, Dimensions } from 'react-native'
import { theme } from '../core/theme'
import BackButton from './BackButton'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import  TabButton from '../components/TabButton'
import  {TabNavigation} from "../components/TabNavigation"
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import { roomService } from '../network/RoomService'
import { isAdmin } from '../helpers/isAdmin'



export const Screen = ({ navigation, rootScreen , showHeader = true , children }) => {
    const [role, setRole] =  useState()

    const fetchRole = async () => {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        if(isAdmin(user)) {
            return setRole(
                "Admin"
            )
        }
        const rooms = await roomService.getMyRooms()
        setRole(
            rooms.length? "Propietario" : "Artista"
        )
    }

    const tabNavigator = () => {
        if(rootScreen) {
            return (
                <TabNavigation navigation =  {navigation} />
            )
        }
    }

    const renderRole = () => {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        // Sólo imprimimos el rol del usuario si sabemos si tiene o no salas a su nombre.
        
        if(user.idPerfil){
            return( <Text style = {styles.role}>{user.idPerfil.name}</Text>)
        }
        if(typeof(role) != 'undefined') {
            return (
                <Text style = {styles.role}>{role}</Text>
            )
        }

    }

    const renderHeader = () => {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        if(!showHeader || !user) {
            return
        }
        return ( <Block shadow style = {styles.headerContainer}>
            <Text style = {styles.userName}>{user.name} {user.last_name} </Text>
            {renderRole()}
        </Block>
        )
    }



    const backNavigation = () => {
        if(!rootScreen) {
            return (
                <BackButton goBack = {navigation.goBack} />
            )
        }
    }

    if(typeof(role) == 'undefined'){
        fetchRole().then()
    }

    return (
        <View  style={styles.container} >
            { renderHeader() }
            { backNavigation() }
            <View style={styles.children}>
                {children}
            </View>
            { tabNavigator() }
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: theme.colors.background,       
        flexDirection: 'column'
    },

    children: {
        position: 'absolute',
        top: 80 + getStatusBarHeight() ,
        left: 0,
        paddingStart: theme.SIZES.BASE,
        paddingEnd: theme.SIZES.BASE,
        width: '100%',
        paddingBottom: 100
    },

    role: {
        fontSize: theme.SIZES.FONT * 1,
        marginStart: 60,
        color: theme.colors.primary,
        fontWeight: 600,
        paddingEnd: theme.SIZES.BASE,
        paddingTop: 8
    },

    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        paddingTop: 16,
        paddingBottom: 16
    },

    userImage: {
        width: 24,
        height: 24,
        borderRadius: 12
    },

    userName: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25,
        marginStart: 16,
    }
})
