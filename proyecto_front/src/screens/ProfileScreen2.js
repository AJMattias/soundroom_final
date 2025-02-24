import { Block, Switch, Text, Checkbox } from 'galio-framework'
import React, { useState } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { Screen } from '../components/Screen'
import { StateScreen } from '../components/StateScreen'
import { theme } from '../core/theme'
import { perfilesService } from '../network/perfilesService'
import { CheckBox, Icon } from 'react-native-elements'
import Button from '../components/Button'


export function ProfileScreen2({ route, navigation }) {
  const { perfilId } = route.params
  const [perfilFetched, setPerfilFetched] = useState(false)
  const [perfil, setPerfil] = useState({id:'',name:'', permisos:[]})
  const [perfilPermisos, setPerfilPermisos] = useState([])
  const [permisosAll, setPermisosAll] = useState([])
 
  const [perfilName, setPerfilName] = useState()
  const [permisosPicked, setPermisosPicked] = useState([])
  const [permisosTodos, setPermisosTodos] = useState([])
  const [permisosCero, setPermisosCero] = useState('')
  const [permisosNoOtorgados, setPermisosNoOtorgados] = useState([])

  const fetchPerfil = async () => {
    console.log('buscando perfil')
    const response = await perfilesService.getPerfil(perfilId)
    console.log(response)
    setPerfil(response)
    console.log(perfil)
    const permisosReponse = response.permisos
    permisosReponse.map((permiso) => {
      perfilPermisos.push({
        id: permiso._id,
        name: permiso.name,
        checked: true,
      })
    }) 
    console.log(perfilPermisos.length)
    console.log(perfilPermisos)
    setPerfilName(perfil.name)
  }

  //nuevo codigo permisos no otorgados:
  const getPermisosNoOtorgados = async () => {
    console.log('get All Permisos')
    const response = await perfilesService.getPermisos()
    console.log(response)
    response.map((permiso) => {
      permisosAll.push({ id: permiso.id, name: permiso.name, checked: false })
    })
    console.log(permisosAll)

    let permisosNoOtorgados = permisosAll.filter((permiso) => 
      !perfilPermisos.some((perfilPermiso) => perfilPermiso.id === permiso.id)
    )
    setPermisosNoOtorgados(permisosNoOtorgados)
    setPerfilPermisos([...perfilPermisos, permisosNoOtorgados])
    setPerfilFetched(true)

  }

  //viejo codigo
  const getAllPermisos = async () => {
    console.log('get All Permisos')
    const response = await perfilesService.getPermisos()
    console.log(response)
    response.map((permiso) => {
      permisosAll.push({ id: permiso.id, name: permiso.name, checked: false })
    })
    console.log(permisosAll)

    let nuevoPermisosTodos = permisosAll.filter((permiso) => 
    perfilPermisos.map((p) => p.id)
    .indexOf(permiso.id) == -1)
    console.log(nuevoPermisosTodos)
    setPermisosTodos(nuevoPermisosTodos)
    console.log(permisosTodos)

    let combinado = perfilPermisos.concat(nuevoPermisosTodos)
    setPerfilPermisos(combinado)
    // nuevoPermisosTodos.map((permiso)=>{
    //   perfilPermisos.push({id: permiso.id, name: permiso.name, checked: false})
    // })


    console.log(perfilPermisos)

    setPermisosTodos(nuevoPermisosTodos)
    setPermisosTodos(permisosTodos)
    console.log(permisosTodos)

    //viejo

    // for (var i = 0; i < perfilPermisos.length; i++) {
    //   var id = perfilPermisos[i].id
    //   for (var j = 0; j < permisosAll.length; j++) {
    //     var idj = permisosAll[j].id
    //     const son_iguales = checked(perfilPermisos[i].id, permisosAll[j].id)
    //     if (son_iguales === true) {
    //       permisosAll[j].isChecked = son_iguales
    //     }
    //   }  
    // }
    //console.log(permisosAll)
    }
    const checked = (perfilPermisos, permisoAll) => {
      if (perfilPermisos == permisoAll) {
        return true
      }
      return false
    }

    const filterPermisos = async () =>{
      console.log('get All Permisos')
      const response = await perfilesService.getPermisos()
      console.log(response)
      let nuevoPermisosTodos =[]
      perfilPermisos.map(permisoPerfil=>{
        response.map(respon=>{
          if(permisoPerfil.id != respon.id){
            nuevoPermisosTodos.push({id: permisoPerfil.id, name: permisoPerfil.name, checked: false})
          }
        })
        // nuevoPermisosTodos = response.filter((permiso) => permiso.id != permisoPerfil.id)})
    })
    setPermisosTodos(nuevoPermisosTodos)
    console.log(permisosTodos)
  }

     const renderPermisosAll = ({permiso}) => {
     return(
         <Block style={styles.permisosContainer}>
             {/* {permisosAll.map((permiso) => { */}
                 <Block>
                     <Text style={styles.list}>permiso</Text>
                     {/* <Text style={styles.list}>{permiso.name}</Text> */}
                 </Block>
             {/* })} */}
         </Block>
     )
     }

  if (!perfilFetched) {
    setPerfilPermisos([])
    setPermisosAll([])
    setPermisosTodos([])
    fetchPerfil().then()
    getAllPermisos().then()
    //filterPermisos().then()
    setPerfilFetched(true)
  }

  const renderItem = ({item}) => {
    return(
      <Block row style={styles.permisosContainer}
    //   onClick={()=>handlerOnPress(item)}
      >
        <Block row style={styles.permiso}>
            <Text style={styles.list}>{item.name}</Text> 
            <Switch
                value={item.isChecked}
                onValueChange={() =>console.log(!item.isChecked) }
            />

        </Block>
        { item.isChecked === true && (
        <Text style={styles.subtitle}>Añadido</Text> )}
       
      </Block>
    )
  }

  const selecPermisos = (index) =>{
      const bolean =  perfilPermisos[index].checked
      console.log("valor boleano seleccionado: ")
      console.log(bolean)
      perfilPermisos[index].checked = !bolean
      console.log("Nuevo alor boleano seleccionado: ")
      console.log(perfilPermisos[index].checked )
  }

  const guardarPermisos =() => {
    const nuevosPermisos = perfilPermisos
    console.log('nuevosPermisos: ', nuevosPermisos)
    perfilPermisos.map(permiso=>{
      console.log(permiso.id)
      console.log(permiso.checked)
      if(permiso.checked === true){
      const response = addPermisosPerfil(permiso.id)
      console.log(response)
      }
      else{
      const response = deletePermisos(permiso.id)
      console.log(response)
      }
      navigation.navigate("ProfileListScreen")
  })
  }

  const guardarPermisos2 =() => {
    const nuevosPermisos =[]
    console.log('nuevosPermisos: ', nuevosPermisos)
    perfilPermisos.map(permiso=>{
      console.log(permiso.id)
      console.log(permiso.checked)
      if(permiso.checked === true){
      nuevosPermisos.push(permiso.id)
      }   
  })
  console.log('nuevosPermisos: ', nuevosPermisos)
  const response =  addPermisosPerfil(nuevosPermisos)
  if(response){
    setPerfilFetched(false)
    console.log('respuesta a la llamada al back para actualizar permisos: ', response)
    navigation.navigate("ProfileListScreen")
    //navigation.replace("ProfileListScreen")
  }
  }

  const addPermisosPerfil = async (permisos) => {
    const response = await perfilesService.addPermisosToProfile(perfilId, permisos)
    console.log("added")
    return response
}

const deletePermisos = async (id) =>{
    const response = await perfilesService.deletePermisosFromProfile(perfilId, id)
    console.log("deleted")
    return response

}
  const changeValue = (index) =>{
    const bool = permisosAll[index].checked 
    permisosAll[index].checked  = !bool
    console.log(!bool)
    setPermisosAll(permisosAll)
  }

  return (
    <StateScreen loading={!perfilFetched}>
      <Screen navigation={navigation}>
        <ScrollView>
          <Text style={styles.title}>Perfil: {perfil.name}</Text>
          {perfilPermisos.length == 0 && (
            <Text style={styles.subtitle}>Este perfil no tiene permisos añadidos</Text>
          )}
          <Text style={styles.subtitle}>Permisos:</Text>

          {/* <FlatList
                data={permisosAll}
                renderItem={renderItem}
                keyExtractor={(item)=> item.id}
            /> */}

         <View>
            {perfilPermisos.map((item, index)=>
                <View style={styles.permiso}>
                  <Checkbox
                    style={styles.check}
                    color="warning"
                    label={item.name}
                    key={item.id}
                    initialValue={item.checked}
                    onChange={() => selecPermisos(index)} />
                  {/* <Switch
                      style={styles.swtich}
                      //color="warning"
                      value={item.checked}
                      onChange={() => changeValue(index) }
                  /> */}
                {/* <Checkbox
                style={styles.check}
                color="warning"
                label={item.name}
                key={item.id}
                initialValue={item.checked}
                onChange={() => selecPermisos(index)} />*/}
                </View> 
            )}
          </View> 
          <View>
          <Button
          mode="contained"
          onPress={guardarPermisos2}
          >Guardar Permisos</Button>
          </View>
        </ScrollView>
      </Screen>
    </StateScreen>
  )
}

const styles = StyleSheet.create({
  swtich:{
    marginRight:2,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 16,
    width: '100%',
    textAlign: 'center',
  },
  permisosContainer: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 12,
  },
  check: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: theme.colors.white,
  },
  item: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  list: {
    fontSize: theme.SIZES.FONT * 1.25,
    fontWeight: 600,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 10,
    //paddingBottom: 10,
  },
  subtitle: {
    fontWeight: 600,
    fontSize: theme.SIZES.FONT,
    paddingTop: 3,
    paddingLeft: 8,
    color: theme.colors.grey600
 },
 permiso: {
     flexDirection:'row'
 }
})
