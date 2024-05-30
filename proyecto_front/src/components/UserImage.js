import { Image, StyleSheet } from "react-native"
import React from "react"

export const UserImage = ({user, size = 24 , style,  ...props}) => {
    const img = user && user.image? user.image : require("../assets/user.png")
    const radius = Math.round(size/2)

    return (
        <Image 
            source = {img}  
            style = {[
               style,
                {
                    width: size, 
                    height: size,
                    borderRadius: radius
                }
            ]}
            {...props}/>
    )
}

const styles = StyleSheet.create({

})