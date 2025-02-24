
import React, { useState, useEffect  }from 'react'
import { View, StyleSheet, TouchableOpacity, CheckBox } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import {roomService} from '../network/RoomService'
import { StateScreen } from '../components/StateScreen'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { userService } from '../network/UserService'
import { Picker } from '@react-native-picker/picker';
import Tags from 'react-native-tags'
import { roomVerificator } from '../helpers/roomVerificator'
import { tipoSalaValidator } from '../helpers/tipoSalaValidator'
import { roomNameValidator } from '../helpers/roomNameValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'
import { priceRoomValidator } from '../helpers/priceRoomValidator'

export  function EditRoom({ route, navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [calleDireccion, setCalleDireccion] = useState({ value: '', error: ''})
  const [descripcion, setDescripcion ] = useState({value: '', error: ''})
  const [numeroDireccion, setNumeroDireccion] = useState({ value: '', error: '' })
  const [precio, setPrecio] = useState({ value: '', error: '' })
  const [type, setType] = useState({ value: '', error: '' })
  const [localidad, setLocalidad] = useState({ value: '', error: '' })
  const [checkValue, setCheckValue] = useState();
  const [comodidadesValue, setComodidadesValue] = useState();
  const [tipoSala, setTipoSala] = useState({value:'', error:''})

  const [typeSelected, setTypeSelected] = useState({value:''})
  const { roomId } = route.params
  const [roomFetched, setRoomFetched] = useState(false)
  const [ratings, setRatings] = useState([])
  const [room, setRoom] = useState({ calleDireccion: '',
    nameSalaEnsayo: '',
    precioHora: '',
    descripcion: '', 
    comodidades:[]})

  const [errorMessage, setErrorMessage ] = useState({error: ''})

  const [provinces, setProvinces] = useState([]);    
  const [provinceSelected, setProvinceSelected] = useState("");
  const provincia = {seleccion: ""};

  const [localitiesHiden, setLocalitiesHiden] = useState(true);
  const [localities, setlocalities] = useState([]);

  const [types, setTypes] = useState([
    { id: '', name:'Tipos de sala' }]);

  const [rooms, setRooms] = useState([]);
  const [typesFetched, setTypesFetched] = useState(false)

    useEffect(() => {
      // fetchProvinces(),
      setTypes([
        { id: '', name:'Tipos de sala' }])
      fetchTypes()
    }, [])
    //para mapear ordenadamente cada uno de los items de los combos
    const listProvinces = provinces.map((province) =>
        <Picker.Item key={province.id} label={province.nameProvince} value={province.nameProvince} />
    );
    

    const listLocalities = localities.map((locality) =>
        <Picker.Item key={locality.id} label={locality.nameLocality} value={locality.nameLocality} />
    );
    
    const listTypes = types.map((type) =>
        <Picker.Item key={type.id} label={type.name} value={type.id} />
    );

    const fetchLocalities = async () => {
        try {
            const locality  = await roomService.searchLocalities(provincia.seleccion)
            console.log("Got localities")
            console.log(locality)
            setlocalities(locality)
            if (locality[0].id != null) {
                const  idLocality =  locality[0].id
                localidad.seleccion =  idLocality
                console.log("la localidad por defecto es " + localidad.seleccion + " con idlocality " + idLocality)
            }
        } catch (apiError) {
            console.error("Error fetching Localities")
            console.log(apiError)
        }
    }
    
    const fetchProvinces = async () => {
        try {
            const province  = await roomService.searchProvinces()
            console.log("Got Provinces")
            console.log(province)
            setProvinces(province)
            const  idProvincia =  province[0].id
            provincia.seleccion =  idProvincia
        } catch (apiError) {
            console.error("Error fetching Provinces")
            console.log(apiError)
        }
    }

    const fetchTypes = async () => {
      console.log('typesFetched.length: ', types.length)
      if(!typesFetched && types.length <=1){
        try{
          const response  = await roomService.searchType()
          console.log("Got types")
          console.log(types)
          response.map(type=>{
              types.push({id: type.id, name: type.name})
          })
          console.log(types)
          setTypesFetched(true)
        }
        catch(apiError){
          console.error("Error fetching types")
          console.log(apiError)
        }
      }
    }

    const fetchRoom = async () => {
        try {
          const roomF =  await roomService.getRoomBd(roomId)
          setRoom(roomF)
          setRoomFetched(true)
          setRoomChange(room)
          setName({value: roomF.nameSalaEnsayo})
          setCalleDireccion({value:roomF.calleDireccion})
          setDescripcion({value:roomF.descripcion})
          setComodidadesValue(roomF.comodidades)
          setPrecio({value: roomF.precioHora})
          if(roomF.enabled == 'habilitado'){
            setCheckValue(true)
          }else if(roomF.enabled == 'deshabilitado'){
            setCheckValue(false)
          }
          const valorCheck = checkValue
          console.log('checkValue: ', valorCheck)
        } catch (apiError) {
            console.error(apiError)
            setRoomFetched(true)
        }
    }



    function setRoomChange(room){
        setName({ value: room.name, error: '' })
        setCalleDireccion({ value: room.address, error: '' })
        setDescripcion({ value: room.summary, error: '' })
        setPrecio({ value: room.hourlyRate, error: '' })
        setCheckValue(room.enabled),
        setComodidadesValue(room.comodidades)
    }

    if (!roomFetched) {
        fetchTypes().then()
        fetchRoom().then()
        console.log("el room encontrado es " + room)
    }

    const changeCheckValue = () => {
      console.log('old checkValue: ', checkValue)
      setCheckValue(prevCheckValue => !prevCheckValue);
      console.log('new checkValue: ', checkValue)
    }

   
    //guardar la sala
    const saveRoom = async () => {
      console.log('guardar pressed')
      const nameError = roomNameValidator(name.value)
        const calleDireccionError = descriptionValidator(calleDireccion.value)
        const descripcionError = descriptionValidator(descripcion.value)
        const precioError = priceRoomValidator(precio.value)
        //const tipoSalaError = tipoSalaValidator(tipoSala.value)
        setErrorMessage({ ...errorMessage, error: '' })
        if (nameError || calleDireccionError || precioError || descripcionError) {
            setName({ ...name, error: nameError })
            setCalleDireccion({ ...calleDireccion, error: calleDireccionError })
            setDescripcion({ ...descripcion, error: descripcionError })
            setPrecio({ ...precio, error: precioError })
            //setTipoSala({...tipoSala, error: tipoSalaError})
            return
        }else {
            try {
              let habilitado = ''
              if(checkValue === true){
                habilitado='habilitado'
              }else if(checkValue === false){
                habilitado='deshabilitado'
              }
              const roomModificado = {
                  idRoom: roomId,
                  nameSalaDeEnsayo: name.value,
                  calleDireccion: calleDireccion.value,
                  descripcion: descripcion.value,
                  precioHora: parseFloat(precio.value),
                  enabled: habilitado,
                  comodidades: comodidadesValue,
                  tipoSala: typeSelected.value
              }
              console.log("El room modificado es")
              console.log(roomModificado)
              const stored = await roomService.editRoom(roomModificado)
              console.log('sala acutalizada: ', stored)
              setRoomFetched(false)
              navigation.navigate("RoomScreen", {roomId: stored.id})

            } catch (apiError) {
                console.error("Error fetching roms")
                console.log(apiError)
            }
        }
    }

  return (
    <StateScreen loading={!roomFetched} >
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Editar Sala</Header>
      <TextInput
        label="Nombre"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      {/* <TextInput
        label="Tipo de Sala de Ensayo"
        returnKeyType="next"
        value={tipoSala.value}
        error={!!tipoSala.error}
        errorText={tipoSala.error}
        onChangeText={(text) => setTipoSala({ value: text, error: '' })}
      />   */}
      <Picker
        style={styles.container}
        onValueChange={(itemValue, itemIndex) => {
        console.log(itemValue)  
        setTypeSelected({value: itemValue})
        console.log(typeSelected)
        }}
        >
        {listTypes}
    </Picker>
      <TextInput
        label="Descripción"
        multiline="true"
        returnKeyType="next"
        value={descripcion.value}
        error={!!descripcion.error}
        errorText={descripcion.error}
        onChangeText={(text) => setDescripcion({ value: text, error: '' })}
      />
      
      <TextInput
        label="Dirección"
        returnKeyType="next"
        value={calleDireccion.value}
        error={!!calleDireccion.error}
        errorText={calleDireccion.error}
        onChangeText={(text) => setCalleDireccion({ value: text, error: '' })}
      />

      <TextInput
        label="Precio por hora"
        returnKeyType="done"
        keyboardType="numeric"
        value={precio.value}
        error={!!precio.error}
        errorText={precio.error}
        onChangeText={(text) => setPrecio({ value: text, error: '' })}
      />
    <Text style={styles.description}>Comodidades :
        <Text style={styles.aclaracion}>(Añadir las comodidades sin espacio)
        </Text>
    </Text>
      <Tags
        initialTags={room.comodidades}
        onChangeTags={(tags) => setComodidadesValue(tags)}
        onTagPress={(index, tagLabel, event) =>
            console.log(index, tagLabel, event)
        }
        onPress={(index, tagLabel, event) =>
            console.log(index, tagLabel, event)}
        inputStyle={styles.tags}
      />
      <Text style={styles.link}>Habilitacion :  
          <CheckBox
              value={checkValue}
              onValueChange={changeCheckValue}
              style={styles.checkbox}
              color= "#ff8c00"
              uncheckedColor= "#414757"
           />
           {console.log('new checkValue (in render): ', checkValue)}

      </Text>

      <Text
      style = {styles.errorMessage}
      >
      {errorMessage.error}
    </Text>
    <Button
        mode="outlained"
        onPress={saveRoom}
        style={{ marginTop: 24 }}
        >
        Guardar
      </Button>
    </Background>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  container: {
    width: '100%',
    marginVertical: 12,
    fontSize: 16,
    borderRadius: '0px solid black',
    height: '56px',
   },
  aclaracion: {
    fontSize: 13,
    color: theme.colors.primary,
    paddingTop: 8,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    alignSelf: "left",
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkbox: {
    alignSelf: "flex-end",
    checkedColor: theme.colors.secondary,
    uncheckedColor: theme.colors.primary
  },
  errorMessage: {
    fontWeight: 'bold',
    color: '#ff4444',
    width: '100%',
    textAlign: 'center'
  }
})
