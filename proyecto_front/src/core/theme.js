import { DefaultTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { colors } from 'react-native-elements'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000',
    primary: '#ff8c00',
    secondary: '#414757',
    error: '#f13a59',
    success: '#00B74A',
    blueAccent100: '#82B1FF',
    blueAccent700: '#2962FF',
    grey600: '#757575',
    grey200: '#EEEEEE',
    green50: '#E8F5E9 ',
    background: '#FBFBFB',
    white: '#FFFF',
    black: '#000',
    warning: '#FFA900'
  },
  SIZES: {
    BASE: 16,
    FONT: 16,
    OPACITY: 0.8,
  },

  styles: StyleSheet.create({
      m16: {
        marginTop: 16
      },
      m24: {
        marginTop: 24
      },
      m48: {
        marginTop: 48
      },
      link: {
        color: '#2962FF',
        fontSize: 16
      },
      notFoundText: {
         color: '#757575',
         fontSize: 24
      }
  })
}
