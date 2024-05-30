import React, { useState } from "react";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { StateScreen } from "../components/StateScreen";
import { Header } from "react-native-elements";
import { Screen } from "../components/Screen"
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import BackButton from "../components/BackButton";
import Paragraph from "../components/Paragraph";
import {perfilesService } from "../network/perfilesService";
import { Text } from "galio-framework";

export function CreatePerfilScreen2({ navigation}){

    //Screen para probar cosas

    const [shouldShow, setShouldShow] = useState(false);
    
    const [perfil, setPerfil] = useState({
        value:'',error:''
    })

    const [newPerfil, setNewPerfil] = useState([])
    
    const [perfil2, setPerfil2] = useState({
        value:'',error:''
    })
    const [namePermiso, setNamePermiso] = useState({value:'', error:''})
    const [namePermiso2, setNamePermiso2] = useState({value:''})
    const [namePermiso3, setNamePermiso3] = useState({value:''})
    const [namePermiso4, setNamePermiso4] = useState({value:''})
    const [namePermiso5, setNamePermiso5] = useState({value:''})
    const [namePermiso6, setNamePermiso6] = useState({value:''})
    const [namePermiso7, setNamePermiso7] = useState({value:''})
    const [namePermiso8, setNamePermiso8] = useState({value:''})
    const [namePermiso9, setNamePermiso9] = useState({value:''})
    const [namePermiso0, setNamePermiso0] = useState({value:''})
    
    const createPerfil = async () => {
        perfil2.value = perfil.value
        const newPerfil = await perfilesService.createPerfil(perfil.value)
        setNewPerfil(newPerfil)
        console.log(newPerfil)
        console.log(newPerfil.id)
        setShouldShow(!shouldShow)
    }
    const createPermiso = async () => {
        console.log(namePermiso.value)
        console.log(newPerfil.id)
    }
    const createPermiso2 = async () => {
        const newPermiso = await perfilesService.createPermiso(namePermiso.value, newPerfil.id)
       // setNamePermiso(newPermiso)
        console.log(newPermiso)
        //setShouldShow(!shouldShow)
    }

    return(
    <StateScreen>
        <Screen navigation={navigation}>
            <ScrollView>
                {/* <Header
                backgroundColor={theme.colors.primary}
                leftComponent={<BackButton goBack={navigation.goBack}/>}
                centerComponent={{text:'Crear Perfil', style:{fontSize:15, color:'#000'}}}
                /> */}
                <View>
                <TextInput
                    label="Nombre de Perfil"
                    returnKeyType="next"
                    value={perfil.value}
                    onChangeText={(text) => setPerfil({ value: text, error: '' })}
                />
                </View>
                <View>
                    <Button
                    mode="outlined"
                    style={{marginTop:24}}
                    onPress={createPerfil}
                    >Crear Perfil</Button>
                </View>
                {shouldShow ? (
                    <View>
                        <Text style={styles.subtitle}>Nuevo Perfil:</Text> 
                        <Text>Perfil: {perfil2.value}</Text>
                        <Text>Permiso: {namePermiso.value}</Text>

                    </View>
                ) : null } 
                <View>
                <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso.value}
                    onChangeText={(text) => setNamePermiso({ value: text, error: '' })}
                />
                </View>
                <View>
                <Button 
                    mode="outilined"
                    style={{marginTop:24}}
                    onPress={createPermiso2}
                    >Agregar Permiso</Button>
                </View> 
                {/* <Button 
                    mode="outilined"
                    style={{marginTop:24}}
                    onPress={createPermiso}
                    >Guardar Permiso</Button>*/}
                
                    {/* {shouldShow ? (
                    <>
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso2.value}
                    onChangeText={(text) => setNamePermiso2({value: text})}                    // error={!!namePermiso.error}
                    // errorText={namePermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso3.value}
                    onChangeText={(text) => setNamePermiso3({value: text})}                    // error={!!namePermiso.error}
                    // errorText={namePermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso4.value}
                    onChangeText={(text) => setNamePermiso4({value: text})}                    // error={!!namePermiso.error}
                    // errorText={namePermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso5.value}
                    onChangeText={(text) => setNamePermiso5({value: text})}                    // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    returnKeyType="next"
                    value={namePermiso6.value}
                    onChangeText={(text) => setNamePermiso6({value: text})}                    // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    value={namePermiso7.value}
                    onChangeText={(text) => setNamePermiso7({value: text})}                    // error={!!namePermisoermiso.error}
                        // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    value={namePermiso8.value}
                    onChangeText={(text) => setNamePermiso8({value: text})}                    // error={!!namePermisoermiso.error}
                        // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    value={namePermiso9.value}
                    onChangeText={(text) => setNamePermiso9({value: text})}                    // error={!!namePermisoermiso.error}
                        // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    <TextInput
                    label="Nuevo Permiso"
                    value={namePermiso0.value}
                    onChangeText={(text) => setNamePermiso0({value: text})}                    // error={!!namePermisoermiso.error}
                        // error={!!namePermisoermiso.error}
                    // errorText={namePermisoermiso.error} 
                    />
                    </>
                        ) : null }  */}
                     {/* </View> */}
            </ScrollView>
        </Screen>
    </StateScreen>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },
})