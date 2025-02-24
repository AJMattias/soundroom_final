/* eslint-disable prettier/prettier */
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
import { RoomCard } from "../components/RoomCard"
import { CarouselVertical } from "../components/CarouselVertical";


export default function CreateUserProfileScreen({ navigation }) {

    const [user, setUser] = useState({
        name: "",
        last_name: "",
        email: ""
    })
    const user2 = LocalPhoneStorage.get(STORAGE_USER)


    const [userFetched, setUserFetched] = useState(false)

    const [rooms, setRooms] = useState([])

    const [popular, setPopular] = useState([])
    const [populares, setPopulares] = useState([])

    const [ownerRooms, setOwnerRooms] = useState([])
   
    const  [mostrarReporte, setmostrarReporte] = useState(false)

    const fetchUser = async () => {
        try {
            const user = await userService.me()
            console.log("Got user")
            console.log(user)
            console.log(user.isAdmin)
            setUser({...user, image: 'https://i.pravatar.cc/100'})
            setUser(user)
            console.log('fetching rooms by user with id: ', user.id)
            const response = await roomService.getRoomsByUserIdBd(user.id)
            const ownerRoomsBd = response
            setOwnerRooms(ownerRoomsBd)
            console.log('ownerRooms fetched: ', ownerRooms)
       
            //fetch popular rooms
            const popularRooms = await roomService.getPopulars()
            console.log('popularRooms: ', popularRooms)
            const responsePopular = popularRooms
            // const updatedData = responsePopular.map((item) => ({
            //     ...item,
            //     nombreDueño: `${item.idOwner.name} ${item.idOwner.lastName}`  }));
            // const responsePopularT = updatedData
            setPopular(responsePopular)
            //console.log('updatedData: ', updatedData)
            
            //mostrar reportes:
            if( user2.idPerfil){
                if(user2.idPerfil.name =="Sala de Ensayo"  || user2.isAdmin === true){
                console.log('user2.idPerfil.name:', user2.idPerfil.name)
                console.log('user2.isAdmin: ', user2.isAdmin)
                setmostrarReporte(true)
                }
            }else if(user2.isAdmin){
                setmostrarReporte(true)
            }
            
            
        } catch (apiError) {
            console.error("Error fetching user")
            console.log(apiError)
        }
    }

    // const fetchOwnerRooms = async () => {
    //     try {
    //         console.log('fetching rooms by user with id: ', user.id)
    //         const ownerRoomsBd = await roomService.getMyRoomsBd(user.id)
    //         setOwnerRooms(ownerRoomsBd)
    //         console.log('ownerRooms fetched: ', ownerRooms)
    //         // try {
    //         //     setOwnerRooms(
    //         //         await roomService.getMyRoomsBd(user.id)
    //         //     )
    //         //     console.log(ownerRooms)
    //         // } catch (apiError) {}
    //     } catch (error) {
    //         console.error("Error fetching user")
    //         console.log(apiError)
    //     }
    // }

    const fetchRooms = async () => {
        const rooms = await roomService.recomended(10)
        console.log("ROOMS!")
        console.log(rooms)
        setRooms(rooms)
    }

    const fetchPopular = async() => {
        const popularRooms = await roomService.recomended(20)
        setPopular(popularRooms)
    }

    // if (!userFetched) {
    //     fetchUser().then()
    //     //fetchRooms().then()
    //     //fetchOwnerRooms().then()
    //     //fetchPopular().then()        
    //     setUserFetched(true)
    
    // }

    useEffect(() => {
        if (!userFetched) {
            fetchUser();
            setUserFetched(true);
        }
    }, [userFetched]);

    const logOut = () => {
        LocalPhoneStorage.reset()
        navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
    }

    //verificar nombre de variables con lo que devuelve del back
    const renderOwnerRooms = () => {
        if(ownerRooms && ownerRooms.length > 0) {
            return (
                // <Block style = {styles.ownerRoomsContainer}>
                //     <Text style = {styles.subtitle} >Tus salas</Text>
                //     {ownerRooms.map((room) => (
                //         <RoomCard room = {room} navigation = {navigation} />
                //     ))}
                // </Block>
                <CarouselVertical
                    navigation  = {navigation}
                    title = "Tus Salas"
                    style = {[{marginTop: 26}]}
                    ownerRooms = {ownerRooms}
                />
            )
        }
    }

    //renderownerrooms vertical carrusel

    const openCreateRoom = () => {
        navigation.push("CreateRoom", {
           //roomId: roomId
        })
    }

    const openEditUser = () => {
        navigation.push("EditUserScreen")
    }

    //TODO hacer una peticion a endpoint updatePErfil con enable:"desahbilitado"
    const deleteUser = async () =>{
        const disabledUser = await userService.deshabilitarUser(
            user.id, user.email, user.name, user.last_name, 'baja'
        )
        if(disabledUser){
           logOut()
        }
    }

    return (
        <StateScreen loading={!userFetched} >
            <Screen navigation={navigation} rootScreen>
               <ScrollView>
                <UserAvatar user={user}></UserAvatar>
                <Block 
                    style = {styles.editUserRow}
                    onClick = {openEditUser}
                    >
                    <Icon size = {24} name = 'edit' family = 'Feather'color = {theme.colors.green50} />
                    <Text style = {styles.editText} >Editar Usuario</Text>
                </Block>
                 <Block 
                    style = {styles.deleteUserRow}
                    onClick = {deleteUser}
                    >
                    <Icon size = {24} name = 'deleteuser' family = 'AntDesign'color = {theme.colors.error} />
                    <Text style = {styles.editText} >Eliminar Usuario</Text>
                </Block>

                { renderOwnerRooms() }

                   <Carousel 
                        navigation  = {navigation}
                        title = "Salas recomendadas"
                        style = {[{marginTop: 26}]}
                       // rooms = {rooms}
                       rooms = {popular}
                    />

                   <Button mode ="outlined" onPress = {openCreateRoom} >Publica tu sala</Button>
                   
                   {
                    //user.idPerfil && (user2.idPerfil.name =="Sala de Ensayo"  || user2.isAdmin === true) && (
                    ( mostrarReporte &&
                   <Button mode ="contained" onPress = {()=>navigation.navigate("AdminSalaReportes")} >Reportes de tus Salas</Button>
                   )
                }
            
                   <FeaturedArtists navigation = {navigation} />


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
    editUserRow: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 8,
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600
    },
    deleteUserRow:{
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600
    },
    text: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    button: {
        backgroundColor: theme.colors.surface
    },
    title: {
        color: theme.colors.primary,
        fontSize: 21,
        fontWeight: '600',
        marginLeft: 16,
        width: '100%'
    },

    subtitle: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600
    },
    
    rooms: {
       marginTop: 16,
       width: '100%'

    },

    artists: {
        marginTop: 24    
    },
    editText: {
        color: theme.colors.green50,
        fontSize: theme.SIZES.FONT ,
        fontWeight:600,
        marginStart: 8
    },

    shadow: {
        marginTop: 48,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 20,
        zIndex:999,  

        // background color must be set
        backgroundColor : "#0000" // invisible color
      },

      logOutText: {
          color: theme.colors.error,
          textTransform: 'uppercase',
          fontSize: theme.SIZES.fontSize,
          fontWeight: 600,
          marginStart: 16
      },
      
      logOutContainer: {
          marginTop: 16
      },

      ownerRoomsContainer: {
          flexDirection: 'column',
          width: '100%',
          marginTop: 12
      }

})