import { Block, Text } from "galio-framework";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { userService } from "../network/UserService";

export function GestionUserScreen ({route, navigation}){

    const {userId} = route.params
    const [userFetched, setUserFetched] = useState(false);
    const [user, setUser] = useState({});

    // const getUser = async () =>{
    //     console.log(userId)
    //     const response =  await userService.getUser(userId)
    //     console.log(response)
    
    //     if(response.createdAt){
    //         const createdAt = new Date(response.createdAt)
    //         response.createdAt = `${createdAt.getDate()} del ${createdAt.getMonth() + 1 } ${createdAt.getFullYear()}`
    //        }
    //        if(response.deletedAt){
    //            const deletedAt = new Date(response.deletedAt)
    //            response.deletedAt = `${deletedAt.getDate()} del ${deletedAt.getMonth() + 1 } ${deletedAt.getFullYear()}`
    //        }
        
    //     setUser(response)
    //     console.log(user)
    //     console.log(user.name)
    // }

    //  const deshabilitarUser = async () =>{
    //      const response = await userService.deshabilitarUser(userId, 
    //         user.email, user.name, user.last_name, user.enabled)
    //      console.log(response)
    //      setUser(response)
    //      console.log(user)
    // }

    // if(!userFetched){
    //     getUser().then()
    //     setUserFetched(true)
    // }

    useEffect(() => {
        let isMounted = true;
    
        const getUser = async () => {
          console.log(userId);
          const response = await userService.getUser(userId);
          console.log(response);
    
          if (response.createdAt) {
            const createdAt = new Date(response.createdAt);
            response.createdAt = `${createdAt.getDate()} del ${
              createdAt.getMonth() + 1
            } ${createdAt.getFullYear()}`;
          }
          if (response.deletedAt) {
            const deletedAt = new Date(response.deletedAt);
            response.deletedAt = `${deletedAt.getDate()} del ${
              deletedAt.getMonth() + 1
            } ${deletedAt.getFullYear()}`;
          }
    
          if (isMounted) {
            setUser(response);
            setUserFetched(true);
          }
        };
    
        getUser();
    
        return () => {
          isMounted = false;
        };
      }, [userId]);

    //deshabilitar usuario
    const deshabilitar = async () => {
        console.log("deshabilitando")
        console.log(userId, 
            user.email,
            user.name,
            user.last_name,
            "deshabilitado")
        const response = await userService.deshabilitarUser(userId, 
            user.email,
            user.name,
            user.last_name,
            "deshabilitado")
        console.log(response)
        setUserFetched(false)
        setUser(response)
        console.log(user)
        navigation.replace("GestionUsuariosScreen")
    }
    
    // habilitar usuario
    const habilitar = async () => {
        console.log("habilitando")
        console.log(userId, 
            user.email,
            user.name,
            user.last_name,
            "habilitado")
        const response = await userService.habilitarUser(userId,
            user.email,
            user.name,
            user.last_name, 
            "habilitado")
        console.log(response)
        setUserFetched(false)
        setUser(response)
        console.log(user)
        navigation.replace("GestionUsuariosScreen")
    }

    //Setear como admin
    const hacerAdmin = async () => {
      console.log("Hacer admin")
      console.log(userId, 
          user.email,
          user.name,
          user.last_name,
          "habilitado")
      const response = await userService.hacerAdmin(userId)
      console.log(response)
      setUserFetched(false)
      setUser(response)
      console.log(user)
      navigation.replace("GestionUsuariosScreen")
  }

   //Deshacer como admin
   const deshacerAdmin = async () => {
    console.log("Hacer admin")
    console.log(userId, 
        user.email,
        user.name,
        user.last_name,
        "habilitado")
    const response = await userService.deshacerAdmin(userId)
    console.log(response)
    setUserFetched(false)
    setUser(response)
    console.log(user)
    navigation.replace("GestionUsuariosScreen")
}

    return(
        <StateScreen loading={!userFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <View>
                    <Text style={styles.title}>Usuario: {user.name} {user.last_name}</Text>
                    <Text style={styles.text}>Usuario desde: {user.createdAt}</Text>
                    <Text style={styles.text}>Email: {user.email}</Text>
                    {/* <Text style={styles.text}>Deuda de: $</Text> */}
                    {user.enabled == "deshabilitado" &&
                    <View>
                        <Text style={styles.text}>Deshabilitado el: {user.deletedAt}</Text>
                        <Button mode="contained"
                        onPress={habilitar}
                        >Habilitar</Button>
                    </View>
                    }
                    {user.enabled == "habilitado" &&
                    <Button mode="contained"
                    onPress={deshabilitar}
                    >Deshabilitar</Button>
                    }
                    {user.enabled == "habilitado" && user.isAdmin === false &&
                    <Button mode="contained"
                    onPress={hacerAdmin}
                    >Hacer Admin</Button>
                    }
                    {user.enabled == "habilitado" && user.isAdmin === true &&
                    <Button mode="contained"
                    onPress={deshacerAdmin}
                    >Deshacer Admin</Button>
                    }
                    </View>
                </ScrollView>
            </Screen>
        </StateScreen>
    )

}

const styles = StyleSheet.create({
    title: {
        marginTop: 24,
        marginBottom: 16,
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600
    },
    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
    },
})