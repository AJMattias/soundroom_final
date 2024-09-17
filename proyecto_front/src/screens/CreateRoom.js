
import React, { useState, useEffect  }from 'react'
import { View, StyleSheet, TouchableOpacity, CheckBox } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import { LocalPhoneStorage, STORAGE_USER } from '../storage/LocalStorage'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import {roomService} from '../network/RoomService'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { userService } from '../network/UserService'
import { Picker } from '@react-native-picker/picker';
import Tags from 'react-native-tags'
import { roomVerificator } from '../helpers/roomVerificator'
import { roomNameValidator } from '../helpers/roomNameValidator'
import { priceRoomValidator } from '../helpers/priceRoomValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'
import { tipoSalaValidator } from '../helpers/tipoSalaValidator'


export  function CreateRoom({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [calleDireccion, setCalleDireccion] = useState({ value: '', error: ''})
  const [descripcion, setDescripcion ] = useState({value: '', error: ''})
  const [numeroDireccion, setNumeroDireccion] = useState({ value: '', error: '' })
  const [precio, setPrecio] = useState({ value: '', error: '' })
  const [type, setType] = useState({ value: '', error: '' })
  const [types, setTypes] = useState([
    { id: '0', name:'Tipos de sala' }])
  const [typeSelected, setTypeSelected] = useState({value:''})
  const [localidad, setLocalidad] = useState({ value: '', error: '' })
  const [checkValue, setCheckValue] = useState(false);
  const [comodidadesValue, setComodidadesValue] = useState([]);
  const [tipoSala, setTipoSala] = useState({value:'', error:''})

  const [errorMessage, setErrorMessage ] = useState({error: ''})

  const [provinces, setProvinces] = useState([]);    
  const [provinceSelected, setProvinceSelected] = useState("");
  const provincia = {seleccion: ""};

  const [harcodeoM2, setHarcodeoM2] = useState([[1,30, 2000], [2,40, 2500], [3,45, 3000], [4,50, 3500], [5,55, 4000], [6,60, 4500], [7,65, 5000], [8,70, 6000]]);
   
  const [localitiesHiden, setLocalitiesHiden] = useState(true);
  const [localities, setlocalities] = useState([]);


  const [rooms, setRooms] = useState([]);
  const room = {
    nameSalaEnsayo: "",
    calleDireccion: "",
    numeroDireccion: 0,
    duracionTurno: 0,
    localidad: "",
    enabled: false,
    idtype: "",
    comodidades: []
  };


    useEffect(() => {
      //fetchProvinces(),
      fetchTypes()
    }, [])
    //para mapear ordenadamente cada uno de los items de los combos
    const listProvinces = provinces.map((province) =>
    
        <Picker.Item key={province.id} label={province.nameProvince} value={province.nameProvince} />
    );
    
    const listLocalities = localities.map((locality) =>
        <Picker.Item key={locality.id} label={locality.nameLocality} value={locality.nameLocality} />
    );
    
    
    //para mapear ordenadamente cada una de las Salas
    const listRooms = rooms.map((room) =>
        <div className ={clases}>
            <h3> {room.nameSalaEnsayo} </h3>
            <hr/>
            <p>Ubicaci�n: {room.calleDireccion} " n�" {room.numeroDireccion}, {localidad.seleccion}, {provincia.seleccion}</p>
            <p>Duraci�n del turno: {room.duracionTurno}''</p>
        </div>
    );
    //para efectuar la busqueda en base a los valores establecidos
    /*
    const fetchRooms = async () => {
        try {
            const roms = await roomService.search()
            console.log("Got Rooms")
            console.log(roms)
            setUser(roms)
        } catch (apiError) {
            console.error("Error fetching roms")
            console.log(apiError)
        }
    }
    */

    const changeCheckValue = () => {
      console.log('old checkValue: ', checkValue)
      setCheckValue(prevCheckValue => !prevCheckValue);
      console.log('new checkValue: ', checkValue)
    }

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

    //old function fetchTypes SdE to bd
    const fetchTypes1 = async () => {
        try {
            const types  = await roomService.searchType()
            console.log("Got types")
            console.log(types)
            setTypes(types)
            const  idTypes =  types[0].id
            type.seleccion =  idTypes
        } catch (apiError) {
            console.error("Error fetching types")
            console.log(apiError)
        }
    }

    //working fetchtypes to bd
    const fetchTypes = async() =>{
        try{
            const response  = await roomService.searchType()
            console.log("Got types")
            console.log(types)
            // response.map(type=>{
            //     types.push({id: type.id, name: type.name})
            // })

            const updatedTypes = response.map(type => ({ id: type.id, name: type.name }));
            setTypes([{ id: '0', name: 'Tipos de sala' }, ...updatedTypes]);

            console.log(types)
        }
        catch(apiError){
            console.error("Error fetching types")
            console.log(apiError)
        }
    }
    const listPrecio = harcodeoM2.map((precio) =>
        <Picker.Item key={precio[0]} label={String(precio[1])} value={precio[1]} />
    );

    const listTypesSala = types.map((type) =>
        <Picker.Item key={type.id} label={type.name} value={type.id} />
    );

    const listTypes = types.map((type) =>
      <Picker.Item key={type.id} label={type.name} value={type.name} />
    );

    //guardar la sala
    /*
    const [name, setName] = useState({ value: '', error: '' })
    const [calleDireccion, setCalleDireccion] = useState({ value: '', error: '' })
    const [descripcion, setDescripcion] = useState({ value: '', error: '' })
    const [numeroDireccion, setNumeroDireccion] = useState({ value: '', error: '' })
    const [precio, setPrecio] = useState({ value: '', error: '' })
    */
    const saveRoom = async () => {
        const nameError = roomNameValidator(name.value)
        const calleDireccionError = descriptionValidator(calleDireccion.value)
        const descripcionError = descriptionValidator(descripcion.value)
        const precioError = priceRoomValidator(precio.value)
        const tipoSalaError = tipoSalaValidator(tipoSala.value)
        setErrorMessage({ ...errorMessage, error: '' })
        if (nameError || calleDireccionError || precioError || descripcionError || tipoSalaError ) {
            setName({ ...name, error: nameError })
            setCalleDireccion({ ...calleDireccion, error: calleDireccionError })
            setDescripcion({ ...descripcion, error: descripcionError })
            setPrecio({ ...precio, error: precioError })
            setTipoSala({...tipoSala, error: tipoSalaError})
            return
        }else{
            try {
                const room = {
                    name: name.value,
                    address: calleDireccion.value,
                    summary: descripcion.value,
                    enabled: checkValue,
                    hourlyRate: parseFloat(precio.value),
                    comodidades: comodidadesValue, 
                }
                const stored = await roomService.storeRoom(room)
                navigation.navigate("RoomScreen", {
                    roomId: stored.id
                })

            } catch (apiError) {
                console.error("Error fetching roms")
                console.log(apiError)
            }
        }
    }
    const getUser = () => {
      //console.log(LocalPhoneStorage.get(STORAGE_USER))
      return LocalPhoneStorage.get(STORAGE_USER)
  }


    //Crear sala y guardar en base de datos
    //TODO modificar datos necesarios para seguir con el camino 
    const saveRoomBd = async () => {
      console.log('guardar pressed')
      const nameError = roomNameValidator(name.value)
      const calleDireccionError = descriptionValidator(calleDireccion.value)
      const descripcionError = descriptionValidator(descripcion.value)
      const precioError = priceRoomValidator(precio.value)
      //const tipoSalaError = tipoSalaValidator(tipoSala.value)
      setErrorMessage({ ...errorMessage, error: '' })
      if (nameError || calleDireccionError || precioError || descripcionError
    //||    tipoSalaError
        ) {
          setName({ ...name, error: nameError })
          setCalleDireccion({ ...calleDireccion, error: calleDireccionError })
          setDescripcion({ ...descripcion, error: descripcionError })
          setPrecio({ ...precio, error: precioError })
          //setTipoSala({...tipoSala, error: tipoSalaError})
          return
      }else{
        console.log('no errors')
          try {
            let habilitado = ''
            if(checkValue === true){
              habilitado = 'habilitado'
            }else if(checkValue === false){
              habilitado = 'deshabilitado'
            }
              const room = {
                  nameSalaDeEnsayo: name.value,
                  calleDireccion: calleDireccion.value,
                  descripcion: descripcion.value,
                  enabled: habilitado,
                  precioHora: parseFloat(precio.value),
                  comodidades: comodidadesValue,
                  tipoSala: typeSelected.value,
              }
              console.log('Front creating room:', room)
              const stored = await roomService.saveRoom(room)
              //const stored2 = await roomService.saveRoom2(nameSalaDeEnsayo, calleDireccion, 
              //  descripcion, precioHora, comodidades)
              console.log('room created in db', stored)
              const user = getUser()
              if( user.idPerfil && user.idPerfil.name.toLowerCase() === "artista"){
                console.log(user.idPerfil.name)
                const userPerfil = await userService.getUserBd(stored.idRoom)
                if(userPerfil){
                  await LocalPhoneStorage.set(STORAGE_USER, userPerfil)
                }
              }
              //console.log('room created in db', stored2)
              navigation.navigate("RoomScreen", {
                  roomId: stored.id
              })

          } catch (apiError) {
              console.error("Error fetching roms")
              console.log(apiError)
          }
      }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Crear Sala</Header>
      <TextInput
        label="Nombre"
        returnKeyType="next"
        value={name.value}
        error={!!name.error}
        errorText={name.error}
        onChangeText={(text) => setName({ value: text, error: '' })}
      />
      {/* input stipo sala de ensayo vieja */}
    {/* <TextInput
        label="Tipo de Sala de Ensayo"
        returnKeyType="next"
        value={tipoSala.value}
        error={!!tipoSala.error}
        errorText={tipoSala.error}
        onChangeText={(text) => setTipoSala({ value: text, error: '' })}
      />    */}

    <Picker
        style={styles.container}
        onValueChange={(itemValue, itemIndex) => {
        console.log(itemValue)  
        setTypeSelected({value: itemValue})
        console.log(typeSelected)
        }}
        >
        {listTypesSala}
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
        <text h3 style={{ textAlign: 'left' }}> Sugerir un precio(seleccione los M2) </text>
        <Picker
            style={styles.container}
            onValueChange={(itemValue, itemIndex) => {
                const idPrecio = harcodeoM2[itemIndex][0];
                setPrecio({ value: harcodeoM2[itemIndex][2], error: '' })
            }}
        >
            {listPrecio}
        </Picker>
      <Text
      style = {styles.errorMessage}
      >
      {errorMessage.error}
      </Text>
    <Text style={styles.aclaracion}>Comodidades
        <Text style={styles.description}>(Añadir las comodidades sin espacio)
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
           />
          {console.log('new checkValue (in render): ', checkValue)}

    </Text>

    <Button
        mode="outlained"
        onPress={saveRoomBd}
        style={{ marginTop: 24 }}
        >
        Guardar
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
    tags: {
        backgroundColor: theme.colors.primary,
        border: "2px solid #717171",
        borderRadius: 10
    },
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
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  
  checkbox: {
    alignSelf: "center",
    color: theme.colors.primary,
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
   errorMessage: {
     fontWeight: 'bold',
     color: '#ff4444',
     width: '100%',
     textAlign: 'center'
   }
})
