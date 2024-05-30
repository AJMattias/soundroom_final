import React, { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native'
  import { StateScreen } from '../components/StateScreen'
  import { Block, Card, Text } from 'galio-framework'
  import { perfilesService } from '../network/perfilesService'
  import { FlatList } from 'react-native-gesture-handler'
  import { theme } from '../core/theme'
  import { Screen } from '../components/Screen'
import { Divider } from "react-native-elements";


export function PermisosListScreen ({navigation}){

    const [permisos, setPermisos] = useState([])
    const [permisosFetched, setPermisosFetched] = useState(false)
    const [editPermiso, setEditPermiso] = useState({value:''})

    const fetchPermisos = async() => {
        const permisos = await perfilesService.getPermisos()
        console.log(permisos)
        setPermisos(permisos)
    }

    const eliminarPermiso = async (idPermiso) => {
        console.log(idPermiso)
        const deleted =  await perfilesService.deletePermiso(idPermiso)
        console.log("Permiso deleted")
        console.log(deleted)
        //navigation.navigate("PermisosListScreen")
        setPermisosFetched(false)
    }

    // useEffect(() => {
    //     if (!permisosFetched) {
    //       fetchPermisos()
    //       setPermisosFetched(true)
    //     }
    //   })

    React.useEffect( () => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (!permisosFetched) {
          fetchPermisos()
          setPermisosFetched(true)
        }
      });
      return unsubscribe
    }, [navigation]);

    if (!permisosFetched) {
      fetchPermisos()
      setPermisosFetched(true)
    }

    const handlerOnPress = (permiso) => {
    console.log(perfil)
    navigation.navigate('PermisoScreen', { permisoId: permiso.id })
    }

    const renderPermisos = () => {
        if (permisos && permisos.length > 0) {
          return (
            <View>
              <Block style={styles.permisosContainer}>
                {permisos.map((permiso) => (
                  <Block>
                    <Block row style={styles.permisosList}>
                        <Text style={styles.list}>{permiso.name}</Text>
                        <Block row style={styles.permisosOptions}>
                          <TouchableOpacity 
                          onPress={()=> navigation.navigate('EditarPermisoScreen', {permisoId: permiso.id} )}
                          >
                            <Text style={styles.link}>Editar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => eliminarPermiso(permiso.id)}>
                            <Text style={styles.link}>Eliminar</Text>
                          </TouchableOpacity>
                        </Block>
                        <Divider orientation="horizontal" />
                    </Block>
                  </Block>
                ))}
              </Block>
            </View>
          )
        }
      }

    return (
        <StateScreen loading={!permisosFetched}>
          <Screen navigation={navigation}>
            <ScrollView>
              <Text style={styles.title}>Lista de Permisos</Text> 
              <TouchableOpacity 
                  onPress={()=> navigation.replace('CreatePermisosScreen')}
                  >
                    <Text style={styles.link}>Crear nuevo Permiso</Text>
                </TouchableOpacity>
              {renderPermisos()}
            </ScrollView>
          </Screen>
        </StateScreen>
      )

}

const styles = StyleSheet.create({
    title: {
      color: theme.colors.primary,
      fontSize: theme.SIZES.FONT + 1.50,
      fontWeight: 700,
      marginBottom: 24,
    },
    permisosList:{
        alignItems: 'left',
        flexDirection:'column',
        justifyContent: 'flex-start',
    },
    permisosOptions:{
      alignItems: 'left',
      flexDirection:'row',
      justifyContent: 'flex-start',
      paddingLeft: 12,
  },
    permisosContainer: {
      flexDirection: 'column',
      width: '100%',
      marginTop: 12,
    },
    item: {
      padding: 8,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    list: {
      fontSize: theme.SIZES.FONT + 1.5,
      fontWeight: 600,
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingLeft: 8,
      paddingTop: 10,
      paddingBottom: 10,
    },
    link: {
       // fontWeight: 'bold',
        fontSize: theme.SIZES.FONT,
        color: theme.colors.primary,
        alignItems: 'center',
        marginRight: 10,
      },
  })