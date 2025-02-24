import { Text } from 'galio-framework';
import React, { useState } from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { theme } from '../core/theme';
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"


export default function BackButton({ goBack }) {
  const onGoBack = () => {
    console.log("back pressed")
    goBack()
  }

  // const [user, setUser] = useState({});
  // if(!user){
  //   setUser(LocalPhoneStorage.get(STORAGE_USER))
  // }
  const [user, setUser] = useState(() => LocalPhoneStorage.get(STORAGE_USER) || {});
    return (
    <TouchableOpacity onPress={onGoBack} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/arrow_back.png')}
      />
      <Text style={styles.header}>{user.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})
