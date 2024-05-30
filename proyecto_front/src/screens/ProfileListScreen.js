import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlightBase,
  TouchableOpacityBase,
} from 'react-native'
import { StateScreen } from '../components/StateScreen'
import { Block, Card, Text } from 'galio-framework'
import { perfilesService } from '../network/perfilesService'
import { FlatList } from 'react-native-gesture-handler'
import { theme } from '../core/theme'
import { Screen } from '../components/Screen'

export function ProfileListScreen({ navigation }) {
  const [perfiles, setPerfiles] = useState([])
  const [perfilesFetched, setPerfilesFetched] = useState(false)

  const fetchPerfiles = async () => {
    const perfiles1 = await perfilesService.getPerfiles()
    setPerfiles(perfiles1)
    setPerfilesFetched(true)
    console.log(perfiles)
  }

  useEffect(() => {
    if (!perfilesFetched) {
      fetchPerfiles()
    }
  })

  const handlerOnPress = (perfil) => {
    console.log(perfil)
    navigation.navigate('ProfileScreen2', { perfilId: perfil.id })
  }

  const renderPerfiles = () => {
    if (perfiles && perfiles.length > 0) {
      return (
        <View>
          <Block style={styles.perfilesContainer}>
            {perfiles.map((perfil) => (
              <Block
                shadow
                style={styles.container}
                onClick={() =>
                  handlerOnPress(perfil)
                }
              >
                <Block row style={{ alignItems: 'center' }}>
                  <Text style={styles.list}>{perfil.name}</Text>
                </Block>
              </Block>

            ))}
          </Block>
        </View>
      )
    }
  }



  return (
    <StateScreen loading={!perfilesFetched}>
      <Screen navigation={navigation}>
        <ScrollView>
          <Text style={styles.title}>Lista de Perfiles</Text>
          {renderPerfiles()}
        </ScrollView>
      </Screen>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.SIZES.FONT + 1.25,
    fontWeight: 600,
    marginBottom: 24,
  },
  perfilesContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 24,
  },
  item: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  list: {
    fontSize: theme.SIZES.FONT,
    fontWeight: 600,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
})
