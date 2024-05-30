import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Avatar, Header } from 'react-native-elements'
import { Navigation } from '../components'
import BackButton from '../components/BackButton'
import { Block, Text, Card, Icon } from 'galio-framework'
import Button from '../components/Button'
import { Screen } from '../components/Screen'
import { StateScreen } from '../components/StateScreen'
import { theme } from '../core/theme'

export function AbmPerfilesScreen({ navigation }) {
  return (
    <StateScreen>
      <Screen navigation={navigation}>
        {/* <Header
                backgroundColor={theme.colors.primary}
                leftComponent={<BackButton goBack={navigation.goBack
                }/>}
                centerComponent={{text:'Gestion de Perfiles', style:{fontSize:21, color:'#000'}}}
                /> */}
        <ScrollView>
          <View>
            <Text style={styles.subtitle}>Gestion de Perfiles</Text>
            <Text p style={styles.text}>
              En esta Seccion encontraras las opciones para crear, modificar y
              dar de baja perfiles.
            </Text>

            <View>
              <Text p style={styles.text}>
                Para crear nuevo perfil, haz click en "Crear Perfil"
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('CreatePerfilPermisoScreen')}>
                Crear Perfiles
              </Button>
            </View>
            <View>
              <Text p style={styles.text}>
                Para ver los perfiles creados. Haz click en "Ver Perfiles"
              </Text>
              <Button mode="contained" onPress={() => navigation.navigate('ProfileListScreen')}>
                Ver Perfiles
              </Button>
            </View>
          </View>
        </ScrollView>
      </Screen>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'fixed',
  },
  logOutText: {
    color: theme.colors.error,
    textTransform: 'uppercase',
    fontSize: theme.SIZES.fontSize,
    fontWeight: 600,
    marginStart: 16,
  },
  logOutContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: theme.SIZES.FONT * 1.5,
    fontWeight: 600,
    marginBottom: 24,
  },
  subtitle: {
    fontWeight: 600,
    fontSize: theme.SIZES.FONT * 1.25,
  },
  text: {
    fontSize: theme.SIZES.FONT,
    color: theme.colors.grey600,
  },
})
