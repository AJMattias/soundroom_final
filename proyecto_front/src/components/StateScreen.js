import React from 'react'
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { theme } from "../core/theme"

export const StateScreen = ({loading, children}) => {
    const renderChildren = () => {
        if(!loading) {
            return (children)
        }
    }

    console.log("Loading state: "+loading)
    return (
        <View style = {styles.root}  >
            <View style={[styles.container, {display: loading? 'flex': 'none'}]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
            <View style = {styles.content} visible = {!loading}>
                {renderChildren()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 10000,
        backgroundColor: "#FFFFFF",
        position: 'absolute',
        top: '0',
        left: '0'
    },
    content: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'

    },
    root: {
        width: '100%',
        height: '100%'
    }

})
