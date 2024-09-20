import { Text } from "galio-framework";
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { StateScreen } from '../components/StateScreen';
import { userService } from '../network/UserService';
import { Block } from 'galio-framework'
import { theme } from "../core/theme";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";


export function GestionUsuariosScreen ({navigation}) {

    const [usuariosFetched, setUsuariosFetched] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [mostrar, setMostrar] = useState({value:''})

    const fetchUsuarios = async () => {
        const usuarios1 = await userService.getUsersUA()
        console.log("Got Users")
        console.log(usuarios1)
        setUsuarios(usuarios1)
        console.log(usuarios)
        // const usuarios2 = usuarios.filter(user => user.isAdmin == false)
        // console.log("Users not admin")
        // console.log(usuarios2)
        // setUsuarios(usuarios2)
        setUsuariosFetched(true)
        console.log(usuarios.length)
    }

    React.useEffect( () => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (!usuariosFetched) {
          fetchUsuarios()
        }
      });
    return unsubscribe
    }, [navigation]);

      const handlerOnPress = (usuario) => {
        console.log(usuario)
        navigation.navigate('GestionUserScreen', { userId: usuario.id })
      }
      const renderItem = ({item}) => {
        return(
          <Block row style={styles.usuariossContainer}
          onClick={()=>handlerOnPress(item)}>
            <Text style={styles.list}>{item.name} {item.last_name}</Text> 
            {item.isAdmin === false &&
            <Text style={styles.subtitle}>{item.enabled}</Text>
            }
            {item.isAdmin === true && 
            <Text style={styles.subtitle}>Administrador {item.enabled}</Text>
            }
            
          </Block>
        )
      }
    // const renderUsuarios = () =>{
    //     if( usuarios && usuarios.length >0 ){
    //         return(
    //             <View>
    //                 <Block style={styles.perfilesContainer}>
    //                     {usuarios.map((usuario) =>{
    //                         <Block
    //                         shadow
    //                         style={styles.container}
    //                         onClick={() =>
    //                           handlerOnPress(usuario)
    //                         }
    //                       >
    //                         <Block row style={{ alignItems: 'center' }}>
    //                           <Text style={styles.list}>{usuario.name}</Text>
    //                         </Block>
    //                       </Block>   
    //                     })}
    //                 </Block>
    //             </View>
    //         )
    //     }
    // }
    return(
        <StateScreen loading={!usuariosFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                <Text style={styles.title}>Gestion de Usuarios</Text>
                {/* {renderUsuarios()} */}
                
                <View>
                      <FlatList
                        data={usuarios}
                        renderItem={renderItem}
                        keyExtractor={(item)=> item.id}
                      />
                        {/* {usuarios.map((usuario) =>{
                                <Block
                                shadow
                                style={styles.container}
                                onClick={() =>
                                handlerOnPress(usuario)
                                }
                            >
                                <Block row style={{ alignItems: 'center' }}>
                                <Text style={styles.list}>{usuario.name}</Text>
                                </Block>
                            </Block>   
                        })} */}
                    </View>
                </ScrollView>
            </Screen>
            </StateScreen>
    )

}

const styles = StyleSheet.create({
    title: {
      fontSize: theme.SIZES.FONT + 1.25,
      fontWeight: 600,
      marginBottom: 24,
    },
    perfilesContainer: {
      flexDirection: 'column',
      width: '100%',
      marginTop: 24,
    },
    item: {
      padding: 8,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    usuariossContainer: {
      flexDirection: 'column',
      width: '100%',
      marginTop: 12,
    },
    list: {
      fontSize: theme.SIZES.FONT * 1.25,
      fontWeight: 600,
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingLeft: 8,
      paddingTop: 10,
      //paddingBottom: 10,
    },
    subtitle: {
      fontWeight: 600,
      fontSize: theme.SIZES.FONT,
      paddingTop: 3,
      paddingLeft: 8,
      color: theme.colors.grey600
   },
    link: {
       fontSize: theme.SIZES.FONT,
       color: theme.colors.primary,
       alignItems: 'center',
       marginRight: 10,
     },
    
  })