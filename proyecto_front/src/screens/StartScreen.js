/* eslint-disable prettier/prettier */
import React, {useState} from 'react'
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

// const Tab = createBottomTabNavigator()

export default function StartScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)

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
