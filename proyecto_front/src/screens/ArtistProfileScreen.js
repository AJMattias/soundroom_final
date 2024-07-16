import React, { useState } from "react";
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


export const ArtistProfileScreen = ({ route, navigation }) => {
    const [user, setUser] = useState()
    const [artist, setArtist] = useState()
    const [userFetched, setUserFetched] = useState(false)
    const [ratings, setRatings] = useState([])
    const [rooms, setRooms] = useState([])
    // Reservas del artista hacia alguna sala del usuario logueado.
    const [artistReservations, setArtistReservations] = useState([])
    const { userId } = route.params

    const fetchUser = async () => {
        try {
            setArtist(
                await userService.getUserBd(userId)
            )
            //get opinions to user artist
            //await fetchProfile()
            //await fetchRooms()
            //fetchRatings(userId).then()
            console.log('artista: ', user)
            setUserFetched(true)
        } catch (apiError) {
            console.log("Error fetching user with Id")
            console.log(apiError)
        }

    }

    const fetchProfile = async () => {
        try {
            const artist = await artistService.getArtistByUserId(userId)
            setArtist(artist)
            //etchArtistReservations(userId).then()
            //fetchRatings(userId).then()
        } catch (apiError) {
            console.error("Error fetching profile")
            console.error(apiError)
        }
    }

    const fetchRooms = async () => {
        try {
            setRooms(
                await roomService.getRoomsByUserId(userId)
            )
        } catch (apiError) {
            console.error("Error fetching user rooms")
            console.error(apiError)
        }
    }

    //opiniones al artista
    const fetchRatings = async (userId) => {
        // try {
        //     setRatings(
        //        await ratingsService.getArtistOpinions(otherUserId)
        //     )
        //     console.log('ratings: ', ratings)
        // } catch (apiError) {
        //     console.error("Error fetching ratings")
        //     console.error(apiError)
        // }
    }

    // si tiene mas de una reserva se le puede opinar
    const fetchArtistReservations = async (otherUserId) => {
        try {
            const myReservations = await reservationService.getArtistReservatiosToMyRooms(userId)
            setArtistReservations(
                myReservations.filter(
                    (reservation) => {
                        reservation.user.id == otherUserId
                    }
                )
            )
            console.log('artistReservations: ', artistReservations)
        } catch(ignored) {
            console.error(ignored)
        }
    }

    const sendCommentNotification = async () => {
        try {
            const currentUser = LocalPhoneStorage.get(STORAGE_USER)
            await emailService.sendEmailToUser(
                user , `¡${currentUser.name + currentUser.last_name} te ha enviado una calificación! Logueate en la aplicación para verla.` 
            )
        } catch (ignored) {
            console.error(ignored)
        }
    }
 
    const renderRatings = () => {
        if (ratings.length > 0) {
            return (
                <Rating ratings = {ratings} />
            )
        }
    }

    const renderArtistRating = () => {
        if (ratings.length > 0) {
            console.log("ratings")
            console.log(ratings)
            const comments = ratings.map((rating) => <RateComment  rate={rating} user = {rating.user} onClick = {() => openProfile(rating.user)} />)
            return (
                <Block style={styles.column}>
                    <Text style={[styles.subtitle, theme.styles.m24]}>Comentarios</Text>
                    {comments}
                </Block>

            )
        }
    }

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

    if (!userFetched) {
        fetchUser().then()
        // fetchArtistReservations(userId).then()
        // fetchRatings(userId).then()
       
    }

    return (
        <StateScreen loading={!userFetched}>
            <Screen navigation={navigation}>
                <UserAvatar user={artist} />
                <Block row center flex style = {{display: rooms.length > 0 ? 'flex': 'none'}}  >
                    <Text style = {styles.ownerLabel}>Propietario</Text>
                </Block>
                { renderArtistProfile() }
                {
                    user &&  artistReservations && artistReservations.length > 0 &&
                        <AddComment
                            otherId = {userId}
                            title = {"Tu opinión sobre "+user.name}
                            placeholder = "Escribe tu reseña sobre este artista para ayudar a otros propietarios."
                            user = {LocalPhoneStorage.get(STORAGE_USER)} 
                            onRatingCreated = {() => sendCommentNotification().then()}
                            onRatingUpdated = {() => fetchRatings().then()}
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
    }

})
