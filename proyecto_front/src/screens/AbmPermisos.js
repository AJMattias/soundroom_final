import { Text } from "galio-framework";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";

export function AbmPermisos({ navigation }){

    return(
        <StateScreen>
            <Screen navigation={navigation}>
                <ScrollView>
                <View>
                    <Text style={styles.subtitle}>Gestion de Permisos</Text>
                        <Text p style={styles.text}>
                        En esta Seccion encontraras las opciones para crear, modificar y
                        dar de baja permisos.
                        </Text>
                        <View>
                        <Text p style={styles.text}>
                            Para crear nuevo perfil, haz click en "Crear Permiso"
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('CreatePermisosScreen')}>
                            Crear Permiso
                        </Button>
                        </View>
                        <View>
                        <Text p style={styles.text}>
                            Para ver los permisos existentes. Haz click en "Ver Permisos"
                        </Text>
                        <Button mode="contained" onPress={() => navigation.navigate('PermisosListScreen')}>
                            Ver Permisos
                        </Button>
                        </View>
                    </View>
                </ScrollView>
            </Screen>
        </StateScreen>
    )

}
const styles = StyleSheet.create({
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