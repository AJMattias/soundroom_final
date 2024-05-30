/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { Avatar, Header } from "react-native-elements";
import { Block, Text, Card, Icon } from "galio-framework";
import Button from "../components/Button"
import { Navigation } from "../components";
import BackButton from "../components/BackButton";
import Background from "../components/Background";
import { StateScreen } from "../components/StateScreen";
import { UserAvatar } from "../components/UserAvatar";
import { theme } from "../core/theme";
import { userService } from "../network/UserService";
import { Screen } from "../components/Screen"
import { Carousel } from "../components/Carousel";
import { FeaturedArtists } from "../components/FeaturedArtists"
import { roomService } from "../network/RoomService"
import { LocalPhoneStorage } from "../storage/LocalStorage"
import Paragraph from "../components/Paragraph";
import  Divider  from "react-native-elements/dist/divider/Divider";
import { TabNavigation } from "../components/TabNavigation";
import { WebStorage } from "../storage/WebStorage";
import { BackupBD } from "./BackupBD";




export function AdminStartScreen({ navigation}){

    const [shouldShow, setShouldShow] = useState(false);
    const [shouldShow1, setShouldShow1] = useState(false);


    const [user, setUser] = useState({
        name: "",
        last_name: "",
        email: ""
    })

    const [userFetched, setUserFetched] = useState(false)

    const fetchUser = async () => {
        try {
            const user = await userService.me()
            console.log("Got user")
            console.log(user)
            setUser({...user, image: 'https://i.pravatar.cc/100'})
            setUser(user)
        } catch (apiError) {
            console.error("Error fetching user")
            console.log(apiError)
        }
    }

    const gestionPerfiles = () => {
        LocalPhoneStorage.reset()
        navigation.reset({
            index: 0,
            routes: [{ name: 'AbmPerfilesScreen' }],
          })
    }

    const logOut = () => {
        LocalPhoneStorage.reset()
        navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
    }

    const downloadBackup = () => {
        console.log("Downloading backup")
        WebStorage.downloadBackup()
        userService.backupBD()
    }

    if (!userFetched) {
        fetchUser().then()
        setUserFetched(true)
    }

    return (
        // <StateScreen loading={!userFetched}>
         <StateScreen>
            <Screen navigation={navigation} rootScreen>
                <SafeAreaView>
                {/* <Header
                style={styles.header}
                backgroundColor={theme.colors.primary}
                leftComponent={<BackButton goBack={navigation.goBack}/>}
                centerComponent={{text:'Administrador', style:{fontSize:21, color:'#000'}}}
                /> */}
                </SafeAreaView>
                <ScrollView>
                <UserAvatar user={user}></UserAvatar>
                <Paragraph>Hola Admin, En esta seccion encontraras todas tus acciones</Paragraph>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Gestion de Perfiles</Text>
                    <Text p style={styles.text}>En esta Seccion encontraras las opciones para crear, modificar y dar de baja perfiles. 
                        Haz  click en "Gestion de Perfiles"</Text>
                        <Button mode ="outlined"
                        onPress={()=> navigation.navigate('AbmPerfilesScreen')} 
                        >
                        Gestion de Perfiles</Button>
                </View>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Gestion de Permisos</Text>
                    <Text p style={styles.text}>En esta Seccion encontraras las opciones para crear, modificar y dar de baja permisos. 
                        Haz  click en "Gestion de Permisos"</Text>
                        <Button mode ="outlined"
                        onPress={()=> navigation.navigate('AbmPermisos')} 
                        >
                        Gestion de Permisos</Button>
                </View>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Reportes</Text>
                    <Text p style={styles.text}>En esta Seccion encontraras los distintos reportes
                    </Text>
                        <Button mode ="outlined"
                        onPress={()=> navigation.navigate('AdminSoundRoomReportes')} 
                        >
                        Reportes</Button>
                </View>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Backup del sistema</Text>
                    <Text p style={styles.text}> Presionando este bot&oacute;n podr&aacute;s acceder a las opciones de la Base de Datos del Sistema.
                    </Text>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('BackupBD')}
                        >
                            Ver opciones de Backup
                        </Button>
                </View>
                <Divider orientation="horizontal" />

                <View>
                    <Text style = {styles.subtitle}>
                        Administrar Comisiones</Text>
                    <Text p style={styles.text}>En esta Seccion podras consultar o modificar el porcentaje (%) de comisiones</Text>
                    <Button 
                        mode ="outlined"
                        onPress={()=>navigation.navigate('AdminComision')}>
                         Comision</Button>
                </View>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Gestion de Usuarios</Text>
                    <Text p style={styles.text}>En esta Seccion encontraras las opciones para gestionar a los Usuarios. 
                    </Text>
                        <Button mode ="outlined"
                        onPress={()=>navigation.navigate('GestionUsuariosScreen')} 
                        >
                        Gestion de Usuarios</Button>

                </View>


                <Divider orientation="horizontal" />
                <Block row center style = {styles.logOutContainer} onClick = {logOut}>
                       <Icon name = 'logout' family = 'AntDesign' color = {theme.colors.error}/>
                       <Text style = {styles.logOutText}>Cerrar Sesión</Text>
                   </Block>
                </ScrollView>
            </Screen>
        </StateScreen>
    )
}

const styles = StyleSheet.create({
    header:{
        position: 'fixed'
    },
    logOutText: {
        color: theme.colors.error,
        textTransform: 'uppercase',
        fontSize: theme.SIZES.fontSize,
        fontWeight: 600,
        marginStart: 16,
    },
    logOutContainer: {
        marginTop: 16
    },
    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
        marginBottom: 24
    },
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },
    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
    }
})
