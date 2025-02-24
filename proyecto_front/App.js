/* eslint-disable prettier/prettier */
import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { seed } from "./src/mock/Seeder"
import {
  EditRoom,
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  ModifyUserScreen,
  UserProfileScreen,
  UserProfileScreen2,
  RoomScreen,
  ArtistProfileScreen,
  ReserveRoomScreen,
  CardPaymentScreen,
  ReservationsScreen,
  SearchScreen,
  AdminStartScreen,
  AbmPerfilesScreen,
  CreatePerfilScreen,
  CreatePerfilScreen2,
  CreateRoom,
  BackupBD,
  CreatePerfilPermisoScreen,
  ProfileListScreen,
  ProfileScreen,
  ProfileScreen2,
  AdminComision,
  CreateComisionScreen,
  DeleteComisionesScreen,
  GestionUsuariosScreen,
  GestionUserScreen,
  AdminSoundRoomReportes,
  AdminSalaReportes,
  OrdersScreen,
  AbmPermisos,
  CreatePermisosScreen,
  PermisosListScreen,
  EditarPermisoScreen,
  ConsultComisionScreen,
  EditUserScreen,
} from './src/screens'
// import CreatePerfilScreen from './src/screens/CreatePerfilScreen'
// import AdminStartScreen from './src/screens/AdminStartScreen'
// import AbmPerfilesScreen from './src/screens/AbmPerfilesScreen'
// import CreatePerfilScreen2 from './src/screens/CreatePerfilScreen2'
// import Reportes from './src/screens/AdminSoundRoomReportes'
// import CreatePerfilPermisoScreen from './src/screens/CreatePerfilPermisoScreen'

import {Navigation} from "./src/components/index"
import { CalendarScreen } from './src/screens/CalendarScreen'
import { SalaReporteScreen } from './src/screens/SalaReportesScreen'
import PasswordChangeScreen from './src/screens/PasswordChangeScreen'


const Stack = createStackNavigator()

export default function App() {


  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
          <Stack.Screen name="ModifyUserScreen" component={ModifyUserScreen} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="UserProfileScreen2" component={UserProfileScreen2} />
          <Stack.Screen name = "RoomScreen" component={RoomScreen}/>
          <Stack.Screen name = "ArtistProfileScreen" component = {ArtistProfileScreen} />
          <Stack.Screen name  = "ReserveRoomScreen" component = {ReserveRoomScreen} />
          <Stack.Screen name  = "CardPaymentScreen" component = {CardPaymentScreen}/>
          <Stack.Screen name = "ReservationsScreen" component = {ReservationsScreen} />
          <Stack.Screen name = "SearchScreen" component = {SearchScreen}/>
          <Stack.Screen name = "AdminStartScreen" component = {AdminStartScreen} />
          <Stack.Screen name = "AbmPerfilesScreen" component = {AbmPerfilesScreen} />
          <Stack.Screen name = "CreatePerfilScreen2" component = {CreatePerfilScreen2} />
          <Stack.Screen name = "CreatePerfilScreen" component = {CreatePerfilScreen} />
          <Stack.Screen name="CreateRoom" component={CreateRoom} />
          <Stack.Screen name="BackupBD" component={BackupBD} />
          <Stack.Screen name = "CreatePerfilPermisoScreen" component = {CreatePerfilPermisoScreen} />
          <Stack.Screen name = "ProfileListScreen" component = {ProfileListScreen} />
          <Stack.Screen name = "ProfileScreen" component = {ProfileScreen}
          options={({ route }) => ({ title: "Javier - Admin" })} />
          <Stack.Screen name = "ProfileScreen2" component = {ProfileScreen2}/>
          <Stack.Screen name = "AdminComision" component = {AdminComision}/>
          <Stack.Screen name = "CreateComisionScreen" component = {CreateComisionScreen}/>
          <Stack.Screen name = "DeleteComisionesScreen" component= { DeleteComisionesScreen }/>
          <Stack.Screen name = "EditRoom" component = {EditRoom} />
          <Stack.Screen name = "GestionUsuariosScreen" component = {GestionUsuariosScreen} />
          <Stack.Screen name = "GestionUserScreen" component = {GestionUserScreen} />
          <Stack.Screen name = "AdminSoundRoomReportes" component = {AdminSoundRoomReportes} />
          <Stack.Screen name = "AdminSalaReportes" component = {AdminSalaReportes} />
          <Stack.Screen name = "OrdersScreen" component = {OrdersScreen} />
          <Stack.Screen name = "AbmPermisos" component = {AbmPermisos} />
          <Stack.Screen name = "CreatePermisosScreen" component = {CreatePermisosScreen} />
          <Stack.Screen name = "PermisosListScreen" component = {PermisosListScreen} />
          <Stack.Screen name = "EditarPermisoScreen" component = {EditarPermisoScreen} />
          <Stack.Screen name = "ConsultComisionScreen" component = {ConsultComisionScreen} />
          <Stack.Screen name = "CalendarScreen" component = {CalendarScreen} />
          <Stack.Screen name = "EditUserScreen" component = {EditUserScreen} />
          <Stack.Screen name = "SalaReporteScreen" component = {SalaReporteScreen} />
          <Stack.Screen name = "PasswordChangeScreen" component={PasswordChangeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Navigation/> */}
    </Provider>
  )
}


