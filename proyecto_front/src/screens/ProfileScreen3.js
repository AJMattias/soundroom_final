import { Text, Checkbox  } from "galio-framework";
import React, { useState} from "react";
import { ScrollView, View, StyleSheet, FlatList } from "react-native";
import { set } from "react-native-reanimated";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { perfilesService } from "../network/perfilesService";
import { Icon } from 'react-native-elements';

export function ProfileScreen({ route, navigation}){

    const {perfilId} = route.params
    const [perfilFetched, setPerfilFetched] = useState(false);
    const [perfil, setPerfil] = useState({});
    let perfil3
    const [permisos, setPermisos] = useState([]);
    const [permisosAdded, setPermisosAdded] = useState([]);
    
    
    const fetchPerfil = async() => {
        console.log('perfil id:' + perfilId)
            const perfilGeted = await perfilesService.getPerfil(perfilId)
            console.log('Got perfil')
            console.log(perfilGeted)
            perfilGeted.permisos.map((permiso)=> 
            permisos.push({id:permiso.id, permiso: permiso.permiso, checked: true}))

            // setPermisosAsignados(perfil2.permisos)


     
            // perfil3.permisos.map((permiso) => permisos2.push(permiso))
          
    }

    const addPermisosAdded = async () => {
        perfil3.permisos.map((permiso) => permisosAdded.push({_id: permiso._id, name: permiso.name, checked:true}))
        console.log(permisosAdded)
    }
    const fetchPermisos = async() => {
        const permisos = await perfilesService.getPermisos()
        console.log(permisos)
        setPermisos(permisos)
    }
    
    
    if(!perfilFetched){
        fetchPerfil().then()
        //addPermisosAdded().then()
        fetchPermisos().then()
        setPerfilFetched(true)
    }

    return (
        <StateScreen loading={!perfilFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <View>
                        <Text style={styles.title}>Perfil: {perfil.name}</Text>
                        {permisos.map(item=>{
                            return <Checkbox
                            style = {styles.check}
                                color="warning"
                                label={item.name}
                                key={item.id} 
                               // onChange={()=>addPermisoChecked(item.id)}
                            />
                        })} 
                        {permisosAdded.map(item=>{
                            return <Checkbox
                            style = {styles.check}
                                color="warning"
                                label={item.name}
                                key={item.id} 
                                // onChange={()=>addPermisoChecked(item.id)}
                            />
                        })}     
                            
                    {/* </View>
                    <View> */}
                    </View>
                </ScrollView>
            </Screen>
        </StateScreen>
    )

 }

const styles = StyleSheet.create({
    title: {
        color: theme.colors.primary,
        fontSize: 21,
        fontWeight: '600',
        marginLeft: 16,
        width: '100%',
        textAlign: 'center'
    },
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
        fontSize: theme.SIZES.FONT,
        fontWeight: 600
    },
})
