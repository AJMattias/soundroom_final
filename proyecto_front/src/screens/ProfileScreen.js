import { Text, Checkbox, CheckBox, Icon, Block } from "galio-framework";
import React, { useState} from "react";
import { ScrollView, View, StyleSheet, FlatList } from "react-native";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { perfilesService } from "../network/perfilesService";
import Button from '../components/Button';
// import Checkbox from 'expo-checkbox';



export function ProfileScreen({ route, navigation}){

    const {perfilId} = route.params
    const [perfilFetched, setPerfilFetched] = useState(false);
    const [perfil, setPerfil] = useState({})
    const [permisos, setPermisos] = useState([]);
    const [permisosAdded, setPermisosAdded] = useState([]);
    const [permisosAll, setPermisosAll] = useState([]);
    const [permisosPerfil, setPermisosPerfil] = useState([]);

    const fetchPerfil = async () =>{
        console.log("getting profile")
        const perfilInterno = await perfilesService.getPerfil(perfilId)
        console.log(perfilInterno)
        setPerfil(perfilInterno)
        const permisosinterno = perfilInterno.permisos
        console.log(permisosinterno)
        permisosinterno.map((permiso) =>{
            permisosPerfil.push({id: permiso._id, name: permiso.name, isChecked: true})
        })
        console.log(permisosPerfil)
    }

    const getAllPermisos = async () => {
        console.log("get All Permisos")
        const response = await perfilesService.getPermisos()
        console.log(response)
        //setPermisosAll(response)
        response.map((permiso) =>{
            permisosAll.push({id: permiso.id, name: permiso.name, isChecked: false})
        })
        console.log(permisosAll)
        var permisosAllFiltered
        for(var i = 0; i < permisosPerfil.length; i++){
            var id = permisosPerfil[i].id
            for(var j = 0; j<permisosAll.length; j++){
                var idj = permisosAll[j].id
               const son_iguales = checked(permisosPerfil[i].id,permisosAll[j].id)
                if(son_iguales === true ){
                    permisosAll[j].isChecked = son_iguales
                }
            }
            // permisosAll.forEach(permisoAll =>
            //     {
            //         if(permisoAll.id == id){
            //             permisoAll.checked = !bool
            //         }  
            //     })
        }
        console.log(permisosAll)
    }    
        
        const checked = (permisoPerfil, permisoAll) => {
        if(permisoPerfil == permisoAll){    
            return true
        }
        return false
        }
            // var id = permisosPerfil[i].id
            // permisosAllFiltered = permisosAll.filter(permiso=>
            //     permiso.id != id
            // );
            // console.log(permisosAllFiltered)
    const handleChange = (index) => {
        const valorBool= permisosAll[index].checked
        console.log(permisosAll[index].checked)
        permisosAll[index].checked = !valorBool
        console.log(permisosAll[index].checked)
    }
    
    // const mostrarPermisos = () => {
    //     console.log(permisosAll)
    // }
    const handleChangePermisos = () =>{
        const size = permisosAll.length
        const trueBool = true
        for( var i = 0; i < size; i++){
            if(permisosAll[i].checked === trueBool){
               const responseInt =  addPermisosPerfil(permisosAll[i].id)
            }else{
                const responseInt =  deletePermisos(permisosAll[i].id)
            }
        }
    }

    // const changePermisos = async () =>{
    //     permisosAll.map(permiso =>{
    //         var trueBool = false
    //         if(permiso.checked === trueBool){
    //             const response = await perfilesService.addPermisosToProfile(perfilId, permiso.id)
    //             console.log(permiso.name +"added")
    //         }else{
    //             const response = await perfilesService.deletePermisosFromProfile(perfilId, permiso.id)
    //             console.log(permiso.name +"deleted")
    //         } 
    //     })
    // }

    const addPermisosPerfil = async (id) => {
        const response = await perfilesService.addPermisosToProfile(perfilId, id)
        console.log("added")
        return response
    }

    const deletePermisos = async (id) =>{
        const response = await perfilesService.deletePermisosFromProfile(perfilId, id)
        console.log("deleted")
        return response

    }
 


    if(!perfilFetched){
        fetchPerfil().then()
        getAllPermisos().then()
        setPerfilFetched(true)
        //filterPermisos()
    }

 

    // const renderPermisosCheck = ({item, index}) => {
    //     <View>
    //         <Block style={styles.checkContainer}>
    //             <Block style={styles.check} 
    //             onPress={handleChange(index)}>
    //             { item.isChecked === false && (
    //             <Icon name="radio-button-unchecked"></Icon>)}
    //             { item.isChecked === false && (
    //             <Icon name="checkcircle"></Icon>)}
    //             <Text>{item.name}</Text>
    //             </Block>
    //         </Block>
    //     </View>
    // }

    const renderPermisosCheck = () =>{
        return (
          <View>
           
              {permisosAll.map((permiso) => {
                  <Text>{permiso.name}</Text>
              })}

          </View>
        )
    }

    return (
        <StateScreen loading={!perfilFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    
                        <Text style={styles.title}>Perfil: {perfil.name}</Text>
                        {permisosAll.map((permiso) => {
                            <Text>{permiso.name}</Text>
                        })}
                        {/* <FlatList 
                        data={permisosAll}
                        renderItem={renderPermisosCheck}
                        keyExtractor={(item) => item.id}
                        /> */}
                        {/* {renderPermisosCheck} */}
  

                        {/* Este es elultimo probado */}
                           
                            {/* <FlatList
                                data={permisosAll}
                                renderItem={({item, index})=>
                                    <View style={styles.section}>
                                       <CheckBox
                                            style = {styles.check}
                                            color="warning"
                                            label={item.name}
                                            initialValue={item.isChecked}
                                            key={item.id} 
                                            onChange={() => handleChange(index)}
                                        />
                                    </View>    
                                }
                            />   */}

                        <Button
                            mode="contained"
                            onPress={handleChangePermisos}
                            >Modificar Permisos
                        </Button>

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
    checkContainer:{
        flexDirection:'column'
    },
     check: {
        width: '100%',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 8,
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: theme.colors.white,
        flexDirection:'row'
    },
    checkbox:{
        margin: 8,
    },
    subtitle: {
        fontSize: theme.SIZES.FONT,
        fontWeight: 600
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
      },
})
