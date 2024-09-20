import React, { useState } from 'react'
import { Card, Block, Text } from 'galio-framework'
import { StyleSheet } from 'react-native'
import { artistService } from '../network/ArtistService'
import { theme } from "../core/theme"
import {LocalPhoneStorage, STORAGE_ARTIST_PROFILE} from "../storage/LocalStorage"
import { InfoBanner } from './InfoBanner'





export const FeaturedArtists = ({ navigation }) => {

    const [artsits, setArtists] = useState([])
    const [fetched, setFetched] = useState(false)
    const userAvatar=require("../assets/user.png")

    const fetchArtists = async () => {
        try {
            setArtists(
                await artistService.getPopularArtists()
            )
            setFetched(true)
        } catch (apiError) {
            setFetched(true)
        }
    }

    const addProfileInfoBanner = () => {
        if(!LocalPhoneStorage.get(STORAGE_ARTIST_PROFILE)) {
            return (
                <InfoBanner style = {styles.addProfileBanner}
                            text = "Crea tu perfil de Artista para aparecer aquí"
                            icon = "plus" />

            )
        }
    }


    if (!fetched) {
        fetchArtists().then()
    }

    return (
        <Block style={styles.wrapper}>
            <Text style={styles.title}>Artistas del mes</Text>
            {/* {addProfileInfoBanner()}             */}
            {artsits.map((artist) => (
                <Card borderless shadow
                    //avatar={artist.user.image}
                    avatar={userAvatar}
                    title={artist.name + " " + artist.lastName}
                    caption={artist.tipoArtista}
                    onClick = {() => navigation.navigate('ArtistProfileScreen', {userId: artist._id})}
                />
            )
            )}
        </Block>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8
    },

    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
        marginBottom: 24

    },

    profileCard: {
        marginTop: 4
    },

    addProfileBanner: {
        marginBottom: 16
    },

})