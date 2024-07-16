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

export const OrderRow = ({order, onOrderCancelled }) => {

    const [isCollapsed , setIsCollapsed] = useState(true)

    console.log("order")
    console.log(order)
    
    //order.canceld == "false"
    //const rowColor = order.status == "cancelled" ? styles.disabledOrder : styles.enabledOrder
    const rowColor = order.canceled == "true" ? styles.disabledOrder : styles.enabledOrder

    //calcula el total de la reserva mas comision del 5% 
    const fee = order.totalPrice*1.05 - order.totalPrice //order.totalNet

    return (

        <Block shadown style = {[ styles.orderRowContainer, rowColor]} >
            <Block row style = {styles.nameRow}>
                <Text style = {styles.orderTitle}>{order.idUser.name} {order.idUser.lastName}</Text>
                {/* <Text style = {styles.orderTitle}>{order.user.name} {order.user.last_name}</Text> */}
                <Block style = {styles.statusColumn}>
                    { order.canceled == 'false' &&
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
                        value = {order.totalPrice*1.05}
                    />
                    <OrderDetail
                        concept = "Comisión SoundRoom"
                        sign = "-"
                        value  = {fee}
                    />
                    <OrderDetail
                        concept = "Total"
                        sign = ""
                        value = {order.totalPrice} //order.totalNet
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
