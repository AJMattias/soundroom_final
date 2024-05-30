/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { Avatar, Header, ListItem } from "react-native-elements";
import { List, Text } from "react-native-paper";
import { Navigation } from "../components";
import BackButton from "../components/BackButton";
import Background from "../components/Background";
import Button from '../components/Button'
import { theme } from "../core/theme";

export default function CreateUserProfileScreen ({navigation}){
    const initialState ={
        id:'',
        user_name:'AlejandroJM',
        name:'Alejandro',
        last_name:'Mattias',
        email:'alejandro@gmail.com',
    }

    const [user, setUser] = useState();

    const openConfirmationAlert = () => {
        Alert.alert('Remove   User: Estas Seguro', [
            {text: 'Si', onPress: () => deleteUser()},
            {text: 'No', onPress: () => console.log(false)},
        ])
    }

    const deleteUser = () => {
        initialState.name=''
        initialState.user_name= ''
        initialState.last_name=''
        initialState.email=''
        navigation.navigate('StartScreen')
    }
    return(
        <><Header
        backgroundColor={theme.colors.primary}
        leftComponent={<BackButton goBack={navigation.goBack}/>}
        centerComponent={{text:'Perfil Usuario', style:{color:'#000'}}}
        />
        <ScrollView>
            {/* <Header> Modificar usuario</Header> */}
            <View>
            
            <Avatar
            size="large"
            source={require('../assets/avatar--photo.jpg')}
            />
            </View>
            <View>
                <Text h3 >Nombre Usuario:</Text>
                <Text styles={styles.text}>Zahi_manzur</Text>
                <Text h3 >Nombre:</Text>
                <Text styles={styles.text}>Zahira</Text>
                <Text h3 >Apellido:</Text>
                <Text styles={styles.text}>Manzur</Text>
                <Text h3 >Email:</Text>
                <Text styles={styles.text}>zahiraManzur@gmail.com</Text>
                <Text h3 >Tipo de Artista:</Text>
                <Text styles={styles.text}>Musico</Text>
            </View>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('ModifyUserScreen')}>
                {/* onPress={() => props.navigation.navigate('ModifyUserScreen')} */}
                Modificar usuario
            </Button>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('StartScreen')}>
                    {/* onPress={() => openConfirmationAlert()}> */}
                Eliminar usuario
            </Button>
        </ScrollView></>
    )
}
const styles = StyleSheet.create({
    text: {
        flex: 1,
        padding: 0 ,
        marginBottom: 15,
        borderBottomWidth:1,
        borderBottomColor:'#cccccc'
    },
    button:{
       backgroundColor: theme.colors.surface
    }
})