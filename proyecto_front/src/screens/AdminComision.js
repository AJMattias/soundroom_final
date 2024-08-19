import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native-gesture-handler";
import { StateScreen } from '../components/StateScreen'
import {Alert, StyleSheet, View} from "react-native"
import { comisionesService } from '../network/ComisionService'
import { theme } from "../core/theme";
import { Screen } from '../components/Screen'
import { Text } from "galio-framework";
import Button from "../components/Button"
import TextInput from "../components/TextInput";
import { Accordion, Block } from 'galio-framework';
import { Picker } from "@react-native-picker/picker";
import { StackActions } from "@react-navigation/native";
import AwesomeAlert from 'react-native-awesome-alerts';

//import { createStackNavigator } from 'react-navigation';

export  function AdminComision({navigation}){

  const [comision, setComision] = useState({});
  const [comisionFetched, setComisionFetched] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [comisiones, setComisiones] = useState([
    {id:'0', label: 'Elige una comision'}
  ]);
  const [comisionSelected, setComisionSelected] = useState();
  const [valorComisionActual, setValorComisionActual] = useState();
  const [valorComisionActual2, setValorComisionActual2] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [idComisionSelected, setIdComisionSelected] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [comisionDefault, setComisionDefault] = useState(0)
  const [comisionesToPick, setComisionesToPick] = useState([{label: 'Elige una comision'}])

  
  const fetchComision= async() => {
    let comisionEnabled
    const value = 0
    setComision(comisionDefault)
    if(!comisionEnabled){
      try {
        comisionEnabled = await comisionesService.getComisionEnabled()
        console.log(comisionEnabled)
        setComision(comisionEnabled)
        setValorComisionActual(comisionEnabled.porcentaje)
      } catch (error) {
        console.log(error)
        //navigation.navigate("CreateComisionScreen")
        comisionEnabled = 0
        setValorComisionActual(comisionEnabled)
      }
    }else{
      console.log("setear comision a 0")
      comisionEnabled = 0
      setValorComisionActual(comisionEnabled)
    }
  }

  
  const addComisionesToArray = async () =>{
    setComisionesToPick([{id: '0', label: 'Elige una comision'}])
    console.log(comisiones.length)
    let lengthComisiones = comisiones.length
    console.log(lengthComisiones)

    if(lengthComisiones>0){
        for(let i = 0; i < lengthComisiones; i++){
          comisiones.pop()
          console.log(comisiones.length)
          console.log(comisiones)
        }
    }

    console.log(comisiones)
    const getComisiones = await comisionesService.getComisiones()
    if(!getComisiones) {
      return
    }
    getComisiones.map((comision) => {
      //comisiones.push({id: comision.id, value: comision.porcentaje, label: comision.porcentaje})
      comisiones.push({id: comision.id, label: comision.porcentaje})
      comisionesToPick.push({id: comision.id, value: comision.porcentaje, label: comision.porcentaje})
    }
    )
    console.log(comisiones)
    console.log(comisionesToPick)
  }



  const actualizarComision = async () =>{
    console.log(idComisionSelected)
    console.log(comisionSelected)
    const comisionActualizada = await comisionesService.actualizarComision(comisionSelected.value
      //, comisionSelected.value
      )
    console.log(comisionActualizada)
    replace()
  }

  //const listComisiones =  comisionesToPick.map((comision) => 
  const listComisiones =  comisiones.map((comision) => 
  <Picker.Item key ={comision.id} label={comision.label} value={comision.id}
  />)


  const replace = () => {
    navigation.dispatch(
      StackActions.replace('AdminComision', null)
    )
  }


  //Cuando vuelvo para atras a esta pantalla, se debe acualizar
  React.useEffect( () => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldShow(false)
      fetchComision();
      addComisionesToArray();
      setComisionFetched(true);
    });
    return unsubscribe
  }, [navigation]);

return (
<StateScreen loading={!comisionFetched}>
  <Screen navigation={navigation}>
    <ScrollView>
      <View>
        <Text style={styles.title}>Gestion de Comision</Text>
        <Text style={styles.text}>Comision Actual: {valorComisionActual}</Text>
        <View>
          <Button mode="contained"
          onPress={()=>navigation.navigate('CreateComisionScreen')}>
            Nueva Comision
          </Button>
          <Button mode="contained"
          onPress={()=>navigation.navigate('ConsultComisionScreen')}>
            Ver Historico
          </Button>
          <Button mode="contained"
            onPress={()=>navigation.navigate('DeleteComisionesScreen')}>
            Eliminar Comision
          </Button>
          <Button mode="contained" onPress={() => setShouldShow(true)}>
            Cambiar Monto
          </Button>
        </View>
      </View>
      {shouldShow ? (
        <View>
          <Text style={styles.title}>Cambiar porcentaje de comision</Text>
          <Text style={styles.text}>Elige un porcentaje monto de comision</Text>
          <Block>
            {/* <Picker
              style={styles.container}
              // mode="dropdown"
              selectedValue={valorComisionActual2}
              onValueChange={(itemValue, itemIndex) => {
              const idComisionSeleccionada = comisiones[itemIndex].id
              const comisioneSeleccionada = comisiones[itemIndex]
              setIdComisionSelected(idComisionSeleccionada)
              setComisionSelected(comisioneSeleccionada)
              setValorComisionActual2(itemValue)
              }}
            > */}
            <Picker
              style={styles.container}
              onValueChange={(itemValue, itemIndex) => {
                console.log(itemValue)  
                setComisionSelected({value: itemValue})
              }}
              >
              {listComisiones}
            </Picker>
            <Button mode="contained" onPress={() => setShowAlert(true)}>
            Guardar Comision
          </Button>
          </Block>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Modificacion de comision"
            message="Deseas continuar con la modificacion?"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Cancelar"
            confirmText="Confirmar"
            confirmButtonColor="#DD6B55"
            //confirmButtonColor="#FBFBFB"DD6B55
            onCancelPressed={() => {
              setShowAlert(false);
            }}
            onConfirmPressed={() => {
              actualizarComision();
            }}
          />
          
          
        </View>
      ) : null}
    </ScrollView>
  </Screen>
</StateScreen>
)
}

const styles = StyleSheet.create({
text: {
  fontSize: theme.SIZES.FONT,
  color: theme.colors.grey600,
},
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
  list: {
    fontSize: theme.SIZES.FONT,
    fontWeight: 600,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  picker: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  container: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    borderRadius: '0px solid black',
    height: '56px',
  },
})