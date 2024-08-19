/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { ReservationCard } from "../components/ReservationCard";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { reservationService } from "../network/ReservationService";
import { Text, Block, Icon } from 'galio-framework'
import { jsPDF } from "jspdf";
import TextInput from "../components/TextInput";
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';

export const ReservationsScreen = ({navigation}) => {

    const [reservations , setReservations] = useState([])
    const [ownerResevations, setOwnerReservations] = useState([])
    const [reservationsFetched , setReservationsFetched] = useState(false)
    const [query, setQuery] = useState("")
    const [key, setKey] = useState('home');
    const user = LocalPhoneStorage.get(STORAGE_USER)

    const renderReservations = () => {
        if(reservations && reservations.length > 0) {
            console.log("rendering")
            console.log(reservations)
            return (
                reservations.map((reservation) => (
                    <ReservationCard    
                        reservation = {reservation} 
                        navigation  = {navigation}
                        onReservationCancelled = {reloadReservations}
                    />
                ))
            )
        } else {
            return (
                <Text style = {styles.notFoundText}>No tienes reservas.</Text>
            )
        }
    }

    const renderOwnerReservations = () => {
        if(ownerResevations && ownerResevations.length > 0) {
            return (
                <Block style = {styles.ownerReservationWrapper}>
                    <Text style = {styles.title}> Reservas a tus salas </Text>
                    {ownerResevations.map((reservation) => (
                        <ReservationCard    
                        reservation = {reservation} 
                        navigation  = {navigation}
                        onReservationCancelled = {reloadReservations}
                    />
                    ))}
                </Block>
            )
        } else {
            return (
                <Text style = {styles.notFoundText}>No tienes reservas a tus salas.</Text>
            )
        }
    }
    //Aca empiezo lo de la busqueda je
    const reservationsSearch = () => {
        if(reservations && reservations.length > 0) {
            return  renderSearchResults()
        } else {
            return (
                <Text style = {styles.notFoundText}>No tienes reservas.</Text>
            )
        }
    }

    const searchReservations = async (query) => {
        console.log("On search")
        console.log(query)
        setQuery(query)
        setReservations(
            await reservationService.findByNameReservations(query)
        )
    }


    const renderSearchResults = () => {
        console.log("rendering")
        console.log(reservations)
        return (
            reservations.map((reservation) => (
                <ReservationCard    
                    reservation = {reservation} 
                    navigation  = {navigation}
                    onReservationCancelled = {reloadReservations}
                    setReservationsFetched = {setReservationsFetched}
                />
            ))
        )
    }

    const reservationsOwnerSearch = () => {
        if(ownerResevations && ownerResevations.length > 0) {
            return (
                <Block style = {styles.ownerReservationWrapper}>
                    <Text style = {styles.title}> Reservas a tus salas </Text> 
                    <TextInput label = "Ingresa tu búsqueda"  onChangeText = {searchOwnerReservations} />
                    {renderOwnerSearchResults()}
                </Block>
            )
        } else {
            return (
                <Text style = {styles.notFoundText}>No tienes reservas.</Text>
            )
        }
    }

    const searchOwnerReservations = async (query) => {
        console.log("On search")
        console.log(query)
        setQuery(query)
        setOwnerReservations(
            await reservationService.findByNameOwnerReservations(query)
        )
    }


    const renderOwnerSearchResults = () => {   
        return (
            <Block style = {styles.ownerReservationWrapper}>
                {ownerResevations.map((reservation) => (
                    <ReservationCard    
                    reservation = {reservation} 
                    navigation  = {navigation}
                    onReservationCancelled = {reloadReservations}
                    setReservationsFetched ={setReservationsFetched}
                />
                ))}
            </Block>
        )
    }


    //hasta aca
    // const fetchReservations = async () => {
    //     const reserves=  await reservationService.getMyReservations()
    //     console.log("reservations")
    //     console.log(reserves)
    //     setReservations(reserves)
    // }

    //
    const fetchReservationsDB = async () => {
        //perfil Artista
        const user = LocalPhoneStorage.get(STORAGE_USER)
        console.log("buscando reservas hechas por el user")
        if(user.idPerfil.name == 'Artista'){
            const response=  await reservationService.getMyReservationsBd()
            const reservations = response
            console.log("reservations")
            console.log(reservations)
            setReservations(reservations)
        }
    }
    
    const fetchOwnerReservations = async () => {
        const response = await reservationService.getReservationsFromMyRoomsBd()
        const reservations = response
        console.log("owner reservations")
        console.log(reservations)
        setOwnerReservations(reservations)
    }

    const fetchOwnerReservationsBd = async () => {
        const reservations = await reservationService.getReservationsFromMyRoomsBd()
        console.log("owner reservations")
        console.log(reservations)
        setOwnerReservations(reservations)
    }

    const fetchDataReservations = async () =>{
         
    }

    const reloadReservations  = () => {
        //Todo If tipo perfil = artista
        const user = LocalPhoneStorage.get(STORAGE_USER)
        console.log("buscando reservas hechas por el user")
        if(user.idPerfil.name == 'Artista'){
            fetchReservationsDB().then()
            fetchDataReservations().then()
            setReservationsFetched(true)
        }
        //Todo if tipo perfil = sala 
        if(user.idPerfil.name == 'Sala de Ensayo'){
        fetchOwnerReservations().then()
        setReservationsFetched(true)
        }    
    }

    // if(!reservationsFetched) {
    //     reloadReservations()
    //     setReservationsFetched(true)
    // }

    
    const mostrarReserva = () => {   
        return (
            <Block style = {styles.ownerReservationWrapper}>
                {ownerResevations.map((reservation) => (
                    <ReservationCard   
                    reservation = {reservation} 
                    navigation  = {navigation}
                    onReservationCancelled = {reloadReservations}
                    />
                ))}
            </Block>
        )
    }
    
    const openOwnerReservations = () => {
        navigation.navigate("OrdersScreen")
    }
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            reloadReservations();
        });

        if (!reservationsFetched) {
            reloadReservations();
        }

        return unsubscribe;
    }, [navigation, reservationsFetched])

    // useEffect(()=> {
    //     if(!reservationsFetched) {
    //         reloadReservations()
    //         setReservationsFetched(true)
    //     }
    // })

    // React.useEffect( () => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //     });
    //     return unsubscribe
    //   }, [navigation]);


    return (
        
        <StateScreen loading = {!reservationsFetched}>
            <Screen rootScreen = {true} navigation = {navigation}>
                <ScrollView>
                    {reservationsSearch()}
                    {/* TODO en caso que sea tipo Sala de ensayo mostrar: Reservasa tus salas */}
                    { user.idPerfil.name == 'Sala de Ensayo' &&
                    <Block style = {styles.ownerReservationsRow}>
                        <Icon name = "briefcase" family = "Feather" color = {theme.colors.blueAccent700} size = {28}/>
                        <Text 
                            style = {styles.ownerReservationsLink}
                            onPress = {() =>  openOwnerReservations()}
                        > Reservas a tus salas</Text>
                    </Block>
                    }
                     {/*  en caso de que se rompa, mostrar, descomentar
                    { ownerResevations && ownerResevations.length >0 &&
                        <Block style = {styles.ownerReservationWrapper}>
                            {ownerResevations.map((reservation) => (
                                <ReservationCard   
                                reservation = {reservation} 
                                navigation  = {navigation}
                                onReservationCancelled = {reloadReservations}
                                />
                            ))}
                        </Block>
                    }
                     */}
                </ScrollView>
            </Screen>
        </StateScreen>
    )

}


const styles =  StyleSheet.create({
    title:  {
        fontSize: theme.SIZES.FONT * 1.3,
        fontWeight: 600,
        marginBottom: 24
    },

    notFoundText: {
        fontSize: theme.SIZES.FONT*1.5,
        color: theme.colors.grey600,
        width: '100%',
    },

    ownerReservationWrapper: {
        marginTop: 48,
        flexDirection: 'column',
        width: '100%'
    },

    ownerReservationsLink: {
        paddingStart: 4,
        paddingEnd: 16,
        color: theme.colors.blueAccent700,
        fontSize: theme.SIZES.FONT * 1.2

    },

    ownerReservationsRow: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 24
    }


})