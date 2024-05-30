/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"


export default function Header(props) {
const [user, setUser] = useState({});

if(!user){
  setUser(LocalPhoneStorage.get(STORAGE_USER))
}

  return <Text style={styles.header} {...props}>{user.name}</Text>
}

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})
