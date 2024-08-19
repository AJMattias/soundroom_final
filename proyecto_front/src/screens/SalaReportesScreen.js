import { Picker } from "@react-native-picker/picker"
import { Block, Button, Icon, Text } from "galio-framework"
import React, { useEffect, useState } from "react"
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import {BarChart, PieChart} from 'react-native-chart-kit';
import { theme } from "../core/theme";
import { reportesService } from "../network/ReportesService";
import {Calendar, CalendarProps} from 'react-native-calendars';
import { formatDate } from '../utils/DateUtils'


//const screenWidth = Dimensions.get('window').width;
const screenWidth = 350
const height = 220
export function SalaReporteScreen({navigation}){

    const [tipoReporte, setTipoReporte] = useState([
        { id: 0, value: '', label: 'Elige tipo de Reporte' },
        { id: 1, value: 'cantidadReservasporMes', label: 'Cantidad de Reservas' },
        { id: 2, value: 'Valoraciones', label: 'Valoraciones' },
        { id: 3, value: 'DiamasReservado', label: 'Dia mas Reservado' },
        { id: 4, value: 'cancelacionesReserva', label: 'Cancelaciones de Reserva' },
    ])

    const currentDay = new Date()
    const [fechaI, setFechaI] = useState(Date)
    const [fechaH, setFechaH] = useState(new Date())
    const [openI, setOpenI] = useState(false)
    const [openH, setOpenH] = useState(false)
  
    const [mostrarFechaI, setMostrarFechaI] = useState(false)
    const [mostrarFechaH, setMostrarFechaH] = useState(false)
    const [reporte, setReporte] = useState( {
      labels: [],
      datasets: [
        {
          data: []
        }
      ]
    })

    const onDayPressI = (calendarDay) => {
    const dayI = new Date()
    dayI.setDate(calendarDay.day)
    dayI.setMonth(calendarDay.month -1)
    dayI.setFullYear(calendarDay.year)
    dayI.setHours(0, 0, 0)
    setFechaI(dayI);
    console.log(fechaI)
    setOpenI(false)
    setMostrarFechaI(true)
    }
    const onDayPressH = (calendarDay) => {
    const dayH = new Date()
    dayH.setDate(calendarDay.day)
    dayH.setMonth(calendarDay.month -1)
    dayH.setFullYear(calendarDay.year)
    dayH.setHours(0, 0, 0)
    setFechaH(dayH);
    console.log(fechaH)
    setOpenH(false)
    setMostrarFechaH(true)
    }

    const [selectedReporte, setSelectedReporte] = useState()
    const listReportes = tipoReporte.map((reporte) =>
        <Picker.Item key={reporte.id} label={reporte.label} value={reporte.value} />
    )

    return(

      <StateScreen>
        <Screen navigation={navigation}>
          <SafeAreaView>
            
          </SafeAreaView>
        </Screen>
      </StateScreen>
    )




}

const styles = StyleSheet
.create({
  container: {
    marginBottom: 20,
    justifyContent: "space-between"
  },
  titleContainer: {
    flex: 1,
    alignItems: 'left',
    flexDirection:'coulmn',
    marginTop: 16
  },
  descarga:{
    flexDirection:'row',
    alignItems: 'center'
  },
  subtitle: {
      fontWeight: 600,
      fontSize: theme.SIZES.FONT * 1.25,
      //direction: 'ltr',
      writingDirection:'ltr'
      //paddingRight: 150
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
  text: {
    fontSize: theme.SIZES.FONT,
    color: theme.colors.grey600,
  },
  linkReporte:{
    color: theme.colors.green50,
    fontSize: theme.SIZES.FONT,
    fontWeight:600,
  },
  icon:{
    marginLeft: 10
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  editText: {
    color: theme.colors.grey600,
    fontSize: theme.SIZES.FONT ,
    fontWeight:600,
    marginStart: 8
},
});

