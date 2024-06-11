import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, ScrollView } from 'react-native'
import { StateScreen } from '../components/StateScreen'
import { Rating } from '../components/Rating'
import { Screen } from '../components/Screen'
import { Block, Text, Card, Icon } from 'galio-framework'
import { theme } from '../core/theme'
import { roomService } from '../network/RoomService'
import { RateComment } from '../components/RateComment'
import { FooterButton } from '../components/FooterButton'
import { Price } from '../components/Price'
import { MockStore } from '../mock/MockStore'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import Tags from 'react-native-tags'
import { AddComment } from '../components/AddComment'
import { reservationService } from '../network/ReservationService'
import { emailService } from '../network/EmailService'
import { userService } from '../network/UserService'
import { ratingsService } from '../network/RatingsService'

export const RoomScreen = ({ route, navigation }) => {
    const { roomId } = route.params
    const [roomFetched, setRoomFetched] = useState(false)
    const [room, setRoom] = useState({
        id:"",
        nameSalaEnsayo:"",
        calleDireccion:"",
        numeroDireccion:0,
        idOwner:"",
        precioHora:0,
        idType:"",
        enabled:true,
        descripcion:"",
        comodidades:[],
        opiniones:[]

    })
    const [comodidades, setComodidades] = useState([])
    const [idDueño, setIdDueño] = useState("")
    const [owner, setOwner] = useState({
        name: " ",
        last_name: "",
        email: "",
        password: "",
        idSalaDeEnsayo: [],
        id: "",
        isAdmin: false,
        enabled: "",
        createdAt: "",
        userType: ""
    })
    const [loggedUser, setLoggedUser] = useState()
    const [estrellasProm, setEstrellasProm] = useState(0)
    const [ratings, setRatings] = useState([])
    const [userReservations, setUserReservations] = useState([])
    let idOwner = '' 
    let idSala = ''
    //let ownerName =''
    const [name, setName] = useState('')
    const img =''
    

     
    const fetchRoom = async () => {
        try {
        //TODO: la llamada a getRoomBd debe retornar solo la sala
        // hacer otra llamada para obtener el owner, cuyo id estara en la sala
        // otra llamada para obtener el promedio de estrellas, hacer en back el endpoint
            console.log("roomId : " + roomId)
            //setRoom se usa con mockstore 
            //setRoom(
            //     await roomService.getRoomBd(roomId)
            // )

            setLoggedUser(getUser())
            //TODO reemplazar todas las funciones getUser().id por logeedUSer.id

            let roomCreated = await roomService.getRoomBd(roomId)
            console.log('roomCreated: ', roomCreated)
            setRoom(roomCreated)
            console.log('room: ',room)
            idSala = roomCreated.id
            console.log('idRoom to get reservation:', idSala)
            idOwner = roomCreated.idOwner
            console.log("id dueño sala: ", idOwner)
            setComodidades(roomCreated.comodidades)
            console.log('room.comoidades: ', room.comodidades)
            console.log('comodidades: ', comodidades)

            

            
            
            //buscar owner
            console.log("buscando dueño de sala de id: ", idOwner)
            const roomOwner = room.idOwner
            console.log(roomOwner)
            //await userService.getUserDb(idOwner)
            setOwner(roomOwner)
            //nombre completo
            const ownerName =  `${roomOwner.name} ${roomOwner.lastName}`
            console.log('ownerName: ', ownerName)
            setName(ownerName)
            console.log("owner: ", ownerName)

            const logeedUserId = getUser().id
            //buscar reservas a la sala para render opiniones
            const idSala2 = room.id
            const reservasdelusuarioasalal =  await reservationService.getMyRoomReservationBd(logeedUserId, roomId)
            setUserReservations(reservasdelusuarioasalal)
            console.log('reservas del usuario logueado a la sala: ', userReservations)

            //buscar promedioEstrellas sala
            // const promedioSala = await userService.getUserDb(idSala)
            // setEstrellasProm(promedioSala)
            // console.log("promedio sala: ", estrellasProm)
            img = require("../assets/user.png")

        } catch (apiError) {
            console.error(apiError)
            
        }
    }

    // const fetchOwner  = async() => {
    //     try {
    //         const idOwner = roomId
    //         console.log("buscando dueño de sala de id: ", idOwner)
    //         const roomOwner = await userService.getUser(idOwner)
    //         setOwner(roomOwner)
    //         console.log("owner: ", roomOwner)
    //     } catch (error) {
    //         console.error(apiError)
    //         setRoomFetched(true)
    //     }
    // }

    const fetchPromedioEstrellas = async () =>{
        try {
            const idSala = room.id
            const promedioSala = await roomService.getPromedioSala(roomId)
            setEstrellasProm(promedioSala)
            console.log("promedio sala: ", estrellasProm)
        } catch (error) {
            console.error(apiError)
            setRoomFetched(true)
        }
    }



    //if (!roomFetched) {
        //fetchRoom()
        // fetchRatings().then()
        // fetchUserReservations().then()
    //}

    // useEffect(() => {
    //   setRoomFetched(false)
    //   fetchRoom().then()
    //   fetchUserReservations().then()
    //   fetchRoomRatings().then()
    //   // fetchOwner()
    //   fetchPromedioEstrellas().then()
    // //TODO si room.opiniones.length >0 traer las opiniones y render ratings
    //   setRoomFetched(true)
    // }, [])

    //Cuando vuelvo para atras a esta pantalla, se debe acualizar
    React.useEffect( () => {
        const unsubscribe = navigation.addListener('focus', () => {
            setRoomFetched(false)
            fetchRoom().then()
            fetchUserReservations().then()
            fetchRoomRatings().then()
            // fetchOwner()
            fetchPromedioEstrellas().then()
            setRoomFetched(true)
        });
        return unsubscribe
      }, [navigation])
    
    //useEffect
    // useEffect(()=>{
    //     console.log('El useEffect se está ejecutando');
    //     const fetchRoom = async () => {
    //         try {
    //             console.log("roomId : " + roomId)
    //             //setRoom se usa con mockstore 
    //             //setRoom(
    //             //     await roomService.getRoomBd(roomId)
    //             // )
    //             const roomCreated = await roomService.getRoomBd(roomId)
    //             console.log('roomCreated: ', roomCreated)
    //             setRoom(roomCreated.sala)
    //             setEstrellasProm(roomCreated.promedioEstrellas)
    //             console.log("In room")
    //             console.log(room)
    //             console.log('user:', getUser())
    //             setOwner(room.idOwner)
    //             console.log(owner)
    //             setRoomFetched(true)
                
    //         } catch (apiError) {
    //             console.error(apiError)
    //             setRoomFetched(true)
    //         }
    //     }
    //     fetchRoom()
    // },[])

   
    

    // const fetchRatings = async () => {
    //     const user = LocalPhoneStorage.get(STORAGE_USER)
    //     try {
    //         setRatings(
    //             await (await roomService.getRatings(roomId)).filter(
    //                 (rating) => rating.user.id !== user.id
    //             )
    //         )
    //     } catch (apiError) {
    //         console.error("Error fetching ratings")
    //         console.error(apiError)
    //     }
    // }

    const fetchRoomRatings = async () => {
        const user = LocalPhoneStorage.get(STORAGE_USER)
        try {
            const response = await ratingsService.getRoomOpinions(roomId)
            const opiniones = response
            setRatings(opiniones.opiniones)
            console.log('response to room opinions: ', response)
            console.log('opiniones useState: ', ratings)
        } catch (apiError) {
            console.error("Error fetching ratings")
            console.error(apiError)
        }
    }

    const fetchUserReservations = async () => {
        try {
            setUserReservations(
                await reservationService.getMyRoomReservationBd(getUser().id, roomId)
            )
            console.log('reservas del usuario logueado a la sala: ', userReservations)
        } catch (ignored){
            console.log(ignored)
        }
    }

    const sendCommentNotification = async () => {
        try {
            const user = getUser()
            emailService.sendEmailToUser(
                room.idOwner.email, `¡${user.name} ${user.last_name} ha calificado tu sala, ${room.name}! Logueate en la app para ver las calificaciones.`
            )
        } catch (ignored) {
            console.log(ignored)
        }
    }

    const sendUpdateCommentNotification = async () => {
        try {
            const user = getUser()
            emailService.sendEmailToUser(
                room.idOwner.email, `¡${user.name} ${user.last_name} ha actualizado su calificacion a tu sala, ${room.name}! Logueate en la app para ver las calificaciones.`
            )
        } catch (ignored) {
            console.log(ignored)
        }
    }

   

    const renderRatings = () => {
        if (ratings && ratings.length > 0) {
            return (
                <Rating ratings={ratings} estrellasProm={estrellasProm} size={15} />
            )
        } else {
            return (
                <Text style = {styles.ratingsText}>Sin opiniones todav&iacute;a</Text>
            )
        }
    }


    const renderComments = () => {
        if (ratings) {
            return ratings.map((rating) => {
               return ( <RateComment style = {{marginTop: 4, marginBottom: 4}} user={rating.idUser} rate={rating} onClick = {()=>openArtistScreen(rating.idUuser._id) } /> )
              })
        }
    }

    const openArtistScreen = (artist) => {
        navigation.push("ArtistProfileScreen", {
            userId: artist.id
        })
    }

    const getUser = () => {
        //console.log(LocalPhoneStorage.get(STORAGE_USER))
        return LocalPhoneStorage.get(STORAGE_USER)
    }

    const openReserveRoomScreen = () => {
        navigation.push("ReserveRoomScreen", {
            roomId: roomId
        })
    }

    const deleteRoom = async () => {
        await roomService.deleteRoom(roomId)
        navigation.reset({
            index: 0,
            routes: [{ name: "UserProfileScreen2" }],
          })
    } 
    const habilitacion = () => {
        console.log(room)
        if (room.enabled == true) {
            return (< Text style={styles.habilitada} > Sala Habilitada </Text >)
            
        } else {
            return (< Text style={styles.deshabilitada} > Sala Deshabilitada </Text >)
            
        }
    }

    const openEditRoom = () => {
        navigation.push("EditRoom", {
           roomId: roomId
        })
    }


    return (
        <StateScreen loading={!roomFetched} >
            <Screen navigation={navigation} >
                <ScrollView>
                    <Image style={styles.image} source={
                        //room.image? room.image : 
                        require('../assets/theatre.png')} 
                        />
                    <Text style={styles.title}>{room.nameSalaEnsayo}</Text>
                    <Text style={styles.subtitle}>Tipo de Sala: Musical</Text>
                    <Block row  style = {styles.priceRow}>
                    {renderRatings()}
                    <Price price = {room.precioHora} style = {styles.priceText}  />
                    </Block>
                    <Block row style={styles.locationContainer}>
                        <Icon size={24} color={theme.colors.grey600} name='location-pin' family='MaterialIcons' />
                        <Text style={styles.text}>{room.calleDireccion}</Text>
                    </Block>
                    
                    <Tags
                        initialTags={room.comodidades}
                        onChangeTags={(tags) => console.log(tags)}
                        onTagPress={(index, tagLabel, event) =>
                          console.log(index, tagLabel, event)
                        }
                        onPress={(index, tagLabel, event) =>
                          console.log(index, tagLabel, event)}
                        inputStyle={styles.tags}
                        deleteTagOnPress={false}
                        readonly={true}
                   />
                    { room.idOwner && room.idOwner._id == getUser().id  && 
                        <Block 
                            style = {styles.deleteRoomRow}
                            onClick = {deleteRoom}
                        >
                            <Icon size = {24} name = 'trash-2' family = 'Feather'color = {theme.colors.error} />
                            <Text style = {styles.deleteText} >Eliminar sala</Text>
                         </Block>
                    }
                    { room.idOwner && room.idOwner._id == getUser().id  && 
                         <Block 
                            style = {styles.editRoomRow}
                            onClick = {openEditRoom}
                        >
                            <Icon size = {24} name = 'edit' family = 'Feather'color = {theme.colors.green50} />
                            <Text style = {styles.editText} >Editar sala</Text>
                         </Block>
                    }
                    {room.idOwner && room.idOwner._id == getUser().id &&
                        <Block
                            style={styles.editRoomRow}
                    >
                        {habilitacion()}
                        </Block>
                    }
                    <Card borderless shadow 
                         style={styles.owner} 
                         avatar ={img}
                         //avatar={room.ownerImage} 
                         title={`${room.idOwner.name} ${room.idOwner.lastName}`} 
                         caption = "Propietario"
                         captionColor = {theme.colors.primary}
                    />
                    <Text style={styles.subtitle}>Descripcion</Text>
                    <Text p style={styles.text}>
                        {room.descripcion}
                    </Text>
                   
                    {
                        room && userReservations.length > 0 && 
                        <AddComment
                            otherId = {roomId}
                            title = "Tu opinión de la Sala"
                            placeholder = "Escribe una reseña para ayudar a otros artistas a evaluar esta sala."
                            user = {getUser()}
                            onRatingCreated = {() => sendCommentNotification().then()}
                            onRatingUpdated = {() => sendUpdateCommentNotification().then()}
                        />    
                    }

                   {ratings && ratings.length >0 && 
                    <Text style={[styles.subtitle, theme.styles.m24]}>Opiniones</Text>
                   }
                   {renderComments()}
                </ScrollView>
            </Screen>
           { room.idOwner && room.idOwner._id != getUser().id && 
            <FooterButton buttonText = "Reservar" onClick = {()=> openReserveRoomScreen()}></FooterButton>
          } 
        </StateScreen>
    )
}

