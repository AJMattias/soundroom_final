import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Button from '../components/Button';
import { Screen } from "../components/Screen";
import { StateScreen } from '../components/StateScreen';
import { Text } from "galio-framework";
import { perfilesService } from '../network/perfilesService';
import { userService } from '../network/UserService';
import { Picker } from '@react-native-picker/picker'
import { Navigation } from '../components';
import Header from '../components/Header';
import { theme } from '../core/theme';
import TextInput from '../components/TextInput';
import { tipoArtistaValidator } from '../helpers/tipoArtistaValidator';
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"


export function EditUserScreen ({navigation}){
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    email: ""
})
    const [name, setName] = useState({ value: '', error: '' })
    const [lastName, setLastName] = useState({ value: '', error: ''})
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [password2, setPassword2] = useState({ value: '', error: '' })
    const [perfil, setPerfil] = useState({value:'', error:''})
    const [errorMessage, setErrorMessage ] = useState({error: ''})
    const [tipoArtista, setTipoArtista] = useState({value:'', error:''})
    const [tipoPerfil, setTipoPerfil] = useState({value:'', error:''})
    const [userFetched, setUserFetched] = useState(false)
    const [perfilSelected, setPerfilSelected] = useState({value:''})
    const [perfiles, setPerfiles] = useState([
      {id:0, name:'Tipos de Perfil'}
  ])
  const user2 = LocalPhoneStorage.get(STORAGE_USER)


  const fetchUser = async () => {
   
    try {
        const userResponse = await userService.me()
        console.log("Got user")
        console.log(userResponse)
        console.log(userResponse.isAdmin)
        setUser({...userResponse, image: 'https://i.pravatar.cc/100'})
        setUser(userResponse)
        console.log(user)
        console.log('tipoArtista: ', userResponse.tipoArtista)
        setName({value:userResponse.name})
        setLastName({value:userResponse.last_name})
        setEmail({value: userResponse.email})
        setTipoArtista({value: userResponse.tipoArtista})
        // setPassword({value: user.password})
    } catch (apiError) {
        console.error("Error fetching user")
        console.log(apiError)
    }
}
  const fetchPerfil = async () => {
    try {
      const perfil = await perfilesService.getPerfil(user.idPerfil)
      setPerfil(perfil)
      console.log(perfil.name)
    } catch (apiError) {
      console.error("Error fetching perfil")
        console.log(apiError)
    }
  }

  const getPerfiles = async () => {
    const response = await perfilesService.getPerfiles()
    console.log("Got Perfiles")
    console.log(response)
    response.map(perfil=>{
      perfiles.push({id: perfil.id, name: perfil.name})
    })
    //setPerfiles(response)
    console.log(perfiles)

  }
  const showArgumentsError = (argumentsError) => {
    for(let argumentError of argumentsError) {
       switch(argumentError.field) {
          case "password":
             showPasswordError(argumentError)
             break
           
       }
    }
 }
 const showApiError = (apiError) => {
  switch(apiError.errorCode) {
     case "ENTITY_ALREADY_EXISTS":
       setEmail({...email, error: "Ya existe un usuario con ese email registrado. Por favor ingrese uno diferente."})
       break
    case "ARGUMENTS_ERROR":
      showArgumentsError(apiError.arguments)
      break
    default:
      console.error("Error de conexion: "+apiError.errorCode)
      setErrorMessage({...errorMessage, error:"Estamos teniendo problemas al conectarnos al servidor. Intente nuevamente más tarde."})
      break  
  }
}
//   const showPasswordError = (argumentError) => {
//     switch(argumentError.code) {
//        case "PASSWORD_TOO_SHORT":
//           setPassword({...password, error: "La contraseña debe tener mínimo 8 caracteres."})
//           break
//         case "FIELD_REQUIRED":
//           setPassword({...password, error: "Este campo es requerido." })
//           break
//         default:
//           setPassword({...password, error: "Ingrese un valor válido."})  
//     }
// }

  const listPerfiles = perfiles.map((perfil) =>
  <Picker.Item key={perfil.id} label={perfil.name} value={perfil.id} />
  );

  const editarPerfil = async () =>{
    console.log('Editar pressed 1')
    //checkPasswords(password2.value)

    if (password.value !== password2.value) {
      setPassword2({ value: '', error: 'Las contraseñas deben ser iguales' });
      return; // Detenemos la ejecución si las contraseñas no coinciden
    }

    const tipoArtistaError = tipoArtistaValidator(tipoArtista.value)
    const tipoPerfilError = tipoPerfilValidator(tipoPerfilValidator.value)
    setErrorMessage({...errorMessage, error:''})
    if (tipoArtistaError || tipoPerfilValidator) {
       setTipoArtista({ ...tipoArtista, error: tipoArtistaError })
       //setTipoPerfil({ ...tipoPerfil, error: tipoPerfilError})
       setErrorMessage({...errorMessage, error:tipoPerfilError})
       return
    }else{
      try {
        console.log('Editar pressed')
        const userNuevo = await userService.update(
          user.id,
          email.value,
          name.value,
          lastName.value,
          "habilitado",
          perfilSelected.value,
          tipoArtista.value,
          password.value
        )
        console.log("User Edited")
        console.log(userNuevo)
        //await userService.login(email.value, password.value)
        navigation.replace('UserProfileScreen2')
      }catch(apiError) {
        console.error("Error al loguearnos")
        console.error(apiError)
        showApiError(apiError)
      }
   }
  }

  const checkPasswords = (pass2) =>{
    console.log('checking passwords')
    if (pass2 == password.value){
      setPassword2({value: pass2, error:''})
      console.log('checked passwords')
    }else{
      setPassword2({value:'', error:'Las contraseñas deben ser iguales'})
    }
  }

    if(!userFetched){
      getPerfiles().then()
      fetchUser().then()
      //fetchPerfil().then()
      setUserFetched(true)
    }

    return(
        <StateScreen  loading={!userFetched}>
          <Screen navigation={navigation}>
            <ScrollView>
              <Text style={styles.title}>Editar Usuario</Text>
              <TextInput
                label="Nombre"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
              />
              <TextInput
                label="Apellido"
                returnKeyType="next"
                value={lastName.value}
                onChangeText={(text) => setLastName({ value: text, error: '' })}
                error={!!lastName.error}
                errorText={lastName.error}
              />
              {
                user.idPerfil && user2.idPerfil.name == "Artista" && (
                  <TextInput
                  label="Tipo de Artista"
                  returnKeyType="next"
                  value={tipoArtista.value}
                  onChangeText={(text)=>setTipoArtista({value: text, error:''})}
                  error={!!tipoArtista.error}
                  errorText={tipoArtista.error}
                ></TextInput>
                   )
                }
              <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
              
              <TextInput
                label="Contraseña"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
              /><TextInput
                label="Repite la Contraseña"
                returnKeyType="done"
                value={password2.value}
                onChangeText={(text) => setPassword2({ value: text, error: '' })}
                //onChangeText={(text) => checkPasswords(text)}
                error={!!password2.error}
                errorText={password2.error}
                secureTextEntry
              />
              <Text  style = {styles.subtitle}>Elige tipo de Perfil</Text>
                <Picker
                  style={styles.container}
                  onValueChange={(itemValue, itemIndex) => {
                    console.log(itemValue)  
                    setPerfilSelected({value: itemValue})
                  }}
                  >
                  {listPerfiles}
                </Picker>
              <Text
                style = {styles.errorMessage}
              >
              {errorMessage.error}
              </Text>
              <Button
                mode="contained"
                onPress={editarPerfil}
                style={{ marginTop: 24 }}
                >
                Editar
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
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
    errorMessage: {
      fontWeight: 'bold',
      color: '#ff4444',
      width: '100%',
      textAlign: 'center'
    }
})