/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react'
// import { NavigationContainer } from '@react-navigation/native'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import Dashboard  from './Dashboard'
import { seed } from '../mock/Seeder'
import { StateScreen } from '../components/StateScreen'
import { getNewPasswordStatus, initNewPasswordStatus, setPasswordChangeFalse, setPasswordChangeTrue } from '../storage/LocalStorage'
import { useRoute } from '@react-navigation/native'


// const Tab = createBottomTabNavigator()

export default function StartScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)

  //buscar en localhost reset password, if true, navigate to screen
  const [navigatePasswordChange, setNavigatePasswordChange] = useState(false) 
  const passwordStatus = getNewPasswordStatus()
  console.log('passwordStatus.changePassword: ', passwordStatus.changePassword)
  // console.log(passwordStatus)
  // setNavigatePasswordChange(passwordStatus)
  // if(navigatePasswordChange){
  //   navigation.navigate('PasswordChangeScreen')
  // }

  const route = useRoute();

  // useEffect(() => {
  //   // Al iniciar la app, aseguramos que new_password sea false
  //   initNewPasswordStatus();

  //   // Verificar si la URL tiene un token para resetear la contraseña
  //   console.log('route?.params?.token: ', route?.params?.token)
  //   if (route?.params?.token) {
  //     console.log('ruta, params, token: ', route)
  //     console.log('params: ', route?.params)
  //     console.log('token: ', route?.params?.token)
  //     setPasswordChangeTrue();
  //     navigation.navigate('ResetPasswordScreen', { token: route.params.token });
  //   }
  // }, [route]);

  useEffect(() => {
    // Al iniciar la app, aseguramos que new_password sea false, solo si newPasswordStatus es false.
    if (!passwordStatus.started) {
        initNewPasswordStatus();
    }

    // Verificar si newPasswordStatus es true para resetear la contraseña
    if (passwordStatus.newPasswordStatus) {
        console.log('Navegando a ResetPasswordScreen');
        navigation.navigate('PasswordChangeScreen', { token: route?.params?.token });
    }
}, [navigation, passwordStatus, route?.params?.token]);


  // useEffect(() => {
  //   // Al iniciar la app, setear STORAGE_NEWPASSWORD en false
  //   toggleNewPassword();
  // }, []); // Se ejecuta solo al montar el componente
  // useEffect(() => {
  //   const passwordStatus = getNewPasswordStatus();
  //   console.log(passwordStatus);
  //   setNavigatePasswordChange(passwordStatus);
  // }, []); // Se ejecuta solo una vez al montar el componente

  // useEffect(() => {
  //   if (navigatePasswordChange) {
  //     navigation.navigate('PasswordChangeScreen');
  //   }
  // }, [navigatePasswordChange]); // Se ejecuta cuando `navigatePasswordChange` cambie

  // const seedData = async() =>{
  //   //await seed()
  //   setIsLoading(false)
  // }

  // seedData().then()

  return (
    <StateScreen loading = {isLoading}>
    <Background>
      <Logo />
      <Header>SoundRoom</Header>
      <Paragraph>
        Bienvenidos a la nueva forma de reservar salas de ensayo.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Registrarse
      </Button>
    
    </Background>
    </StateScreen>
  )
}
