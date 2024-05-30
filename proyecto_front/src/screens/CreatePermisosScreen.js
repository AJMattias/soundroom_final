import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { theme } from '../core/theme';
import { Screen } from '../components/Screen';
import { StateScreen } from '../components/StateScreen';
import { Text } from 'galio-framework';
import { perfilesService } from '../network/perfilesService';
import { nameValidator } from '../helpers/nameValidator';



export function CreatePermisosScreen({navigation}){

    const [nuevoPermiso, setNuevoPermiso] = useState({value:'', error:''})
    const [errorMessage, setErrorMessage ] = useState({error: ''});

    const createPermiso = async () =>{
        const nameError = nameValidator(nuevoPermiso.value)
        setErrorMessage({...errorMessage, error:''})
        if (nameError ) {
            setNuevoPermiso({ ...nuevoPermiso, error: nameError })
            return
        }
        console.log(nuevoPermiso.value)
        const permisoNuevo = await perfilesService.createPermisoSolo(nuevoPermiso.value)
        console.log('permiso Guardado')
        console.log(permisoNuevo)
        navigation.replace("PermisosListScreen")
    }

    return(
        <StateScreen>
            <Screen navigation={navigation}>
                <ScrollView>
                    <View>
                    <Text style={styles.title}>Crear nuevo permiso</Text>
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={nuevoPermiso.value}
                    onChangeText={(text)=> setNuevoPermiso({value: text})}
                    error={!!nuevoPermiso.error}
                    errorText={nuevoPermiso.error}
                    />
                    <Button
                    mode="contained"
                    style={{marginTop:24}}
                    onPress={createPermiso}
                    >Crear Permiso</Button>
                    </View>
                </ScrollView>
            </Screen>
        </StateScreen>
        
    )


}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    title: {
        color: theme.colors.primary,
        fontSize: 21,
        fontWeight: '600',
        marginLeft: 16,
        width: '100%'
    },
    errorMessage: {
        fontWeight: 'bold',
        color: '#ff4444',
        width: '100%',
        textAlign: 'center'
      }
})