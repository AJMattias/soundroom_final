import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { theme } from '../core/theme';
import { Screen } from '../components/Screen';
import { StateScreen } from '../components/StateScreen';
import { Text } from 'galio-framework';
import { perfilesService } from '../network/perfilesService';



export function EditarPermisoScreen({route, navigation}){

    const {permisoId} = route.params
    const [permisoFetched, setPermisoFetched] = useState(false)
    const [permisoToEdit, setPermisoToEdit] = useState()
    const [nuevoPermiso, setNuevoPermiso] = useState({value:''})
    const [permisoName, setPermisoName] = useState()

    const editPermiso = async () =>{
        console.log(nuevoPermiso.value)
        const permisoEdited = await perfilesService.updatePermiso(permisoId, nuevoPermiso.value)
        console.log('permiso Guardado')
        console.log(permisoEdited)
        navigation.replace("PermisosListScreen")

    }

    const fetchPermiso = async () =>{
        console.log(permisoId)
        console.log("Getting Permiso ")
        const permisoToEdit = await perfilesService.getPermiso(permisoId)
        console.log('permisoToEdit getted ')
        console.log(permisoToEdit)
        setPermisoToEdit(permisoToEdit)
        setPermisoName(permisoToEdit.name)
    }



    useEffect(() => {
        if (!permisoFetched) {
          fetchPermiso()
          setPermisoFetched(true)
        }
      })

    return(
        <StateScreen loading={!permisoFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <View>
                    <Text style={styles.title}>Editar permiso: {permisoName}</Text>
                    <TextInput
                    label="Nombre del nuevo Permiso"
                    returnKeyType="next"
                    value={nuevoPermiso.value}
                    onChangeText={(text)=> setNuevoPermiso({value: text})}/>
                    <Button
                    mode="contained"
                    style={{marginTop:24}}
                    onPress={editPermiso}
                    >Modificar Permiso</Button>
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
})