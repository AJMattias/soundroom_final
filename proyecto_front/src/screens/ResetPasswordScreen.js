import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { userService } from '../network/UserService'

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [code, setCode] = useState()

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    if(code) {
      loginWithCode().then(
        setTimeout(() =>  {
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserProfileScreen2' }],
          })
        }, 1000)
       
      )
    } else {
       createCode().then()
    }
  }

  const createCode = async () => {
     try {
        const code = await userService.forgotPassword(email.value)
        setCode({
          value: '',
          error: ''
        })
     } catch(ignored) {
        setEmail({...email, error: 'El mail ingresado no existe' })
     }
  }

  const loginWithCode = async () => {
      try {
         const user = await userService.loginWithCode(email.value, code.value)
         return user
      } catch(ignored) {
        setCode({...code, error: 'El código ingresado es incorrecto.'})
      }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reestablecer contraseña</Header>
      <TextInput
        label="Cuenta de E-mail"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Recibirás en tu cuenta de email la contraseña y un link para que puedas modificarla."
      />

    {code && 

  <TextInput
          label="Código de reset"
          returnKeyType="done"
          value={code.value}
          onChangeText={(text) => setCode({ value: text, error: '' })}
          error={!!code.error}
          errorText={code.error}
          autoCapitalize="none"
          description="Ingresa el código que recibiste por mail"
        />
    }


      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Enviar
      </Button>
    </Background>
  )
}
