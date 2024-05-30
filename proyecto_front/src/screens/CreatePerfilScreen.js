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


export function CreatePerfilScreen({ navigation}){

    const [shouldShow, setShouldShow] = useState(false);
    
    const [perfil, setPerfil] = useState({
        value:'',error:''
    })
    const [namePermiso, setNamePermiso] = useState([
    ])

    const [userFetched, setUserFetched] = useState(false)

    const  [InputsNumber, setInputsNumber] = useState({
        value:5
    })
    const [Empty, setEmpty] = useState({
        holder:'' })
    const AddItemsToArray=()=>{
        //Adding Items To Array.
        SampleArray.push( this.state.Holder.toString() );
        // Showing the complete Array on Screen Using Alert.
        console.log(perfil)
        console.log(namePermiso)
        Alert.alert(SampleArray.toString());

    }

    const mostrarArray = () =>{
        console.log(perfil)
        console.log(namePermiso)
    }

    const pushPermiso = (text) => {
        namePermiso.push(text)
    }


    // this.state = {   
    //     Holder: ''
    // }
    

    //   AddItemsToArray=()=>{
    //     //Adding Items To Array.
    //     SampleArray.push( this.state.Holder.toString() );
    //     // Showing the complete Array on Screen Using Alert.
    //     Alert.alert(SampleArray.toString());
    // }
    
//     const renderInputs = () => {
//         const  inputs = []
//         for(let i=0; i < InputsNumber ; i++) {
//             inputs.push(
//                 <TextInput
//                 label="Nuevo Permiso"
//                 value={namePermiso.value}
//                 onChangeText={(text) => setNamePermiso({ value: text, error: '' })}
//                 error={!!namePermiso.error}
//                 errorText={namePermiso.error} />
//             )
//    } 
//    }


    const fetchUser = async () => {
        try {
            const user = await userService.me()
            console.log("Got user")
            console.log(user)
            setUser({...user
            //    image: 'https://i.pravatar.cc/100'
            })
        } catch (apiError) {
            console.error("Error fetching user")
            console.log(apiError)
        }
    }
    

    if (!userFetched) {
        fetchUser().then()
        setUserFetched(true)
    }

    return(
        <StateScreen loading={!userFetched}>
            <Screen navigation={navigation} rootScreen>
                <ScrollView>
                    <Header
                    backgroundColor={theme.colors.primary}
                    leftComponent={<BackButton goBack={navigation.goBack}/>}
                    centerComponent={{text:'Crear Perfil', style:{fontSize:15, color:'#000'}}}
                    />
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
                        >Crear Perfil</Button>
                    </View>
                    <View>
                    <TextInput
                        label="Nuevo Permiso"
                        returnKeyType="next"
                        value={namePermiso}
                        onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                        // error={!!namePermiso.error}
                        // errorText={namePermiso.error} 
                        />
                        <Button 
                         mode= "outlined"
                         onPress={mostrarArray}
                        >Agregar Permiso</Button>
                        <Button 
                         mode= "outlined"
                        onPress={() => setShouldShow(!shouldShow)}
                        > Guardar Perfil y Permisos </Button>
                         {shouldShow ? (
                            <>
                             <TextInput
                            label="Nuevo Permiso"
                            returnKeyType="next"
                            value={namePermiso}
                            onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                            // error={!!namePermiso.error}
                            // errorText={namePermiso.error} 
                            />
                               <TextInput
                        label="Nuevo Permiso"
                        returnKeyType="next"
                        value={namePermisoermiso}
                        onChangeText={(namePermiso) => namePermisoermiso.push(namePermiso)}
                        // error={!!namePermiso.error}
                        // errorText={namePermiso.error} 
                        />
                        <TextInput
                        label="Nuevo Permiso"
                        returnKeyType="next"
                        value={namePermiso}
                        onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                        // error={!!namePermiso.error}
                        // errorText={namePermiso.error} 
                        />
                        <TextInput
                        label="Nuevo Permiso"
                        returnKeyType="next"
                        value={namePermiso}
                        onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                        // error={!!namePermisoermiso.error}
                        // errorText={namePermisoermiso.error} 
                        />
                        <TextInput
                        label="Nuevo Permiso"
                        returnKeyType="next"
                        value={namePermiso}
                        onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                        // error={!!namePermisoermiso.error}
                        // errorText={namePermisoermiso.error} 
                        />
                                <TextInput
                                label="Nuevo Permiso"
                                value={namePermiso.value}
                                onChangeText={(namePermiso) => namePermiso.push(namePermiso)}
                                // error={!!namePermisoermiso.error}
                                // errorText={namePermisoermiso.error} 
                                />
                                </>
                        ) : null } 
                        
                    </View>
                </ScrollView>
            </Screen>
        </StateScreen>
    )
}