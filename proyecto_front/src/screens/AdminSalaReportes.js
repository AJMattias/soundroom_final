import { Picker } from '@react-native-picker/picker'
import { Block, Button, Icon, Text } from 'galio-framework'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Screen } from '../components/Screen'
import { StateScreen } from '../components/StateScreen'
import { BarChart, PieChart } from 'react-native-chart-kit'
import { theme } from '../core/theme'
import { reportesService } from '../network/ReportesService'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { formatDate } from '../utils/DateUtils'
import ViewShot from 'react-native-view-shot'
import { PDFDocument, PDFPage  } from 'react-native-pdf-lib';
import { LocalPhoneStorage, STORAGE_USER, STORAGE_JWT_KEY } from '../storage/LocalStorage'
import { roomService } from '../network/RoomService'
import { formatFecha as formatFecha2} from '../helpers/dateHelper'

//const screenWidth = Dimensions.get('window').width
const screenWidth = 350
const height = 220

export function AdminSalaReportes({ navigation }) {
  // variables for capture a download
  const viewShotRef = useRef()
  const [pdfData, setPdfData] = useState(null);

  //USER LOGGED
  const user = LocalPhoneStorage.get(STORAGE_USER)
  const [roomsFetched, setRoomsFetched] = useState(false)
  const [textRoomsNotFetched, setTextRoomsNotFetched] = useState({
    value: 'No tiene salas aun',
  })
  const [tipoReporte, setTipoReporte] = useState([
    { id: 0, value: '', label: 'Elige tipo de Reporte' },
    { id: 1, value: 'cantidadReservasporMes', label: 'Cantidad de Reservas' },
    { id: 2, value: 'Valoraciones', label: 'Valoraciones' },
    { id: 3, value: 'DiamasReservado', label: 'Dia mas Reservado' },
    { id: 4, value: 'cancelacionesReserva', label: 'Cancelaciones de Reserva' },
  ])
  const [ownerRooms, setOwnerRooms] = useState([
    { id: 0, value: '', label: 'Elige una Sala' },
  ])
  const [rooms, setRooms] = useState()

  
  const currentDay = new Date()
  const [fechaI, setFechaI] = useState(Date)
  const [fechaH, setFechaH] = useState(new Date())
  const [openI, setOpenI] = useState(false)
  const [openH, setOpenH] = useState(false)

  const [mostrarFechaI, setMostrarFechaI] = useState(false)
  const [mostrarFechaH, setMostrarFechaH] = useState(false)
  const [mostrarReporte, setMostrarReporte] = useState(false)
  const [mostrarValoraciones, setMostrarValoraciones] = useState(false)
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
    dayI.setMonth(calendarDay.month - 1)
    dayI.setFullYear(calendarDay.year)
    dayI.setHours(0, 0, 0)
    setFechaI(dayI)
    console.log(fechaI)
    setOpenI(false)
    setMostrarFechaI(true)
  }
  const onDayPressH = (calendarDay) => {
    const dayH = new Date()
    dayH.setDate(calendarDay.day)
    dayH.setMonth(calendarDay.month - 1)
    dayH.setFullYear(calendarDay.year)
    dayH.setHours(0, 0, 0)
    setFechaH(dayH)
    console.log(fechaH)
    setOpenH(false)
    setMostrarFechaH(true)
  }

  const [selectedReporte, setSelectedReporte] = useState()
  const [selectedSala, setSelectedSala] = useState()
 

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
  }

  const chartConfigPie = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  }

  const cantidadReservasporMes = {
    labels: ['Dic', 'En', 'Feb', 'Mar', 'Abr', 'Mayo'],
    datasets: [
      {
        data: [7, 10, 12, 11, 9, 12],
      },
    ],
  }

  //No se usa selectDay
  const selectDay = (calendarDay) => {
    console.log('selecting date')
    console.log(calendarDay)
    const day = new Date()
    day.setDate(calendarDay.day)
    day.setMonth(calendarDay.month - 1)
    day.setFullYear(calendarDay.year)
    setSelectedDay(day)
    onDaySelected(day)
  }

  const title = { name: 'Usuarios Nuevos' }

  // A Borrar
  const captureScreen = async () => {
    try {
      const captureURI = await viewShotRef.current.capture();
      const pdfDoc = PDFDocument.create();
      const page = pdfDoc.addPages();
      const jpgImageBytes = `data:image/jpeg;base64,${captureURI}`;
      const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
      const pdfBytes = await pdfDoc.save();
      setPdfData(pdfBytes);
    } catch (error) {
      console.error('Error capturing screen: ', error);
    }
  }

  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = await pdfDoc.addPage();
      page.drawText('¡Hola! Esta es una captura de pantalla.', {
        x: 50,
        y: 500,
        fontSize: 24,
      });
      const pdfBytes = await pdfDoc.save();
      setPdfData(pdfBytes);
    } catch (error) {
      console.error('Error generating PDF: ', error);
    }
  };

  const downloadPDF = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'captura.pdf';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  //Hasta aca borrar

  const descargarReporte = async () => {
    //TODO: Crear el rporte y llamar a la url para verlo
    captureScreen().then()
    downloadPDF()
  }

  const formatFecha = (date) => {
    return `${date.getDate()} del ${date.getMonth() + 1} ${date.getFullYear()}`
  }

  const getReportes = async () => {
    switch (selectedReporte) {
      case "cantidadReservasporMes":
        cantidadSalaReservas();
        break;
      case "Valoraciones":
        valoraciones();
        break;
      case "DiamasReservado":
        diamasvalorado();
        break;
      case "cancelacionesReserva":
        cantidadCanceledSalaReservas();
        break;
      default:
        console.log("No report selected");
    }
  }
  const descargarReportes = async () => {
    switch (selectedReporte) {
      case "cantidadReservasporMes":
        descargarReporteCantidadSalaReservas();
        break;
      case "Valoraciones":
        descargarReporteValoraciones();
        break;
      case "DiamasReservado":
        descargarReporteDiamasvalorado();
        break;
      case "cancelacionesReserva":
        descargarReporteCantidadCanceledSalaReservas();
        break;
      default:
        console.log("No report selected");
    }
  }

  const cantidadSalaReservas = async () => {
    setMostrarValoraciones(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.cantidadSalaReservas(selectedSala, fechaI, fechaH);
    
    //setear reporte con labesl y data
    // const labels = response.map(item => item.mes);
    // const data = response.map(item => item.cantidad);
    console.log(response)
    setReporte(response)
    setMostrarReporte(true)
      // setReporte({
      //   labels: labels,
      //   datasets: [
      //     {
      //       data: data
      //     }
      //   ]
      // });
    console.log('response cantidad reserva por sala: ', response)
    //response ? setMostrarReporte(true) : console.log('esperando respuesta servidor')
    return;
  }

  //descargar Tipo Sala:
  const descargarReporteCantidadSalaReservas = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/reservations/descargarReporteReservationsPorSalaMes", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa,
          idRoom: selectedSala
      })
    })

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    // Obtén el nombre del archivo desde el encabezado Content-Disposition
    const disposition = response.headers.get('content-disposition');
    const currentDatee = new Date()
    const currenDay = currentDatee.getDate()
    const currenMonth = currentDatee.getMonth()
    const currenYear = currentDatee.getFullYear()
    const currenHour = currentDatee.getTime()

    const rutaPdf2 = `reporte_${currenDay}${currenMonth}${currenYear}${currenHour}.pdf`
    let fileName = `${rutaPdf2}`; // Nombre predeterminado

    if (disposition) {
        const fileNameMatch = disposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
            fileName = fileNameMatch[1];
        }
    }

    // Lee la respuesta como Blob
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Usa el nombre del archivo
    document.body.appendChild(link); // Asegúrate de que el enlace esté en el DOM
    link.click();
    document.body.removeChild(link); // Elimina el enlace después de hacer clic

    // Libera el objeto URL después de la descarga
    URL.revokeObjectURL(url);

    return;
  }

  const cantidadCanceledSalaReservas = async () => {
    setMostrarValoraciones(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.cantidadCanceledSalaReservas(selectedSala, fechaI, fechaH);
    setReporte(response)
    if(reporte.labels){
    setMostrarReporte(true)}
    //setear reporte con labesl y data
    // const labels = response.map(item => item.mes);
    // const data = response.map(item => item.cantidad);
      
      // setReporte({
      //   labels: labels,
      //   datasets: [
      //     {
      //       data: data
      //     }
      //   ]
      // });
    console.log('reporte nuevos artistas, response: ', reporte, response);
    return data;
  }
  
  //descargar canticad reservas canceladas
  //descargar Tipo Sala:
  const descargarReporteCantidadCanceledSalaReservas = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/reservations/descargarReservationsCanceladasPorSalaMes", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa,
          idRoom: selectedSala
      })
    })

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    // Obtén el nombre del archivo desde el encabezado Content-Disposition
    const disposition = response.headers.get('content-disposition');
    const currentDatee = new Date()
    const currenDay = currentDatee.getDate()
    const currenMonth = currentDatee.getMonth()
    const currenYear = currentDatee.getFullYear()
    const currenHour = currentDatee.getTime()

    const rutaPdf2 = `reporte_${currenDay}${currenMonth}${currenYear}${currenHour}.pdf`
    let fileName = `${rutaPdf2}`; // Nombre predeterminado

    if (disposition) {
        const fileNameMatch = disposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
            fileName = fileNameMatch[1];
        }
    }

    // Lee la respuesta como Blob
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Crea un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Usa el nombre del archivo
    document.body.appendChild(link); // Asegúrate de que el enlace esté en el DOM
    link.click();
    document.body.removeChild(link); // Elimina el enlace después de hacer clic

    // Libera el objeto URL después de la descarga
    URL.revokeObjectURL(url);

    return;
  }
  const valoraciones = async () => {
    console.log("onpressed ver reporte")
    setMostrarReporte(false)
    const response = await reportesService.valoraciones(selectedSala);
    setReporte(response)
    // //setear reporte con labesl y data
    // const labels = response.map(item => item.mes);
    // const data = response.map(item => item.cantidad);
      
    //   setReporte({
    //     labels: labels,
    //     datasets: [
    //       {
    //         data: data
    //       }
    //     ]
    //   });
    setMostrarValoraciones(true)
    console.log('reporte nuevos artistas, response: ', reporte, response);
    return ;
  }


    //descargar Valoraciones sala:
    const descargarReporteValoraciones = async() =>{

      const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
      let fechaIn = formatFecha2(fechaI)
      let fechaHa = formatFecha2(fechaH)
      
      // console.log('fechaI: ', fechaIn)
      // console.log('fechaH: ', fechaHa)
      // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
      // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);
  
      const response = await fetch("http://localhost:3000/salasdeensayo/descargarCantidadVaoraciones/?idRoom="+selectedSala, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
            'Accept': 'application/pdf' // Espera una respuesta PDF
        },
        // body: JSON.stringify({
        //     fechaI: fechaIn,
        //     fechaH: fechaHa
        // })
      })
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      // Obtén el nombre del archivo desde el encabezado Content-Disposition
      const disposition = response.headers.get('content-disposition');
      const currentDatee = new Date()
      const currenDay = currentDatee.getDate()
      const currenMonth = currentDatee.getMonth()
      const currenYear = currentDatee.getFullYear()
      const currenHour = currentDatee.getTime()
  
      const rutaPdf2 = `reporte_${currenDay}${currenMonth}${currenYear}${currenHour}.pdf`
      let fileName = `${rutaPdf2}`; // Nombre predeterminado
  
      if (disposition) {
          const fileNameMatch = disposition.match(/filename="(.+)"/);
          if (fileNameMatch) {
              fileName = fileNameMatch[1];
          }
      }
  
      // Lee la respuesta como Blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      // Crea un enlace para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Usa el nombre del archivo
      document.body.appendChild(link); // Asegúrate de que el enlace esté en el DOM
      link.click();
      document.body.removeChild(link); // Elimina el enlace después de hacer clic
  
      // Libera el objeto URL después de la descarga
      URL.revokeObjectURL(url);
  
      return;
    }


    //descargar dia mas valorado
    const descargarReporteDiamasvalorado = async() =>{

      const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
      let fechaIn = formatFecha2(fechaI)
      let fechaHa = formatFecha2(fechaH)
      
      // console.log('fechaI: ', fechaIn)
      // console.log('fechaH: ', fechaHa)
      // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
      // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);
  
      const response = await fetch("http://localhost:3000/reservations/descargarReporteCantidadReservasPorDia/?idRoom="+selectedSala, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
            'Accept': 'application/pdf' // Espera una respuesta PDF
        },
        // body: JSON.stringify({
        //     fechaI: fechaIn,
        //     fechaH: fechaHa
        // })
      })
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      // Obtén el nombre del archivo desde el encabezado Content-Disposition
      const disposition = response.headers.get('content-disposition');
      const currentDatee = new Date()
      const currenDay = currentDatee.getDate()
      const currenMonth = currentDatee.getMonth()
      const currenYear = currentDatee.getFullYear()
      const currenHour = currentDatee.getTime()
  
      const rutaPdf2 = `reporte_${currenDay}${currenMonth}${currenYear}${currenHour}.pdf`
      let fileName = `${rutaPdf2}`; // Nombre predeterminado
  
      if (disposition) {
          const fileNameMatch = disposition.match(/filename="(.+)"/);
          if (fileNameMatch) {
              fileName = fileNameMatch[1];
          }
      }
  
      // Lee la respuesta como Blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      // Crea un enlace para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Usa el nombre del archivo
      document.body.appendChild(link); // Asegúrate de que el enlace esté en el DOM
      link.click();
      document.body.removeChild(link); // Elimina el enlace después de hacer clic
  
      // Libera el objeto URL después de la descarga
      URL.revokeObjectURL(url);
  
      return;
    }


  const diamasvalorado = async () => {
    setMostrarReporte(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.cantidadPorDia(selectedSala);
    setReporte(response)
    if(reporte.labels){
      setMostrarValoraciones(true)}
    
    console.log('reporte nuevos artistas, response: ', reporte, response);
    return };
  

  const fetchRooms = async () =>{
    // const response = await roomService.getMyRoomsBd(user.id)
    // response.map(room=>{
    //   ownerRooms.push({id: room.id, label: room.nameSalaEnsayo, value: room.id})
    // })
    // console.log(ownerRooms)
    // setRoomsFetched(true)
    try {
      const response = await roomService.getMyRoomsBd(user.id);
      if (response && response.length > 0) {
        const rooms = response.map(room => ({
          id: room.id,
          label: room.nameSalaEnsayo,
          value: room.id,
        }));
        setOwnerRooms(prevRooms => [...prevRooms, ...rooms]);
      } else {
        setOwnerRooms([{ id: 0, value: '', label: 'No tiene salas aún' }]);
      }
      setRoomsFetched(true);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setOwnerRooms([{ id: 0, value: '', label: 'Error al obtener salas' }]);
      setRoomsFetched(true);
    }
  }

  const salaPicker = ownerRooms.map((sala) =>
    <Picker.Item key={sala.id} label={sala.label} value={sala.id} />
  );

  const listReportes = tipoReporte.map((reporte) => (
    <Picker.Item key={reporte.id} label={reporte.label} value={reporte.value} />
  ))


  useEffect(() => {
    // setFechaI(undefined)
    // setFechaH(undefined)
    console.log('ownerRooms: ', ownerRooms)
    setMostrarFechaI(false)
    setMostrarFechaH(false)
    fetchRooms().then()
    console.log('ownerRooms after Fetched: ', ownerRooms)
  }, [])

  return (
    <StateScreen loading={!roomsFetched}>
      <Screen navigation={navigation}>
        <SafeAreaView>
          <View style={styles.container}>
            <Text style={styles.title}>Reportes de Salas de Ensayo</Text>
            <View>
              <Text style={styles.subtitle}>Elige un tipo de Reporte</Text>
              <Picker
                style={styles.container}
                //selectedValue={"Elige un Reporte"}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue)
                  setSelectedReporte(itemValue)
                  console.log(selectedReporte)
                }}
              >
                {listReportes}
              </Picker>
            </View>
            <Text style={styles.subtitle}>
              Elige una sala para ver sus reportes
            </Text>
            <View>
              <Picker
                style={styles.container}
                //selectedValue={"Elige un Reporte"}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue)
                  setSelectedSala(itemValue)
                  console.log(selectedSala)
                }}
              >
                {salaPicker}
              </Picker>
            </View>
            <View>
              <Text style={styles.text}>Selecciona rango de fechas</Text>
              <TouchableOpacity onPress={() => setOpenI(!openI)}>
                <Text style={styles.link}>
                  Fecha Desde:
                  {mostrarFechaI == true && <Text> {formatFecha(fechaI)}</Text>}
                </Text>
              </TouchableOpacity>
              {openI == true && (
                <Calendar
                  //testID={testIDs.calendars.FIRST}
                  hideArrows={false}
                  enableSwipeMonths
                  current={currentDay}
                  style={styles.calendar}
                  onDayPress={onDayPressI} 
                  arrowStyle={{ backgroundColor: '#007bff', color: '#808080' }}
                  maxDate ={fechaH || currentDay}
                  markedDates={{
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'orange',
                    selectedTextColor: 'red',
                  }}
                />
              )}
              <TouchableOpacity onPress={() => setOpenH(!openH)}>
                <Text style={styles.link}>
                  Fecha Hasta:
                  {mostrarFechaH == true && <Text> {formatFecha(fechaH)}</Text>}
                </Text>
              </TouchableOpacity>
              {openH == true && (
                <Calendar
                  //testID={testIDs.calendars.FIRST}
                  enableSwipeMonths
                  current={currentDay}
                  minDate={fechaI || new Date()}
                  maxDate ={currentDay}
                  arrowStyle={{ backgroundColor: '#007bff', color: '#808080' }}
                  style={styles.calendar}
                  onDayPress={onDayPressH}
                  markedDates={{
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'orange',
                    selectedTextColor: 'red',
                  }}
                />
              )}
            </View>
            <Button color="warning" size="small" onPress={() => getReportes()}>
              Ver Reporte
            </Button>
            <Button color="warning" size="small" onPress={() => descargarReportes()}>
              Descargar
            </Button>
            {/* <TouchableOpacity>
               <Text style={styles.linkReporte}> VER REPORTE</Text>
             </TouchableOpacity> */}
            {/* <Text style={styles.subtitle}>No hay datos para el reporte</Text> */}
            
            {/* Reportes  para todos los reportes, segun el seleccionado se muestra */}
            {/* {selectedReporte && mostrarFechaI && mostrarFechaH && 
               <> <View style={styles.titleContainer}>
                  <Text style={styles.subtitle}>{selectedReporte.value}</Text>
                  <Block style={styles.descarga}>
                    <Icon style={styles.icon} name="download" family="AntDesign" color={theme.colors.green50} size={24} />
                    <Text style={styles.editText}>Descargar</Text>
                  </Block>
                </View>
                <BarChart
                    data={reporte}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    showBarTops={true}
                    style={styles.graphStyle} /></>
             } */}
            {/* reportes mockeados */}
            {selectedReporte && selectedSala && 
            // mostrarFechaI && mostrarFechaH &&
             mostrarReporte && (
              <>
                <View style={styles.titleContainer}>
                  <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
                    <Text style={styles.subtitle}>{selectedReporte.value}</Text>
                    <Block style={styles.descarga}>
                      
                      {/* descargar reporte */}
                      <Icon
                        style={styles.icon}
                        name="download"
                        family="AntDesign"
                        color={theme.colors.green50}
                        size={24}
                      />
                    </Block>
                    {/* grafico de barras */}
                    <BarChart
                      data={reporte}
                      width={screenWidth}
                      height={220}
                      chartConfig={chartConfig}
                      showBarTops={true}
                      style={styles.graphStyle}
                    />
                  </ViewShot>
                
                </View>
              </>
            )}
           {selectedReporte && selectedSala && mostrarValoraciones && (
              <>
                <View style={styles.titleContainer}>
                  <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
                    <Text style={styles.subtitle}>{selectedReporte.value}</Text>
                    <Block style={styles.descarga}>
                      
                      {/* descargar reporte */}
                      <Icon
                        style={styles.icon}
                        name="download"
                        family="AntDesign"
                        color={theme.colors.green50}
                        size={24}
                      />
                    </Block>
                    {/* grafico de barras */}
                    <BarChart
                      data={reporte}
                      width={screenWidth}
                      height={220}
                      chartConfig={chartConfig}
                      showBarTops={true}
                      style={styles.graphStyle}
                    />
                  </ViewShot>
                
                </View>
              </>
            )}
           
          </View>
        </SafeAreaView>
      </Screen>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'left',
    flexDirection: 'coulmn',
    marginTop: 16,
  },
  descarga: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  graphStyle: {
    marginVertical: 8,
    backgroundColor: '#ffffff',
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
  linkReporte: {
    color: theme.colors.green50,
    fontSize: theme.SIZES.FONT,
    fontWeight: 600,
  },
  icon: {
    marginLeft: 10,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  editText: {
    color: theme.colors.grey600,
    fontSize: theme.SIZES.FONT,
    fontWeight: 600,
    marginStart: 8,
  },
  // chartContainer: {
  //   flex: 1,
  // },
  // legendContainer: {
  //   flex: 1,
  //   marginTop: 20,
  // },
})
