/* eslint-disable prettier/prettier */
import React from 'react'
// import { NavigationContainer} from '@react-navigation/native'
// eslint-disable-next-line import/no-cycle
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabButton from '../components/TabButton'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
// eslint-disable-next-line import/no-cycle
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import { Navigation } from '../components';

const Tab = createBottomTabNavigator();

// function MyTabs(){
//   return(
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Perfil" component={LoginScreen}/>
//         <Tab.Screen name="Reservas" component={RegisterScreen}/>
//       </Tab.Navigator>

//     </NavigationContainer>
//   )
// }
export default function Dashboard({ navigation }) {
  return (
    <><Background>
      <Logo />
      <Header>¡Hola Zahira!</Header>
      <Paragraph>
        Acá estarán las salas de ensayo.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'StartScreen' }],
        })}
      >
        Salir
      </Button>
      <Navigation/>
      {/* <Tab.Navigator>
          <Tab.Screen name="Perfil" component={LoginScreen} />
          <Tab.Screen name="Reservas" component={RegisterScreen} />
        </Tab.Navigator> */}
    </Background>

    <TabButton/>
</>
  )
}
