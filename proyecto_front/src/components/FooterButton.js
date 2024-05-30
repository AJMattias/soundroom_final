import React from 'react'
import { Block } from 'galio-framework'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { theme } from '../core/theme'
import Button from './Button'

export const FooterButton = ({ buttonText, outlined, onClick }) => {
    return (
        <KeyboardAvoidingView>
            <Block shadow style={styles.container}>
                <Button style={styles.button}
                    onPress ={onClick}
                    mode={outlined ? 'outlined' : 'contained'}>
                    {buttonText}
                </Button>
            </Block>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingStart: 16,
        paddingEnd: 16,
        backgroundColor: theme.colors.background,
        position: 'fixed',
        paddingBottom: 8,
        paddingTop: 8,
        bottom: 0
    },

    button: {
       
    }
})
