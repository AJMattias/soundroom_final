import React, { useState, Component } from 'react'
import { Icon, Block, Text } from 'galio-framework'
import { Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import { roomService } from '../network/RoomService'
import { Rating } from './Rating'
import { reservationService } from '../network/ReservationService'
import { DeleteButton } from './DeleteButton'
import * as DateUtils from '../utils/DateUtils'
import { Price } from './Price'
import Collapsible from 'react-native-collapsible'
import { comisionesService } from '../network/ComisionService'


const OrderDetail = ({concept, value, sign}) => {


    const styles = StyleSheet.create({
        container: {
            marginTop: 8,
            marginBottom: 8,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },

        conceptText:  {
            fontSize: theme.SIZES.FONT,
            fontWeight: 600
        },

        singText: {
            fontSize: theme.SIZES.FONT,
            color: theme.colors.success,
            marginEnd: 4
        },
        priceRow: {
            flexDirection: 'row'
        }

    })

    
    return (
        <Block style = {styles.container}>
            <Text style = {styles.conceptText}>
                {concept}
            </Text>
            <Block style = {styles.priceRow}>
                <Text style = {styles.singText}>{sign}</Text>
                <Price 
                    price = {value}
                    hourlyRate = {false}
                    fontSize = {1}
                />    
            </Block>
        </Block>
    )
}

export const OrderRow = ({order, fee2, onOrderCancelled }) => {

    // const [fee2, setFee2] = useState(0)
    // const comision = async ()=>{
    //     const response = comisionesService.getComisionEnabled()
    //     setFee2(response)
    // }


    const [isCollapsed , setIsCollapsed] = useState(true)

    console.log("order")
    console.log(order)
    
    //order.canceld == "false"
    //const rowColor = order.status == "cancelled" ? styles.disabledOrder : styles.enabledOrder
    const rowColor = order.canceled == "true" ? styles.disabledOrder : styles.enabledOrder

    //calcula el total de la reserva mas comision del 5% 
    const fee = order.totalPrice*1.05 - order.totalPrice //order.totalNet
    const comision = fee2 ? fee2 : 0;
    console.log(comision, fee2);

    //logica de fechas
    // let currentDate = new Date()
    // console.log('current date: ', currentDate)
    // console.log('reservation date: ', order.date)
    // console.log('cuurent hour: ', currentDate.getHours())
    // console.log('hora inicio reserva: ', order.hsStart.getHours())
    // console.log('currentDate <= order.date: ', currentDate <= order.date)
    // let showCancel = false
    // if(currentDate < order.date){
    //     showCancel = true
    // }
    // if(currentDate = order.date){
    //     if(currentDate.getHours() < order.hsStart.getHours()){
    //         showCancel=true
    //     }
    // }

    //nuevo logica:
    // Lógica para determinar si mostrar el botón "Cancelar"
    const currentDate = new Date();
    const orderDate = new Date(order.date);
    const orderStartTime = new Date(order.hsStart);

    let showCancel = false;
    if (currentDate < orderDate) {
        showCancel = true;
    } else if (
        currentDate.toDateString() === orderDate.toDateString() &&
        currentDate.getHours() < orderStartTime.getHours()
    ) {
        showCancel = true;
    }

    return (

        <Block shadown style = {[ styles.orderRowContainer, rowColor]} >
            <Block row style = {styles.nameRow}>
                <Text style = {styles.orderTitle}>{order.idUser.name} {order.idUser.lastName}</Text>
                {/* <Text style = {styles.orderTitle}>{order.user.name} {order.user.last_name}</Text> */}
                <Block style = {styles.statusColumn}>
                    {/* { order.canceled == 'false' && currentDate <= order.date && currentDate.getHours() < order.hsStart.getHours() && */}
                    {showCancel &&
                    <DeleteButton 
                        innerText = "Cancelar" 
                        onDelete = {() => {onOrderCancelled(order)}} />
                    }
                    <Text style = {[
                        styles.statusText,
                        {color: order.canceled == 'true'? theme.colors.success : theme.colors.green50}
                    ]}>{order.canceled == 'false'? "" : "Cancelada"}</Text>    
                </Block>
            </Block>
            <Block row style = {styles.nameRow}>
                    <Block style  = {styles.statusColumn}>
                        <Text style = {styles.orderSubtitle}>{order.idRoom.nameSalaEnsayo}</Text>
                        <Block  style = {styles.dateRow}>
                            <Icon color = {theme.colors.grey600} name = "calendar" family = "AntDesign"/>
                            <Text style = {styles.orderDate}>{order.date.toLocaleDateString()}</Text>
                        </Block>
                    </Block>
                    <Block style = {styles.statusColumn}>
                        <Price  price = {order.totalPrice} //order.totalNet 
                                hourlyRate = {false} 
                                style = {{ fontSize: theme.SIZES.FONT}} />
                       
                        { isCollapsed &&
                        <Text
                            style ={theme.styles.link}
                            onPress = {() => setIsCollapsed(false)}> 
                            Ver detalle 
                         </Text>  
                        }      
                    </Block>
                </Block>
            <Collapsible collapsed = {isCollapsed}>
                <Block style = {styles.orderDetails}>
                    <Block style = {styles.separator} />
                    <OrderDetail
                        concept = "Total bruto"
                        sign = "+"
                        value = {order.totalPrice}
                    />
                    <OrderDetail
                        concept = "Comisión SoundRoom"
                        sign = "-"
                        value  = {(order.totalPrice * comision) / 100}
                    />
                    <OrderDetail
                        concept = "Total"
                        sign = ""
                        value = {order.totalPrice - (order.totalPrice * comision) / 100} //order.totalNet
                    />
                    <Block style = {styles.separator} />   
                    <Block row style = {{justifyContent: 'flex-end', marginTop: 4}}>
                        <Text style = {theme.styles.link}
                              onPress = {() => setIsCollapsed(true)}>Ocultar</Text>
                    </Block>
                </Block>       
            </Collapsible>    
        </Block>
    )

}

const styles = StyleSheet.create({
    orderRowContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 4,
        marginStart: 16,
        marginEnd: 16,
        marginTop: 4,
        marginEnd: 4,
        paddingStart: 16,
        paddingEnd: 16,
        borderLeftWidth: 3,
        flexDirection: 'column' ,
        paddingTop: 8,
        paddingBottom: 8  
    },

    orderTitle: {
        fontSize:  theme.SIZES.FONT * 1.2,
        fontWeight: 600,
    },

    nameRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },

    orderSubtitle: {
        fontSize: theme.SIZES.FONT ,
        color: theme.colors.grey600,
        fontWeight: 600
        
    },

    orderDate: {
        color: theme.colors.grey600,
        marginStart: 8
    },

    dateRow: {
        flexDirection: 'row'
    },

    disabledOrder: {
        borderLeftColor: theme.colors.grey600
    },

    enabledOrder: {
        borderLeftColor: theme.colors.primary
    },

    statusColumn: {
        flexDirection: 'column',
        alignItems: 'center'
    },

    statusText: {
        fontSize: theme.SIZES.FONT,
        fontWeight: 600
    },

    orderDetails: {
        flexDirection: 'column',
        marginTop: 16,
        width: '100%'
    },

    separator: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 3,
        borderTopColor: theme.colors.grey200 ,
        marginTop: 8,
        marginBottom: 8
    }

})
