import { Block, Text } from "galio-framework";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { comisionesService } from "../network/ComisionService";

export function ConsultComisionScreen ({navigation}){

    const [comisionesFetched, setComisionesFetched] = useState(false)
    const [comisiones, setComisiones] = useState()

    const fetchComisiones = async() =>{
        const response = await comisionesService.getComisiones()
        console.log("comisiones:")
        console.log(response)
        response.map(comision=>{
          const date = new Date(comision.createdAt)
          comision.createdAt = `${date.getDate()} del ${date.getMonth() + 1 } ${date.getFullYear()}`
          if(comision.deletedAt){
          const deletedAt = new Date(comision.deletedAt)
          comision.deletedAt = `${deletedAt.getDate()} del ${deletedAt.getMonth() + 1 } ${deletedAt.getFullYear()}`
          }
        })
        setComisiones(response)
        setComisionesFetched(true)
    }

    const renderItem = ({item}) => {
        return(
          <Block row style={styles.comisionContainer}
        //   onClick={()=>handlerOnPress(item)}
          >
            <Text style={styles.list}>Porcentaje: {item.porcentaje}%</Text> 
            <Text style={styles.subtitle}>Aplicado en el periodo: {item.createdAt} - {item.deletedAt}</Text>
            { !item.deletedAt && (<Text style={styles.subtitle}>Actuallidad</Text>)}
          </Block>
        )
    }

//     const date = new Date("2022-03-11T22:33:12.674Z")
// const coso = `${date.getDate()} del ${date.getMonth() + 1 } ${date.getFullYear()}`

   // useEffect(() => {
    if(!comisionesFetched){
        fetchComisiones()
    }
   // })

    return(
        <StateScreen loading={!comisionesFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <Text style={styles.title}> Historial de Comisiones</Text>
                    <FlatList
                        data={comisiones}
                        renderItem={renderItem}
                        keyExtractor={(item)=> item.id}
                    />
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
    comisionContainer: {
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
    }
)