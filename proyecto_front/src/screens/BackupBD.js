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
import { LocalPhoneStorage } from "../storage/LocalStorage"
import Paragraph from "../components/Paragraph";
import  Divider  from "react-native-elements/dist/divider/Divider";
import { WebStorage } from "../storage/WebStorage";
//fs no funciona con entornos web, solo back
//import * as fs from 'fs'





export function BackupBD({ navigation}){

    const [user, setUser] = useState({
        name: "",
        last_name: "",
        email: ""
    })

    const [userFetched, setUserFetched] = useState(false)

    const fetchUser = async () => {
        try {
            //const user = await userService.me()
            console.log("Got user")
            console.log(user)
            setUser({ ...user, image: 'https://i.pravatar.cc/100' })
        } catch (apiError) {
            console.error("Error fetching user")
            console.log(apiError)
        }
    }


    const logOut = () => {
        LocalPhoneStorage.reset()
        navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
        })
    }

    // const downloadBackup = () => {

    //     console.log("Downloading backup")
    //     //WebStorage.downloadBackup()
    //     const ruta = userService.backupBD()
    //     console.log(ruta)
    //     fs.writeFile('/BackupLala', ruta, { flag: 'a+' }, err => { })
    // }

    const downloadBackup = async () => {
        try {
            console.log("Downloading backup");
            const ruta = await userService.backupBD(); // Supongamos que `ruta` es un string con los datos de la copia de seguridad
    
            // Crear un blob con los datos del backup
            const blob = new Blob([ruta], { type: 'text/plain' });
    
            // Crear una URL para el blob
            const url = URL.createObjectURL(blob);
    
            // Crear un enlace para descargar el archivo
            const a = document.createElement('a');
            a.href = url;
            const today = new Date()
            const day = today.getDay()
            const motnh = today.getMonth()
            const year = today.getFullYear()
            a.download = `Backup-${day}_${motnh}_${year}.bson`; // Nombre del archivo
            document.body.appendChild(a); // Añadir el enlace al DOM
            a.click(); // Simular un click para iniciar la descarga
    
            // Limpiar el DOM
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Backup descargado correctamente");
        } catch (error) {
            console.error("Error al descargar el backup", error);
        }
    };

    const loadBackup = () => {
        console.log("Loading backup")
        userService.backupBDLoad()
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
                <Paragraph>Hola Admin, En esta seccion encontraras las opciones de backup</Paragraph>
                <Divider orientation="horizontal" />
                <View>
                    <Text style = {styles.subtitle}>
                        Realizar Backup del sistema</Text>
                    <Text p style={styles.text}> Presionando este bot&oacute;n podr&aacute;s descargar una copia de seguridad de la Base de Datos del Sistema.
                    </Text>
                        <Button mode ="outlined"
                          onPress = {()=> downloadBackup()}
                        >
                        Descargar backup</Button>

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
