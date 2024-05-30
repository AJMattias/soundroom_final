import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Screen } from "../components/Screen"
import Button from '../components/Button';
import { StateScreen } from '../components/StateScreen';
import { theme } from '../core/theme';
import { comisionesService } from '../network/ComisionService';
import { Text, Block } from 'galio-framework';
import { Divider } from "react-native-elements";




export function DeleteComisionesScreen({ navigation }){
    const [comisionesFetched, setComisionesFetched] = useState(false);
    const [comisiones, setComisiones] = useState([]);
    const [comisionToDelete, setComisionToDelete] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const getComisiones = async () =>{
        const comisionesInterna = await comisionesService.getComisiones()
        console.log(comisionesInterna)
        setComisiones(comisionesInterna)
        // comisionesInterna.map((comision)=>{
        //     comisiones.push({id: comision.id, porcentaje: comision.porcentaje.toString()})
        // })
        console.log(comisiones)
        console.log(comisiones.length)
    }

    const deleteComision = async (id) => {
        console.log("deleting")
        const response = await comisionesService.deleteComision(id)
        setComisionesFetched(false)
    }

    // const renderComisiones = () => {
    //     if (comisiones && comisiones.length > 0) {
    //         return (
    //         <View>
    //             <Block style={styles.comisionesContainer}>
    //             {comisiones.map((comision) => (
    //                 <Block>
    //                 <Block row style={styles.comisionesList}>
    //                     <Text style={styles.list}>{comision.porcentaje}</Text>
    //                     <Block row style={styles.comisionesOptions}>
    //                         <TouchableOpacity onPress={() => deleteComision(comision.id)}>
    //                         <Text style={styles.link}>Eliminar</Text>
    //                         </TouchableOpacity>
    //                     </Block>
    //                     <Divider orientation="horizontal" />
    //                 </Block>
    //                 </Block>
    //             ))}
    //             </Block>
    //         </View>
    //         )
    //     }
    // }
    const renderComisiones = () =>{
        if(comisiones && comisiones.length >0){
            return (
                <View>
                    <Block style={styles.comisionesContainer}>
                    {comisiones.map((comision) => (
                        <Block>
                        <Block row style={styles.comisionesList}>
                            <Block row style={styles.aplicado}>
                                <Text style={styles.list}>Porcentaje: {comision.porcentaje}
                                { comision.enabled == true && <Text style={styles.subtitle}> - Aplicado Actualmente</Text>}</Text>
                                
                            </Block>
                            <Block row style={styles.comisionesOptions}>
                                <TouchableOpacity onPress={() => deleteComision(comision.id)}>
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

    React.useEffect( () => {
        const unsubscribe = navigation.addListener('focus', () => {
          if (!comisionesFetched) {
            getComisiones().then()
            setComisionesFetched(true)
          }
        });
        return unsubscribe
      }, [navigation]);

      if (!comisionesFetched) {
        getComisiones().then()
        setComisionesFetched(true)
      }

    return(
        <StateScreen loading={!comisionesFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <Text style={styles.title}>Eliminar Comision/es</Text>
                    <Text style={styles.subtitle}>Selecciona eliminar para eliminar la comision</Text>
                    {renderComisiones()}      
                </ScrollView>
            </Screen>
        </StateScreen>
    )
}

const styles = StyleSheet.create({
    comisionesContainer: {
        flexDirection: 'column',
        width: '100%',
        marginTop: 12,
    },
    comisionesList:{
        alignItems: 'left',
        flexDirection:'column',
        justifyContent: 'flex-start',
    },
    comisionesOptions:{
        alignItems: 'left',
        flexDirection:'row',
        justifyContent: 'flex-start',
        paddingLeft: 12,
    },
    aplicado:{
        fontSize: 16,
        fontWeight: 600,
        color: theme.colors.grey600,
        marginLeft: 5,
        width: '100%',
        alignItems: 'center'
    },
    title: {
        color: theme.colors.primary,
        fontSize: 21,
        fontWeight: '600',
        marginLeft: 5,
        width: '100%'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 600,
        color: theme.colors.grey600,
        marginLeft: 5,
        width: '100%'
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