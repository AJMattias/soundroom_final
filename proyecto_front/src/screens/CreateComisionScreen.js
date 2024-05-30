import React, {useState} from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import { Screen } from '../components/Screen';
import { StateScreen } from '../components/StateScreen';
import { Block, Text } from 'galio-framework';
import TextInput from '../components/TextInput';
import { comisionesService } from '../network/ComisionService';
import AwesomeAlert from 'react-native-awesome-alerts';
import { theme } from '../core/theme';
import { comisionValidator } from '../helpers/comisionValidator';

export function CreateComisionScreen({navigation}) {
    const [nuevaComision, setNuevaComision] = useState({value:'', error:''});
    const [comision, setComision] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [comisiones, setComisiones] = useState([]);
    const [showAlert2, setShowAlert2] = useState(false)
    const [comisionesFetched, setComisionesFetched] = useState(false)
    const [errorMessage, setErrorMessage ] = useState({error: ''});


    const checkComision = () =>{
        const comisionError = comisionValidator(comision.value)
        setErrorMessage({...errorMessage, error:''})
        if (comisionError ) {
            setNuevaComision({ ...nuevaComision, error: comisionError })
            return
        }
        comisiones.map(
            (comision) => {
            if(comision.porcentaje == nuevaComision.value){
                setNuevaComision({ ...nuevaComision, error:'La comision ya existe, ingresa otra'})
                console.log(nuevaComision.error)
            }else{
                setNuevaComision({ ...nuevaComision, error:''})
            }
            }
        )
        console.log(nuevaComision)
        if(nuevaComision.error ==''){
            setShowAlert(true)   
        }  
    }

    const createComision2 = async () =>{
        const comisionNueva = await comisionesService.createComision(nuevaComision.value)
        setComision(comisionNueva)
        navigation.navigate('AdminComision')
    }

    const checkValueComision = async () => {
        const getComisiones = await comisionesService.getComisiones()
        getComisiones.map((comision) => comisiones.push({id: comision.id, value: comision.porcentaje, label: comision.porcentaje}))
        comisiones.forEach(comision=>{
            if(comision.value == nuevaComision){
                setShowAlert(true)
            }else{
                createComision2()
            }
        })
    }

    const fetchComision= async() => { 
        const comisiones = await comisionesService.getComisiones()
        console.log(comisiones)
        setComisiones(comisiones)
      }
    React.useEffect( () => {
        const unsubscribe = navigation.addListener('focus', () => {
         
          fetchComision();
          setComisionesFetched(true);
        });
        return unsubscribe
      }, [navigation]);

    return(
        <StateScreen loading={!comisionesFetched}>
            <Screen navigation={navigation}>
                <ScrollView>
                    <Block>
                        <Text style={styles.title}>Crear Comision</Text>
                        <Text style={styles.text}>Ten En cuenta al crear una nueva comision, esta sera la que
                            se aplique a las reservas
                        </Text>
                    
                        <TextInput    
                            label="Nueva Comision"    
                            returnKeyType="done"       
                            keyboardType="numeric"             
                            value={nuevaComision.value}
                            onChangeText={(text)=> setNuevaComision({value: text, error:''})}
                            error={!!nuevaComision.error}
                            errorText={nuevaComision.error}
                        />
                        <Button
                            mode="contained"
                            onPress={() => checkComision()}>
                        Guardar Comision
                        </Button>
                    </Block>
                        <AwesomeAlert
                        show={showAlert}
                        showProgress={false}
                        title="Nueva Comison"
                        message="¿Estas seguro de crear nueva comision'"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Cancelar"
                        confirmText="Confirmar"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            setShowAlert(false);
                        }}
                        onConfirmPressed={() => {
                            createComision2();
                        }}
                        />  
                        <AwesomeAlert
                        show={showAlert2}
                        showProgress={false}
                        title="Nueva Comison"
                        message="La comision que ingresaste ya existe, 
                        ingresa una nueva"
                        closeOnTouchOutside={false}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        cancelText="Cancelar"
                        confirmText="Confirmar"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            setShowAlert(false);
                        }}
                        onConfirmPressed={() => {
                            setShowAlert(false);
                        }}
                        /> 
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
        fontWeight: 600,
    },
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },
    text: {
        fontSize: theme.SIZES.FONT,
        color: theme.colors.grey600,
    },
})