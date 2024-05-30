import { Icon, Block } from 'galio-framework'
import React, { useEffect, useState } from 'react'
import {StyleSheet, Text} from 'react-native'
import { theme } from '../core/theme'
import TextInput from '../components/TextInput'
import { Picker } from '@react-native-picker/picker'
import Collapsible from 'react-native-collapsible'
import * as DateUtils from '../utils/DateUtils'
import { useRoute } from '@react-navigation/native'
import { openCalendar } from '../screens/CalendarScreen'


export const FiltersHeader = ({
    navigation, 
    onSearchInput = (query) => {},
    onDateFilterChanged = (start, end) => {}
}) => {


    const [dateSelectorExpanded, setDateSelectorExpanded] = useState(false)
    const [startDate, setStartDate] = useState(undefined)
    const [endDate, setEndDate] = useState(undefined)
    const [pickerSelection, setPickerSelection] = useState("all")
    const [selectionDispatched, setSelectionDispatched] = useState(false)
    const [hasSelected, setHasSelected] = useState(false) 
    
    const route = useRoute()

    useEffect(() => {
        console.log("useEffect")
        if(route.params?.start) {
            setStartDate(route.params.start)
        }
        if(route.params?.end) {
            setEndDate(route.params.end)
        }
        if(hasSelected || startDate && endDate && pickerSelection == "custom") {
            // Se selecciono un rango de fechas
            onDateSelected()
            setHasSelected(false)
        }
    })

    const setDateForPastYear = () => {
        const current =  new Date()
        setStartDate(
            new Date(current.getFullYear(), 1, 1)
        )
        setEndDate(
            new Date(current.getFullYear(), 12, 31)
        )
        setHasSelected(true)
    }

    const setDateForPastMonth = () => {
        const current = new Date()
        // Necesitamos estos ifs para tener en cuenta el cambio de año en Enero y Diciembre.
        const pastYear = current.getMonth() > 0? current.getFullYear() : current.getFullYear() - 1
        const pastMonth = current.getMonth() > 0? current.getMonth() : 11

        const nextMonth = current.getMonth() < 11? current.getMonth() + 1 : 0
        const nextYear = current.getMonth() < 11? current.getFullYear() : current.getFullYear() + 1

        setStartDate(
            new Date(pastYear, pastMonth, 1)
        )
        
        setEndDate(
            new Date(nextYear, nextMonth, 1)
        )
        setHasSelected(true)
    }


    const onSelectedFilterChange = (selectedFilter) => {
        let isCustomDateSelected = false
        setPickerSelection(selectedFilter)
        switch(selectedFilter) {
            case "all": 
                setStartDate(undefined)
                setEndDate(undefined)
                setHasSelected(true)
                break

            case "year":
                setDateForPastYear()
                break
            case "month": 
                setDateForPastMonth()
                break
            case "custom":
                navigation.setParams({})
                setStartDate(undefined)
                setEndDate(undefined)
                isCustomDateSelected = true
                break
        }
        setDateSelectorExpanded(isCustomDateSelected)
        setSelectionDispatched(false)

    }

    const formatDate = (date) => {
       return date? DateUtils.formatDate(date) : ""
    }

    const onInput = (input) => {
        onSearchInput ? onSearchInput(input): undefined
    }

    const onDateSelected = () => {
        if(selectionDispatched) {
            return
        }
        onDateFilterChanged ? onDateFilterChanged(startDate, endDate) : undefined
        setSelectionDispatched(true)
    }



    const selectStartDate = () => {
        // Reseteamos la fecha final
        navigation.setParams({})
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectionDispatched(false)
        openCalendar(navigation, route, 
            {
                startDate: undefined,
                key: "start",
                title: "Fecha inicial"
            }
        )
    }

    const selectEndDate = () => {
        openCalendar(navigation, route, 
            {
                startDate: startDate,
                key: "end",
                title: "Fecha final"
            }
         )
    }
    
    return (
       <Block style = {styles.container}>
        <Block row style = {styles.selectorRow}>
            <Text style = {styles.dateText}>Fecha</Text>
            <Picker style = {styles.selector}
                    selectedValue = {pickerSelection}
                    onValueChange = {(value, idx) => onSelectedFilterChange(value)} >
                <Picker.Item label ="Todas" value = "all"/>
                <Picker.Item label = "Este año" value = "year" />
                <Picker.Item label = "Este mes" value = "month" />
                <Picker.Item label = "Personalizado" value = "custom" />
            </Picker>
        </Block>
        <Collapsible collapsed = {!dateSelectorExpanded}>
                <Block row style = {styles.customSearchContainer}>
                    <Icon name = "calendar" family = "AntDesign" color = {theme.colors.grey600} size = {24}/>
                    <TextInput 
                        style = {styles.customSearchInput}
                        label = "Desde" 
                        width = "40%"
                        value = {formatDate(startDate)}    
                        onFocus = {() => selectStartDate()}
                        />
                    <TextInput  
                        style = {styles.customSearchInput}
                        label = "Hasta" 
                        width = "40%"
                        value = {formatDate(endDate)}  
                        onFocus = {() => selectEndDate()}  
                        />
                </Block>
            </Collapsible>
        </Block>
    )
}

const styles = StyleSheet.create({
    queryRow: {
        width: '100%',
        alignItems: 'center',
    },

    selector: {
        height: 50,
        width: '60%'
    },

    searchInput: {
        marginStart: 4,
        marginEnd: 8
    },

    customSearchInput: {
        marginStart: 4,
        marginEnd: 4
    },

    customSearchContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    dateText:{
        fontSize: theme.SIZES.FONT * 1.2,
        fontWeight: 600,
        color: theme.colors.grey600,
        marginEnd: 8
    },

    selectorRow: {
        alignItems: 'center'
    },

    container: {
        paddingStart: 16,
        paddingEnd: 16,
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%'
    }

})