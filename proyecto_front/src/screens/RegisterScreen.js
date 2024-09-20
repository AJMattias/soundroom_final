import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { lastNameValidator } from '../helpers/lastNameValidator'
import { userService } from '../network/UserService'
import { perfilesService } from '../network/perfilesService'
import { Picker } from '@react-native-picker/picker'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: ''})
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [password2, setPassword2] = useState({value:'', error:''})
  const [errorMessage, setErrorMessage ] = useState({error: ''})

  const [perfilSelected, setPerfilSelected] = useState({value:''})
  const [perfilesFetched, setPerfilesFetched] = useState(false)
  const [perfiles, setPerfiles] = useState([
    {id:0, name:'Tipos de Perfil'}
])

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const lastNameError = lastNameValidator(lastName.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    setErrorMessage({...errorMessage, error:''})
    if (emailError || passwordError || nameError || lastNameError) {
      setName({ ...name, error: nameError })
      setLastName({...lastName, error: lastNameError})
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    try {
      console.log("perfilSelected")
      console.log(perfilSelected.value)
      await userService.registerSr(
        email.value,
        name.value,
        lastName.value,
        password.value,
        perfilSelected.value
      )
      
      //Despues de registrarnos nos logueamos automáticamente, para que la sesión quede iniciada.
    await userService.login(email.value, password.value)
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserProfileScreen2' }],
    })

   }catch(apiError) {
      console.error("Error al loguearnos")
      console.error(apiError)
      showApiError(apiError)
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

  const showArgumentsError = (argumentsError) => {
     for(let argumentError of argumentsError) {
        switch(argumentError.field) {
           case "password":
              showPasswordError(argumentError)
              break
            
        }
     }
  }

  const showPasswordError = (argumentError) => {
      switch(argumentError.code) {
         case "PASSWORD_TOO_SHORT":
            setPassword({...password, error: "La contraseña debe tener mínimo 8 caracteres."})
            break
          case "FIELD_REQUIRED":
            setPassword({...password, error: "Este campo es requerido." })
            break
          default:
            setPassword({...password, error: "Ingrese un valor válido."})  
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

  const listPerfiles = perfiles.map((perfil) =>
        <Picker.Item key={perfil.id} label={perfil.name} value={perfil.id} />
    );


  const showEmailError = (argumentError) => {
      // TODO
  }

  const showNameError = (argumentError) => {
      // TODO
  }

  const showLastNameError = (argumentError) => {
      // TODO
  }
  if(!perfilesFetched){
    getPerfiles().then()
    setPerfilesFetched(true)
  }


  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Crear cuenta</Header>
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
      />
      <TextInput
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
          setPerfilSelected({
            value: itemValue
          })
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
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        >
        Registrarme
      </Button>
      <View style={styles.row}>
        <Text>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
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
