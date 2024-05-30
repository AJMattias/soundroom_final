import React from "react"
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import { SafeAreaView } from "react-native-safe-area-context";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";

const screenWidth = Dimensions.get('window').width;
const height = 220


export default function SalaEnsayoReportes({ navigation }){

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: '#fff',
        backgroundGradientToOpacity: 0.5,
    
        fillShadowGradientOpacity: 1,
        color: (opacity = 1) => `#ff8c00`,
        labelColor: (opacity = 1) => `#333`,
        strokeWidth: 2,
    
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
      };

      const cantReservasMes = {
        labels: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
        datasets: [
          {
            data: [15, 17, 8, 10, 13, 16]
          }
        ]
      };

      const Valoraciones = {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            data: [2, 4, 7, 10, 12, 10]
          }
        ]
      };

      const grafTortaDiaReserva = [
        { name: 'Lunes', population: 3, color: '#ff8c00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Martes', population: 4, color: '#9B5600', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Miercoles', population: 5, color: '#241CEC', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Jueves', population: 6, color: '#B60000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Viernes', population: 7, color: '#FFC000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Sabado', population: 8, color: '#006D6D', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Domingo', population: 11, color: '#EB4300', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      ]
      
      return (
        <StateScreen>
          <Screen navigation={navigation}>
            <SafeAreaView>
              <View style={styles.container}>
                <Text style={styles.title}>Reportes de Sala de Ensayo</Text>
                <View style={styles.titleContainer}>
                  <Text style={styles.subtitle}>Cantidad Resrvas</Text>
                </View>
                <BarChart
                  data={usuraiosNuevos}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  showBarTops={true}
                  style={styles.graphStyle}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.subtitle}>Valoraciones</Text>
                </View>
                <BarChart
                  data={artistasNuevos}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  showBarTops={true}
                />                
                <Text style={styles.subtitle}>Reservas por dia</Text>
                <PieChart
                  data={grafTortaDiaReserva}
                  height={height}
                  width={screenWidth}
                  chartConfig={chartConfigPie}
                  accessor="population"
                  style={chartConfigPie}
                  />
                
                
              </View>
            </SafeAreaView>
          </Screen>
        </StateScreen>
      )

}
const chartConfigPie = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};
const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    subtitle: {
        fontWeight: 600,
        fontSize: theme.SIZES.FONT * 1.25
    },
    title: {
        fontSize: theme.SIZES.FONT * 1.5,
        fontWeight: 600,
        marginBottom: 24
    },
     graphStyle: {
      marginVertical: 8,
      backgroundColor: '#ffffff'
     },
    labelStyle: {
      marginVertical: 10,
      textAlign: 'center',
      fontSize: 16,
      fontStyle: 'normal' | 'italic' | undefined,
    },
    // chartContainer: {
    //   flex: 1,
    // },
    // legendContainer: {
    //   flex: 1,
    //   marginTop: 20,
    // },
  });
