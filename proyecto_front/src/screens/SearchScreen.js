/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { ReservationCard } from "../components/ReservationCard";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { reservationService } from "../network/ReservationService";
import { Text, Icon, Block } from 'galio-framework'
import TextInput from "../components/TextInput";
import { RoomCard } from "../components/RoomCard";
import { roomService } from "../network/RoomService";


export const SearchScreen = ({ navigation }) => {

    const [rooms, setRooms] = useState([])
    const [query, setQuery] = useState("")
 
    const renderSearchResults = () => {
        if(rooms.length > 0  && query.trim() != "") {
              return  (
                  rooms.map((room) => (
                        <RoomCard room = {room} navigation = {navigation} />
                  ))
              )

        } else  if (query.trim() != "") {
            return (
                <Text style = {styles.notFoundText}>No hay resultados , prueba otra cosa</Text>
            )
        } else {
            return (
                <Text style = {styles.notFoundText}>Ingresa un t&eacute;rmino de b&uacute;squeda</Text>
            )
        }
    }

    const search = async (query) => {
        console.log("On search")
        console.log(query)
        setQuery(query)
        setRooms(
            await roomService.findByNameBd(query)
        )
    }

    return (
        <StateScreen>
            <Screen rootScreen={true} navigation={navigation}>
                <ScrollView>
                    <Block style={styles.searchRow}>
                        <Icon name = "search1" family = "AntDesign" color = {theme.colors.grey600} size = {24}/>
                        <Text style={styles.text}>Busc&aacute; una sala</Text>
                    </Block>
                    <TextInput label = "Ingresa tu búsqueda"  onChangeText = {search} />
                    {renderSearchResults()}
                </ScrollView>
            </Screen>
        </StateScreen>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600
    },
    searchRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    notFoundText : {
        color: theme.colors.grey600,
        fontSize: theme.SIZES.FONT * 1.5
    }

})