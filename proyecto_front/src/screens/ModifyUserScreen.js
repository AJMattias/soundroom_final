/* eslint-disable prettier/prettier */
import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { View } from 'react-native'
import { ScrollView, state } from 'react-native-gesture-handler'
import { TextInput } from 'react-native-paper'
import BackButton from '../components/BackButton'
import Background from '../components/Background'
import Button from '../components/Button'
import Header from '../components/Header'
import Logo from '../components/Logo'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { nameValidator } from '../helpers/nameValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { userService } from '../network/UserService'
import { LocalPhoneStorage } from '../storage/LocalStorage'




export default function CreateModifyUserScreen({ navigation }) {
  const [user_name, setUser_name] = useState({ value: '', error: '' })
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [apellido, setApellido] = useState({ value: '', error: '' })
  const [user, setUser] = useState(LocalPhoneStorage.get("user"))
  const [userFetched, setUserFetched] = useState(false)
  const [password, setPassword] = useState({ value: '', error: '' })
  const [selectedValue, setSelectedValue] = useState()


  const saveNewUser =  () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
  


    if (emailError || nameError ) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setUser_name({ ...user_name, error: 'ingrese un nombre' })
      setApellido({ ...apellido, error: 'apellido incorrecto' })
      // alert('Por favor ingresa un nombre')
    } else {
        performSave(email.value, name.value, apellido.value).then()
    }
  }

  const performSave =  async (email, name, lastName ) => {
    console.log("updating user")
     try {
         await userService.update(
           user.id,
           email,
           name,
           lastName
         )
         navigation.reset({
          index: 0,
          routes: [{ name: 'UserProfileScreen2' }],
        })
     } catch (apiError) {
        console.error("Error updating user")
        console.error(apiError)
        setEmail({...email, error: "Tenemos problemas conectandonos al servidor. Prueba nuevamente mas tarde."})
     }
  }

  const fetchUser = async () => {
    try {
      setUser(
        await userService.me() 
      )
    } catch(apiError) {
       console.error("Error fetching user") 
    }
  }

  const  updateUser = () => {
    setEmail({...email, value: user.email})
    setApellido({...apellido, value: user.last_name})
    setName({...name, value: user.name})
  }

  if(!userFetched) {
     setUserFetched(true)
     fetchUser().then()
     updateUser()
    }


    return (
      <Background>
        <BackButton goBack={navigation.goBack} />
        <Header>Modificar Usuario</Header>
          <View>
            <TextInput
              label="Nombre"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({ value: text, error: '' })}
              error={!!name.error}
              errorText={name.error}
            />
          </View>
          <View>
            <TextInput
              label="Apellido"
              returnKeyType="next"
              value={apellido.value}
              onChangeText={(text) => setApellido({ value: text, error: '' })}
              error={!!apellido.error}
              errorText={apellido.error}
            />
          </View>
          <View>
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
          </View>
          <View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }>
            <Picker.Item label="Artista" value="Musico" />
            <Picker.Item label="Sala de ensayo" value="Sala de Ensayo" />
        </Picker>
        </View>
          <View>
            <Button
              mode="contained"
              onPress={saveNewUser}
              style={{ marginTop: 24 }}
            >
              Modificar Usuario
            </Button>
          </View>
      </Background>
    )
  }