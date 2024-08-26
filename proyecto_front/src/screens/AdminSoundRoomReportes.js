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
import { formatDate } from '../utils/DateUtils';
import axios from  "axios"
import {LocalPhoneStorage, STORAGE_JWT_KEY} from "../storage/LocalStorage"
import { formatFecha as formatFecha2} from '../helpers/dateHelper'


//const screenWidth = Dimensions.get('window').width;
const screenWidth = 350
const height = 220

export function AdminSoundRoomReportes({navigation}){

  const [tipoReporte, setTipoReporte] = useState([
    {id:0, value:"", label:"Elige tipo de Reporte"},
    {id:1, value:"usuariosNuevos", label:"Usuarios Nuevos"},
    {id:2, value:"artistasNuevos", label:"Artistas Nuevos"},
    {id:3, value:"salasNuevas", label:"Salas Nuevas"},
    {id:4, value:"usuariosActivos", label:"Usuarios Activos"},
    {id:5, value:"usuariosBaja", label:"Usuarios Baja"},
    {id:6, value:"propAlquianSala", label:"Prop Alquilan Sala"},
    {id:7, value:"grafTortaTipoSala", label:"Tipo Sala"},
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
  // const [reporte, setReporte] = useState()
  const [mostrarReporte, setMostrarReporte] = useState(false)

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
  const [mostrarReporteTortaTipoSala, setMostrarReporteTortaTipoSala] = useState(false)
  const listReportes = tipoReporte.map((reporte) =>
        <Picker.Item key={reporte.id} label={reporte.label} value={reporte.value} />
  )

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

    const chartConfigPie = {
      backgroundGradientFrom: '#ACACAC',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#4E4E4E',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2,
      useShadowColorFromDataset: false,
    };
  
    const usuraiosNuevos = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [3, 5, 2, 4, 5, 3]
        }
      ]
    };
  
    const artistasNuevos = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [1, 2, 0, 1, 2, 2]
        }
      ]
    };
  
    const salasNuevas = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [2, 3, 2, 3, 3, 1]
        }
      ]
    };
    const usuariosActivos = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [20, 25, 20, 13, 19, 23]
        }
      ]
    };
    const usuariosBaja = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [1, 2, 0, 0, 1, 1]
        }
      ]
    };
  
    const propAlquianSala = {
      labels: ["Mayo", "Junio", "Julio", "Agos", "Sept", "Oct"],
      datasets: [
        {
          data: [7, 6, 7, 8, 7, 8]
        }
      ]
    };
    const grafTortaTipoSala = [
      { name: 'Musical', population: 5, color: '#ff8c00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Teatral', population: 3, color: '#9B5600', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ]

    const colors = ['#ff8c00', '#9B5600', '#ff6347', '#4682b4', '#32cd32'];
    const [reporteTortaTipoSala, setReportTortaTipoSala] = useState([])
    
    const saveData = async () => {
      const stored = await reportesService.storeReportes(usuraiosNuevos)
      const stored1 = await reportesService.storeReportes(salasNuevas)
      const stored2 = await reportesService.storeReportes(salasNuevas)
      const stored3 = await reportesService.storeReportes(usuariosActivos)
      const stored4 = await reportesService.storeReportes(usuariosBaja)
      const stored5 = await reportesService.storeReportes(propAlquianSala)
      const stored6 = await reportesService.storeReportes(grafTortaTipoSala)
  
    }

    const selectDay = (calendarDay) => {
      console.log("selecting date")
      console.log(calendarDay)
      const day = new Date()
      day.setDate(calendarDay.day)
      day.setMonth(calendarDay.month - 1)
      day.setFullYear(calendarDay.year)
      setSelectedDay(day)
      onDaySelected(day)
  }
  
  const title = { name:"Usuarios Nuevos"}
  
  const formatFecha =(date) =>{
    return `${date.getDate()} del ${date.getMonth() + 1 } ${date.getFullYear()}`
  }

   // Define your API call functions
   const fetchUsuariosNuevos = async () => {
    // Implement API call here
    console.log("Fetching usuarios nuevos");
  };

  const fetchArtistasNuevos = async () => {
    // Implement API call here
    console.log("Fetching artistas nuevos");
  };

  const fetchSalasNuevas = async () => {
    // Implement API call here
    console.log("Fetching salas nuevas");
  };

  const fetchUsuariosActivos = async () => {
    // Implement API call here
    console.log("Fetching usuarios activos");
  };

  const fetchUsuariosBaja = async () => {
    // Implement API call here
    console.log("Fetching usuarios baja");
  };

  const fetchPropAlquianSala = async () => {
    // Implement API call here
    console.log("Fetching prop alquian sala");
  };

  const fetchGrafTortaTipoSala = async () => {
    // Implement API call here
    console.log("Fetching graf torta tipo sala");
  };
  
  //ver reportes
  const getReportes = async () => {
    switch (selectedReporte) {
      case "usuariosNuevos":
        reportesNuevosUsuarios();
        break;
      case "artistasNuevos":
        reportesNuevosArtistas();
        break;
      case "salasNuevas":
        reporteSalasNuevas();
        break;
      case "usuariosActivos":
        reportesUsuariosActivos();
        break;
      case "usuariosBaja":
        reportesUsuariosBaja();
        break;
      case "propAlquianSala":
        reportesPropAlquianSala();
        break;
      case "grafTortaTipoSala":
        reportesGrafTortaTipoSala();
        break;
      default:
        console.log("No report selected");
    }
  }

  const descargarReportes = async () => {
    switch (selectedReporte) {
      case "usuariosNuevos":
        descargarReporteNuevosUsuarios();
        break;
      case "artistasNuevos":
        descargarReporteNuevosArtistas();
        break;
      case "salasNuevas":
        descargarReporteSalasNuevas();
        break;
      case "usuariosActivos":
        descargarReporteUsuariosActivos();
        break;
      case "usuariosBaja":
        descargarReporteUsuariosBaja();
        break;
      case "propAlquianSala":
        descargarReportePropAlquianSala();
        break;
      case "grafTortaTipoSala":
        descargarReportesGrafTortaTipoSala();
        break;
      default:
        console.log("No report selected");
    }
  }
  const reportesNuevosUsuarios = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesNuevosUsuarioss(fechaI, fechaH);
    
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
      setReporte(response)
      if(reporte.labels){
        setMostrarReporte(true)}
    console.log('reporte nuevos usuarios, response: ', reporte, response);
    return ;
  }

  const descargarReporteNuevosUsuarios = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/users/descargarReportesNuevosUsers", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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

  const reportesNuevosArtistas = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesNuevosArtistas(fechaI, fechaH);
    
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
      setReporte(response)
      if(reporte.labels){
        setMostrarReporte(true)}
    console.log('reporte nuevos artistas, response: ', reporte, response);
    return data;
  }

  const descargarReporteNuevosArtistas = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/users/descargarReportesNuevosArtistas", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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

  const reporteSalasNuevas = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesSalasNuevas(fechaI, fechaH);
    
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
    setReporte(response)
      if(reporte.labels){
    setMostrarReporte(true)}
    
    console.log('reporte salas nuevas, response: ', reporte, response);
    return data;
  }

  //descargar salas nueas:
  const descargarReporteSalasNuevas = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/salasdeensayo/descargarReportesNuevasSdE", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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

  const reportesUsuariosActivos = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesUsuariosActivos(fechaI, fechaH);
    setReporte(response)
    if(reporte.labels){
    setMostrarReporte(true)}
    //setear reporte con labesl y data
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
    console.log('reporte usuarios activos, response: ', reporte, response);
    return data;
  }


   //descargar Usuarios Activos:
   const descargarReporteUsuariosActivos = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/users/descargarReportesUsuariosActivos", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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

  const reportesUsuariosBaja = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesUsuariosBaja(fechaI, fechaH);
    setReporte(response)
    if(reporte.labels){
      setMostrarReporte(true)}
    //setear reporte con labesl y data
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
    console.log('reporte usuarios baja, response: ', reporte, response);
    return data;
  }

  //descargar usuarios baja:
  const descargarReporteUsuariosBaja = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/users/descargarReportesUsuariosBaja", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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



  const reportesPropAlquianSala = async () => {
    setMostrarReporteTortaTipoSala(false)
    console.log("onpressed ver reporte")
    const response = await reportesService.reportesPropAlquianSala(fechaI, fechaH);
    setReporte(response)
    if(reporte.labels){
      setMostrarReporte(true)}
    //setear reporte con labesl y data
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
    console.log('reporte propietarios que alquilan sala, response: ', reporte, response);
    return data;
  }


  //descargar Propietarios que alquilan:
  const descargarReportePropAlquianSala = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/users/descargarReportesPropietariosAlquilan", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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



  const reportesGrafTortaTipoSala = async () => {
    console.log("onpressed ver reporte")
    const response = await reportesService.reporteGrafTortaTipoSala(fechaI, fechaH);
    const arrayInicial = response
    
    const formattedData = arrayInicial.map((item, index) => ({
      name: item.name,
      population: item.population,
      color: colors[index % colors.length], // Asignar colores cíclicamente
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));
    setReportTortaTipoSala(formattedData);
    setMostrarReporteTortaTipoSala(true)
    
   
    console.log('reporte tipo sala, response: ', reporteTortaTipoSala, response);
    return ;
  }

  

   //descargar Tipo Sala:
   const descargarReportesGrafTortaTipoSala = async() =>{

    const jwt = LocalPhoneStorage.get(STORAGE_JWT_KEY)
    let fechaIn = formatFecha2(fechaI)
    let fechaHa = formatFecha2(fechaH)
    
    // console.log('fechaI: ', fechaIn)
    // console.log('fechaH: ', fechaHa)
    // console.log('fechaI: ', fechaIn, 'Type: ', typeof fechaIn)
    // console.log('fechaH: ', fechaHa, 'Type: ', typeof fechaHa);

    const response = await fetch("http://localhost:3000/salasDeEnsayo/descargarReporteTipoSalaTorta", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`, // Incluye el token de autenticación
          'Accept': 'application/pdf' // Espera una respuesta PDF
      },
      body: JSON.stringify({
          fechaI: fechaIn,
          fechaH: fechaHa
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
  
  

    useEffect(()=>{
      // setFechaI(undefined)
      // setFechaH(undefined)
      setMostrarFechaI(false)
      setMostrarFechaH(false)
      saveData()
    }, [])
  

return(

  <StateScreen>
    <Screen navigation={navigation}>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Reportes de SoundRoom</Text>
            <Picker 
              style={styles.container}
              //selectedValue={"Elige un Reporte"}
              onValueChange={(itemValue, itemIndex)=>{
                console.log(itemValue)
                setSelectedReporte(itemValue)
                console.log(selectedReporte)
              }}>
              {listReportes}
              </Picker>

              <View>
                <Text style={styles.text}>Selecciona rango de fechas</Text>
                  <TouchableOpacity onPress={()=>setOpenI(!openI)}>
                    <Text style={styles.link}>Fecha Desde: 
                    {mostrarFechaI == true && <Text> {formatFecha(fechaI)}</Text>}
                    </Text>
                  </TouchableOpacity>
                  {openI == true && 
                    <Calendar
                      //testID={testIDs.calendars.FIRST}
                      hideArrows={false}
                      enableSwipeMonths
                      current={currentDay}
                      arrowStyle={{ backgroundColor: '#007bff', color: '#808080' }}
                      style={styles.calendar}
                      onDayPress={onDayPressI}
                      maxDate ={fechaH || currentDay}
                      markedDates={{
                          selected: true,
                          disableTouchEvent: true,
                          selectedColor: 'orange',
                          selectedTextColor: 'red'
                      }}
                  />
                  }
                  <TouchableOpacity onPress={()=> setOpenH(!openH)}>
                    <Text style={styles.link}>Fecha Hasta: 
                    {mostrarFechaH == true && <Text> {formatFecha(fechaH)}</Text>}
                    </Text>
                  </TouchableOpacity>
                  {openH == true && 
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
                          selectedTextColor: 'red'
                      }}
                  />
                  }
             </View> 
             <Button color="warning" size="small" onPress  = {()=>getReportes()}>Ver Reporte</Button>
             <Button color="warning" size="small" onPress  = {()=>descargarReportes()}>Descargar</Button>
             {/* <TouchableOpacity>
               <Text style={styles.linkReporte}> VER REPORTE</Text>
             </TouchableOpacity> */}
            
             {selectedReporte && mostrarFechaI && mostrarFechaH && !mostrarReporteTortaTipoSala && mostrarReporte &&
               <> <View style={styles.titleContainer}>
                  <Text style={styles.subtitle}>{selectedReporte.value}</Text>
                  {/* <Block style={styles.descarga}>
                    <Icon style={styles.icon} name="download" family="AntDesign" color={theme.colors.green50} size={24} />
                    <Text style={styles.editText}>Descargar</Text>
                  </Block> */}
                </View>
                <BarChart
                    data={reporte}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    showBarTops={true}
                    style={styles.graphStyle} /></>
             }
              {selectedReporte && mostrarReporteTortaTipoSala  && mostrarFechaI && mostrarFechaH &&
                  <><Text style={styles.subtitle}>Tipo Salas de Ensayo</Text> 
                  <PieChart
                      data={reporteTortaTipoSala}
                      height={height}
                      width={screenWidth}
                      chartConfig={chartConfigPie}
                      accessor="population"
                      style={chartConfigPie} /></> 
              }
            
        </View>      
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
  // chartContainer: {
  //   flex: 1,
  // },
  // legendContainer: {
  //   flex: 1,
  //   marginTop: 20,
  // },
});


