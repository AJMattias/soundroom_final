/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native-paper';
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'


const Tab = createBottomTabNavigator()
const tab_icon ={
    Perfil: "grid",
    Reservas: "calendar",

}

// const Perfil =() => <Text>Mi Perfil</Text>
// const Reservas = () => <Text>Reservas</Text>

const createScreenOptions= ({route}) => {
    const iconName = tab_icon[route.name];
    return{
        tabBarIcon: ({size, color}) => (
            <Ionicons name={iconName} size={size} color={color} />
        ),
        tabBarActiveTintColor: '#C7364B',
        tabBarInactiveTintColor: '#C7364B',
    }
}

export default function TabButton() {
  return (
    <NavigationContainer independent>
      <Tab.Navigator
      screenOptions={createScreenOptions}
      >
        <Tab.Screen name="Perfil" component={LoginScreen} />
        <Tab.Screen name="Reservas" component={RegisterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
