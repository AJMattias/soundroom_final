import React, { useEffect, useState } from "react";
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
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"
import { userSevice } from "../network/UserService"
import { artistService } from "../network/ArtistService"
import { RateComment } from "../components/RateComment";
import { Rating } from "../components/Rating";
import { AddComment } from "../components/AddComment";
import { reservationService } from "../network/ReservationService";
import { emailService } from "../network/EmailService";
import { ratingsService } from "../network/RatingsService";
import { AddCommentTA } from "../components/AddCommentTA";


export const ArtistProfileScreen = ({ route, navigation }) => {
    const [userLogged, setUserLogged] = useState()
    const [artist, setArtist] = useState()
    const [userFetched, setUserFetched] = useState(false)
    const [ratings, setRatings] = useState([])
    const [rooms, setRooms] = useState([])
    // Reservas del artista hacia alguna sala del usuario logueado.
    const [artistReservations, setArtistReservations] = useState([])
    // artista a mostrar en pantalla
    const { userId } = route.params
    const [estrellasProm, setEstrellasProm] = useState(0)

    //usar useEffect en vez de !userFetched
    useEffect(() => {
        const fetchUser = async () => {
            const userloged = LocalPhoneStorage.get(STORAGE_USER);
            setUserLogged(userloged);
            try {
                const fetchedArtist = await userService.getUserBd(userId);
                setArtist(fetchedArtist);
                console.log('artista: ', fetchedArtist);

                await fetchArtistReservations(userId);
                await fetchRatings(userId);
                await fetchPromedioEstrellas();
                setUserFetched(true);
            } catch (apiError) {
                console.log("Error fetching user with Id");
                console.log(apiError);
            }
        };
        fetchUser();
    }, [userId, 
        //ratings
        ]);

    //Se renderizaba muchas veces, mejor usar useeffect
    // const fetchUser = async () => {
    //     //Usuario logueado
    //     const userloged = LocalPhoneStorage.get(STORAGE_USER)
    //     setUserLogged(userloged)
    //     //artista a mostrar
    //     try {
    //         setArtist(
    //             await userService.getUserBd(userId)
    //         )
    //         console.log('artista: ', artist)
            
    //         //get opinions to user artist
    //         //buscar reservaciones a mis salas, si tiene el SdE puede opinar
    //         fetchArtistReservations(userId).then()
    //         //busco opiniones al artista
    //         fetchRatings(userId).then()
    //         fetchPromedioEstrellas().then()
    //         //await fetchProfile()
    //         //await fetchRooms()
            
            
    //         //buscar reservaciones a mis salas, si tiene el SdE puede opinar
    //         //fetchArtistReservations(userId).then()
            
    //         setUserFetched(true)
    //     } catch (apiError) {
    //         console.log("Error fetching user with Id")
    //         console.log(apiError)
    //     }

    // }

    //no se usa, ya se busca el usuario artista en la funcion  fetchUser
    // const fetchProfile = async () => {
    //     try {
    //         const artist = await artistService.getArtistByUserId(userId)
    //         setArtist(artist)
    //         fetchArtistReservations(userId).then()
    //         fetchRatings(userId).then()
    //     } catch (apiError) {
    //         console.error("Error fetching profile")
    //         console.error(apiError)
    //     }
    // }

    //no se usa la funcion fetchRooms
    //rooms para el carrusel. Buscsar con mejores rating
    // const fetchRooms = async () => {
    //     try {
    //         setRooms(
    //             await roomService.getRoomsByUserId(userId)
    //         )
    //     } catch (apiError) {
    //         console.error("Error fetching user rooms")
    //         console.error(apiError)
    //     }
    // }

    //opiniones al artista
    const fetchRatings = async (userId) => {
        try {
            setRatings(
               await ratingsService.getArtistOpinions(userId)
            )
            console.log('ratings: ', ratings)
        } catch (apiError) {
            console.error("Error fetching ratings")
            console.error(apiError)
        }
    }

    // si tiene mas de una reserva se le puede opinar
    const fetchArtistReservations = async (userId) => {
        try {
            const myReservations = await reservationService.getArtistReservatiosToMyRooms(userId)
            setArtistReservations(myReservations)
                //Ya busco las reservas del artista a mis sde 
                // y me traigo de la bd esas reservas
                // myReservations.filter(
                //     (reservation) => {
                //         reservation.user.id == userId
                //     }
                // ))
            console.log('artistReservations: ', artistReservations)
        } catch(ignored) {
            console.error(ignored)
        }
    }

    const fetchPromedioEstrellas = async () =>{
        try {
            //const idArtista = room.id
            const promedioSala = await artistService.getPromedioArtista(userId)
            setEstrellasProm(promedioSala)
            console.log("promedio sala: ", estrellasProm)
        } catch (error) {
            console.error(apiError)
        }
    }

    const getUser = () => {
        //console.log(LocalPhoneStorage.get(STORAGE_USER))
        return LocalPhoneStorage.get(STORAGE_USER)
    }

    const sendCommentNotification = async () => {
        try {
            const currentUser = LocalPhoneStorage.get(STORAGE_USER)
            await emailService.sendEmailToUser(
                // antes era user en vez de artist
                artist , `¡${currentUser.name + currentUser.last_name} te ha enviado una calificación! Logueate en la aplicación para verla.` 
            )
        } catch (ignored) {
            console.error(ignored)
        }
    }
 
    const sendUpdateCommentNotification = async () => {
        try {
            const user = getUser()
            emailService.sendEmailToUser(
                artist, `¡${user.name} ${user.last_name} ha actualizado su calificacion a tu perfil! Logueate en la app para ver las calificaciones.`
            )
        } catch (ignored) {
            console.log(ignored)
        }
    }

    const renderRatings = () => {
        console.log('ratings render', ratings)
        if ( ratings && ratings.length > 0) {
            return (
                <Rating ratings = {ratings}  estrellasProm={estrellasProm} size={15}/>
            )
        } else {
            return (
                <Text style = {styles.ratingsText}>Sin opiniones todav&iacute;a</Text>
            )
        }
    }

    const renderArtistRating = () => {
        if (ratings.length > 0) {
            console.log("ratings")
            console.log(ratings)
            const comments = ratings.map((rating) => <RateComment  rate={rating} user = {rating.idUser} onClick = {() => console.log(rating.idUser._id)} />)
            return (
                <Block style={styles.column}>
                    <Text style={[styles.subtitle, theme.styles.m24]}>Comentarios</Text>
                    {comments}
                </Block>

            )
        }
    }

    //Es la pantalla de artista, se deberia navegar a la pantalla de otro artista o del usuario SdeE
    const openProfile = (other) => {
        console.log("navigate to "+other.id)
        navigation.push("ArtistProfileScreen", {userId: other.id})
    }

    const renderArtistProfile = () => {
        console.log("Artist: ")
        console.log(artist)
        if (!artist) {
            return
        }
        return (
            <Block style={[styles.column, theme.styles.m48]}>
                <Text style={styles.subtitle}>Perfil Artista</Text>
                <Block row style={styles.row}>
                    <Icon name='note' family='Entypo' size={24} color={theme.colors.grey600} />
                   {/* tipo de artista */}
                    <Text style={[styles.textBig, { marginStart: 8 }]}>{artist.tipoArtista}</Text>
                </Block>
                { renderRatings()}
            </Block>
        )
    }

    const renderRooms = () => {
        if(rooms.length > 0) {
            return (
               <Carousel style= {theme.styles.m48} rooms = {rooms} navigation = {navigation} title = {"Salas de "+user.name}/>
            )
        }
    }

    // if (!userFetched) {
    //     fetchUser().then()
    //     // fetchArtistReservations(userId).then()
    //     // fetchRatings(userId).then()
       
    // }

    return (
        <StateScreen loading={!userFetched}>
            <Screen navigation={navigation}>
                <UserAvatar user={artist} />
                <Block row center flex style = {{display: rooms.length > 0 ? 'flex': 'none'}}  >
                    <Text style = {styles.ownerLabel}>Propietario</Text>
                </Block>
                { renderArtistProfile() }
                {/* Como SdE puedo opinar del artista que reservo/uso mi sala */}
                {
                    // se usaba user en vez de artist
                    artist &&  artistReservations && artistReservations.length > 0 &&
                        <AddCommentTA
                            otherId = {userId}
                            title = {"Tu opinión sobre "+artist.name}
                            placeholder = "Escribe tu reseña sobre este artista para ayudar a otros propietarios."
                            user = {LocalPhoneStorage.get(STORAGE_USER)} 
                            onRatingCreated = {() => sendCommentNotification().then()}
                            //onRatingUpdated = {() => fetchRatings().then()}
                            onRatingUpdated = {() => sendUpdateCommentNotification().then()}
                        />
                }
                { renderArtistRating() }
                { renderRooms() }
            </Screen>
        </StateScreen>
    )


}

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column'
    },
    row: {
        alignItems: 'center'
    },

    subtitle: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: '600'

    },
    text: {
        color: theme.colors.grey600,
        fontSize: theme.SIZES.FONT
    },
    textBig: {
        color: theme.colors.grey600,
        fontSize: theme.SIZES.FONT * 1.25
    },

    ownerLabel: {
        color: theme.colors.primary,
        fontSize: theme.SIZES.FONT,
        fontWeight: 600,
        marginTop: 8    
    },
    ratingsText: {
        fontSize: theme.SIZES.FONT ,
        color: theme.colors.primary
    }

})
