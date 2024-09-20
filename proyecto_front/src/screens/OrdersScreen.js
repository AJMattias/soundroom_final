import React, { useState } from "react";
import { View, Alert, StyleSheet, ScrollView } from "react-native";
import { Screen } from "../components/Screen";
import { StateScreen } from "../components/StateScreen";
import { theme } from "../core/theme";
import { reservationService } from "../network/ReservationService";
import { Text, Block } from 'galio-framework'
import { ordersService } from "../network/OrdersService";
import { OrderRow } from "../components/OrderRow";
import {Price} from "../components/Price"
import { FiltersHeader } from "../components/FiltersHeader";
import { getLoggedUser } from "../storage/LocalStorage";
import { ReservationCard } from "../components/ReservationCard";
import { comisionesService } from "../network/ComisionService";

const OrdersFooter = ({orders, fee2}) => {
    const styles = StyleSheet.create({
        footer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingStart: 16,
            paddingEnd: 16,
            paddingTop: 24,
            paddingBottom: 24,
            position: 'sticky',
            //bottom: 0,
            backgroundColor: '#FFFFFF',
            top:0
        },
       
        footerTitle: {
            fontSize: theme.SIZES.FONT * 1.2,
            fontWeight: 600
        }

    })
   
   
    const calcTotal = () => {
        if (!orders || orders.length < 1) {
            return 0
        }
        return orders.reduce((previous,current) => {
            //return previous + current.totalNet
            // return previous + current.totalPrice
            return previous + (current.totalPrice - (current.totalPrice * fee2) / 100)
        }, 0)

        
    }

    console.log("total "+calcTotal())
    console.log("totalOrders")
    console.log(orders)
    return (
        <Block shadow style = {styles.footer}>
            <Text style = {styles.footerTitle}>Tus ganancias</Text>
            <Price price = {calcTotal()} hourlyRate = {false} />
        </Block>
    )

}


export const OrdersScreen = ({navigation}) => {
    const [orders, setOrders] = useState([])
    const [ordersFetched, setOrdersFetched] = useState(false)

    const [query, setQuery] = useState("")
    const [month, setMonth] = useState()
    const [fee2, setFee2] = useState(0)


    const fetchOrders = async () => {
        console.log("fetchOrders")
        try { 
            if(query && query.length > 0) {
                setOrders(
                    await ordersService.findMyOrdersByRoomName(query)
                )
            } else if (month) {
                setOrders(
                    await ordersService.findMyOrdersByMonth(month)
                )
            } else {
                setOrders(
                    await ordersService.getMyOrdersBd()
                )
            }
            const response = await comisionesService.getComisionEnabled()
            const porcentaje = response.porcentaje;
            setFee2(porcentaje)
            console.log(porcentaje)
        } catch (apiError) {
            console.error(apiError)
        }
        setOrdersFetched(true)
    }

    
    // const comision = async ()=>{
    //     const response = comisionesService.getComisionEnabled()
    //     setFee2(response)
    // }

    const onDateFilter = async (startDate, endDate) => {
        console.log("onDateFilter")
        console.log("Start "+startDate)
        console.log("End "+ endDate )
        if(startDate && endDate) {
            setOrders(
                (await ordersService.getMyOrdersBd()).filter((order) => order.date >= startDate && order.date < endDate)
            )
        } else {
            // Si la start date está vacía significa que se ha elegido el rango "Todas"
            await fetchOrders()
        }

    }

    const cancelOrder = async (order) => {
        try {
            //send mail to user
            //await ordersService.cancelOrder(order)
            //console.log('email sended a user: ', order.idUser)
            //cancel reservation in bd
            await reservationService.cancelReservationBd(order.id)
            //await reservationService.sendEmail(email)
            // if(email.duenoSala){
            //     await reservationService.sendEmailOwner(email)
            // }
            await fetchOrders()
        } catch(apiError) { 
            console.error(apiError)
        }
    }

    // const email = {
    //     receptor: String(getLoggedUser.email),
    //     nombreUsuario: String(getLoggedUser.name),
    //     sala: String(room.name),
    //     inicio: String(reservation.start.toLocaleDateString()+" a las " + reservation.start.toLocaleTimeString()),
    //     duenoSala: String(room.owner.email)
    // } 
    const areOrdersCancelled = () => {
        return orders && 
            orders.filter((order ) => order.canceled == 'true')
                .length
    }

    if(!ordersFetched) {
        fetchOrders().then()
        setOrdersFetched(true)
    }

    const renderOrders = () => {
        if(!orders || orders.length < 1) {
            return(
                <Text style = {theme.styles.notFoundText}>No se encontraron Ordenes en la fecha seleccionada.</Text>
            )
        }
        const children = []
        orders.filter((order) => order.canceled == 'false')
            .forEach((order, idx, arr) => {
                children.push(
                    <OrderRow 
                            order = {order} 
                            fee2 = {fee2}
                            onOrderCancelled = {(order) => cancelOrder(order)}
                    />
                )
            })
        
        if(areOrdersCancelled()) {
            children.push(
                <Text style = {styles.title}>Ordenes canceladas</Text>
            )
            orders.filter((order) => order.canceled == 'true')
                .forEach((order, idx, arr) => {
                    children.push(
                        <OrderRow 
                                order = {order} 
                                onOrderCancelled = {(order) => cancelOrder(order)}
                                fee2 = {fee2}
                        />
                    )
                })
        }
        return  children 
    }
    
    return (
        <StateScreen loading = {!ordersFetched}>
            <Screen  navigation = {navigation}>
                <ScrollView>
                    <FiltersHeader navigation = {navigation} onDateFilterChanged = {onDateFilter} />
                    {renderOrders()}

                </ScrollView>
            </Screen>
            <OrdersFooter 
            fee2 = {fee2}
            orders = {orders.filter((order) => order.canceled == 'false')}/>
        </StateScreen>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: theme.SIZES.FONT * 1.2,
        fontWeight: 600,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 24
    },
    ownerReservationWrapper: {
        marginTop: 48,
        flexDirection: 'column',
        width: '100%'
    },

})