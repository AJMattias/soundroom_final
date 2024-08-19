import React, {useState} from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Button from "../components/Button";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import TextInput from "../components/TextInput";
import { perfilesService } from "../network/perfilesService";
import { Text } from "galio-framework";
import { theme } from "../core/theme";
import { Checkbox } from "galio-framework";
import { nameValidator } from "../helpers/nameValidator";

const selectedCheckBoxes = [];

export function CreatePerfilPermisoScreen({navigation}){

    const [perfil, setPerfil] = useState({
        value:'',error:''
    });
    const [errorMessage, setErrorMessage ] = useState({error: ''});

    const [newPerfil, setNewPerfil] = useState();
    const [shouldShow, setShouldShow] = useState(false);
    
    const [permisos, setPermisos] = useState([]);
    const [permisosChecked, setPermisosChecked] = useState([]);
    

    const fetchPermisos = async() => {
        const permisos = await perfilesService.getPermisos()
        console.log(permisos)
        setPermisos(permisos)
    }

    const createPerfil = async () => {
        const nameError = nameValidator(perfil.value)
        setErrorMessage({...errorMessage, error:''})
        if (nameError ) {
            setPerfil({ ...perfil, error: nameError })
            return
          }
        const newPerfil = await perfilesService.createPerfil(perfil.value)
        setNewPerfil(newPerfil)
        console.log(newPerfil)
        console.log(newPerfil.id)
        fetchPermisos();
        setShouldShow(!shouldShow)
    }

    // if(!permisos){
    //     fetchPermisos();
    // }

    const addPermisoChecked = async(id) =>{
        console.log(id);
        selectedCheckBoxes.push(id);
        console.log(selectedCheckBoxes);
    }

    const addPermisos = async()=> {
        console.log(selectedCheckBoxes);
        const size = selectedCheckBoxes.length
        console.log(permisosChecked)
        console.log(`Permisos Array length: ${size}`)
        const permisos= []
        for( var i = 0; i < size; i++){
            permisos.push(selectedCheckBoxes[i])
            //const response = await perfilesService.addPermisosToProfile(newPerfil.id, selectedCheckBoxes[i])
            //console.log(selectedCheckBoxes[i])
        }
        console.log('permisos a añadir: ', permisos)
        const response = await perfilesService.addPermisosToProfile(newPerfil.id, permisos)
        if(response){
            console.log('respuesta a la llamada al back para actualizar permisos: ', response)
            navigation.navigate("ProfileListScreen")
          }
    }   
    const showPermiso = (item) => {
        console.log(item)
    }
    const showPermisos = () => {
        console.log(selectedCheckBoxes)
    }


return (
    <StateScreen>
        <Screen navigation={navigation}>
            <ScrollView>
            <View>
                <Text style={styles.subtitle}>Ingrese nombre de nuevo Perfil</Text>
                <TextInput
                    label="Nombre de Perfil"
                    returnKeyType="next"
                    value={perfil.value}
                    onChangeText={(text) => setPerfil({ value: text, error: '' })}
                    error={!!perfil.error}
                    errorText={perfil.error}
                />
                <Button
                    mode="contained"
                    style={{marginTop:24}}
                    onPress={createPerfil}
                    >Crear Perfil</Button>
                </View>  
                {shouldShow ? (
                <View>
                    <Text>Selecciona Permisos</Text>
                    <View>
                        {permisos.map(item=>{
                            return <Checkbox
                            style = {styles.check}
                                color="warning"
                                label={item.name}
                                key={item.id} 
                                onChange={()=>addPermisoChecked(item.id)}
                            />
                        })}
                    </View>
                    <View>
                        <Button
                        mode="contained"
                        style={{marginTop:24}}
                        onPress={addPermisos}>
                        Añadir Permisos
                        </Button>
                    </View>

                </View>
                ) : null } 
            </ScrollView>
        </Screen>
    </StateScreen>
)
}

const styles = StyleSheet.create({
    check: {
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: theme.colors.white
    },
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },
    errorMessage: {
        fontWeight: 'bold',
        color: '#ff4444',
        width: '100%',
        textAlign: 'center'
      }
})