const styles = StyleSheet.create({
    tags: {
        backgroundColor: theme.colors.primary,
        border: "2px solid #717171",
        borderRadius: 10
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 5
    },
    title: {
        marginTop: 24,
        marginBottom: 16,
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600
    },
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },

    owner: {
        marginTop: 16,
        marginBottom: 16
    },

    locationContainer: {
        alignItems: 'center',
        marginTop: 16
    },

    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
    },

    comment: {
        marginBottom: 16,
        marginTop: 16
    },

    priceText:  {
        marginEnd: 16
    },

    priceRow: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    deleteRoomRow: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 16
    },

    editRoomRow: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 16
    },

    deleteText: {
        color: theme.colors.error,
        fontSize: theme.SIZES.FONT ,
        fontWeight:600,
        marginStart: 8
    },
    habilitada: {
        color: "#1D7837",
        fontSize: theme.SIZES.FONT,
        fontWeight: 600,
        marginStart: 8
    },
    deshabilitada: {
        color: "#CC0648",
        fontSize: theme.SIZES.FONT,
        fontWeight: 600,
        marginStart: 8
    },
    editText: {
        color: theme.colors.green50,
        fontSize: theme.SIZES.FONT ,
        fontWeight:600,
        marginStart: 8
    },
    ratingsText: {
        fontSize: theme.SIZES.FONT ,
        color: theme.colors.primary
    }

})