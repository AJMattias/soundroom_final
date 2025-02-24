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
  const [error, setError] = useState('')
  const [existsError, setExistsError] = useState(false)
  const [password, setPassword] = useState({value:'', error:''})
  const [password2, setPassword2] = useState({value:'', error:''})
  const [newPassword, setNewPassword] = useState(false)
const [setshowPasswordReset, setSetshowPasswordReset] = useState(false)

  // const sendResetPasswordEmail = () => {
  //   const emailError = emailValidator(email.value)
  //   if (emailError) {
  //     setEmail({ ...email, error: emailError })
  //     return
  //   }
  //   if(code) {
  //     loginWithCode().then(
  //       setTimeout(() =>  {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'UserProfileScreen2' }],
  //         })
  //       }, 1000)
       
  //     )
  //   } else {
  //      createCode().then()
  //   }
  // }

  // const loginWithCode = async () => {
  //   try {
  //      const user = await userService.loginWithCode(email.value, code.value)
  //      return user
  //   } catch(ignored) {
  //     setCode({...code, error: 'El código ingresado es incorrecto.'})
  //   }
  // }

  //version chatgpt: 
  const sendResetPasswordEmail = () => {
  const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    //si tengo codigo para volver entrar a la app
    if (code) {
      loginWithCode().then((user) => {
        if (user) { // Verificamos si el usuario fue devuelto
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserProfileScreen2' }],
            });
          }, 1000);
        }
      });
    } else {
      // quiero pedir el codigo para entrar a la app
      createCode().then();
    }
  };

  const sendLinkRequest = async () =>{
    const responseResetPassword = await userService.resetPassword(email.value)
    //if(responseResetPassword){
      //setSetshowPasswordReset(true)
      //setNewPassword(true)
    //}
  }

  const changePassword = async () =>{
    const changePassword = await userService.resetPassword(email.value)
    if(changePassword){
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserProfileScreen2' }],
      });
    }
  }

  

  const loginWithCode = async () => {
    try {
      const user = await userService.loginWithCode(email.value, code.value);
      if(user.msg){
        setError(user.msg)
        setExistsError(true)
      }
      return user; // Retornamos el usuario si la autenticación es correcta
    } catch (ignored) {
      setCode({ ...code, error: 'El código ingresado es incorrecto.' });
      return null; // Retornamos null si hay un error
    }
  };

  //funcion para pedir codigo al back
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

    {/* {newPassword &&
    <>
       <TextInput
        label="Nueva Contraseña"
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
      <Button
        mode="contained"
        onPress={changePassword}
        style={{ marginTop: 16 }}
      > Cambiar Contraseña
      </Button>
    </>
    } */}



      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Enviar Codigo
      </Button>

      <Button
        mode="contained"
        onPress={sendLinkRequest}
        style={{ marginTop: 16 }}
      >
        Enviar Link
      </Button>
    </Background>
  )
}
