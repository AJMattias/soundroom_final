import { Block, Icon, Text } from "galio-framework"
import { theme } from "../core/theme"
import React from "react"
import { StyleSheet, Image } from "react-native"
import { UserImage } from "./UserImage"
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"

export const UserAvatar = ({ user, ...props }) => {
    const user2 = LocalPhoneStorage.get(STORAGE_USER)

    return (
        <Block row center >
            <Block style={styles.column} middle >
                <UserImage user = {user} size = {100} />
                <Text style={styles.title}>{user.name + " " + user.last_name}</Text>
                <Text style={styles.subtitle}>{user.email}</Text>
                 {  
                 user?.idPerfil && user2?.idPerfil?.name == "Artista" &&(
                 <Block row style={styles.row}>
                 <Icon name='note' family='Entypo' size={24} color={theme.colors.grey600} />
                    <Text style={[styles.textBig, { marginStart: 8 }]}>{user.tipoArtista}</Text>
                </Block>)
                }
            </Block>
        </Block>
    )
}

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },

    title: {
        fontWeight: '600',
        fontSize: theme.SIZES.FONT  * 1.5,
        lineHeight: theme.SIZES.BASE * 1.25,
        letterSpacing: 0.3,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600
    },
    textBig: {
        color: theme.colors.grey600,
        fontSize: theme.SIZES.FONT * 1.25
    },
    row: {
        alignItems: 'center'
    },
})