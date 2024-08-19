import { Block, Icon } from "galio-framework"
import {theme} from "../core/theme"
import React, { useState } from "react"
import { TouchableOpacity, StyleSheet, Text } from "react-native"
import { roomService } from "../network/RoomService"
import { LocalPhoneStorage, STORAGE_USER } from "../storage/LocalStorage"
import { RateComment } from "./RateComment"
import TextInput from "./TextInput"
import ButtonSmall from "./ButtonSmall"
import { emailService } from "../network/EmailService"
import { ratingsService } from "../network/RatingsService"


const RatingStar = ({size = 10, value, currentScore , onClick}) => {
    const icon = value <= currentScore ? 'star' : 'staro'
    return ( 
       <TouchableOpacity onPress = {() => onClick(value)} >
             <Icon size = {size} color = {theme.colors.primary} family = "AntDesign" name = {icon} />
        </TouchableOpacity>
    )
}

export const AddComment = ({ user, otherId, title , placeholder , onRatingCreated , onRatingUpdated }) => {

    //otherId is roomId
    // reemplazar otherId por roomId
    const roomId = otherId
    const [previousRating, setPreviousRating] = useState()
    
    const [previousRatingFetched, setPreviousRatingFetched] = useState(false)

    const [score , setScore] = useState()

    const [comment , setComment] = useState({ value: '', error: ''})

    const [isEditing, setIsEditing] = useState(true)

    const validateComment = () => {
        if(comment.value.length < 1) {
            setComment({ ...comment, error: 'El comentario no puede estar vacío' })
            return false
        }
        if(!score) {
            setComment({...comment, error: 'Selecciona un puntaje'})
            return false
        }
        return true
    }


    const postComment = async () => {
        console.log("posting opinion a sala: ", roomId)
        if(!validateComment()) {
            return
        }
        await ratingsService.createOpinion({
            comment: comment.value,
            score: score
        }, roomId)
        await fetchPreviousRating()
        if(onRatingCreated) {
            onRatingCreated()
        }
        if(onRatingUpdated) {
            onRatingUpdated()
        }
    }

    const updateComment = async () => {
        
        if(!validateComment()) {
            return
        }
        await ratingsService.updateRatingBd(previousRating.id, {
            comment: comment.value,
            score: score
        })
        await fetchPreviousRating()
        if(onRatingUpdated) {
            onRatingUpdated()
        }
    }

    const updateCommentToArtist = async () => {
        if(!validateComment()) {
            return
        }
        await ratingsService.updateRatingBd(previousRating.id, {
            comment: comment.value,
            score: score,
            artistId: roomId
        })
        await fetchPreviousRating()
        if(onRatingUpdated) {
            onRatingUpdated()
        }
    }

    const deleteComment =  async () => {
        await ratingsService.deleteRating(previousRating.id)
        await fetchPreviousRating()
    }

    const fetchPreviousRating = async () => {
        //si userlogged es SdE buscar opinion a artista
        
        
        //si userlogged es artsita buscar opinion a SdE
        const rating = await  ratingsService.getMyRatingsForOtherIdBd(otherId)
        console.log("previous rating")
        console.log(rating)
        if(rating) {
            setPreviousRating(rating)
            setScore(rating.estrellas)
            //setComment({...descripcion, value: rating.descripcion})
            setComment(rating.descripcion)
            setIsEditing(false)
        } else {
            setScore(undefined)
            setComment({value: '', error: ''})
            setPreviousRating(undefined)
            setIsEditing(true)
        } 
        setPreviousRatingFetched(true)
    }


    const onScoreChanged = (newScore) => {
        setScore(newScore)
        setComment(
            {...comment, error: '' }
        )
    }

    const onSubmitClicked  = () => {
        if(user.idPerfil.name="sala de ensayo"){
            if(previousRating) {
                updateComment().then()
            } else {
                postComment().then()
            }
        }else if (user.idPerfil.name="artista"){
            if(previousRating) {
                updateCommentToArtist().then()
            } else {
                postComment().then()
            }
    }}
 
    const renderRatingsBar = () => {
        const currentValue = score? score : 0
        const stars = []
        for(let i = 1; i <= 5; i++ ) {
            stars.push(
                <RatingStar size = {20} value = {i} currentScore = {currentValue} onClick = {onScoreChanged} />
            )
        }
        return(
            <Block row center style = {styles.starsContainer} >
                {stars}
            </Block>
        )
    }

    const renderEditableComment = () => {
        return (
            <Block style = {styles.editableCommentContainer}>
                { renderRatingsBar() }
                <Block row  style = {styles.editCommentRow} >
                    <TextInput  
                        label = "Tu comentario"
                        errorText = {comment.error}
                        value = {comment.value}
                        onChangeText = { (text) => setComment({value: text, error: ''})}
                        multiline = {true}
                        width = '80%'
                        placeholder = {comment}
                    />
                    <TouchableOpacity onPress = {onSubmitClicked}  style = {{marginStart: 8}}>
                        <Icon size = {36} color = {theme.colors.primary} family = 'MaterialCommunityIcons' name = 'send'/>
                    </TouchableOpacity>
                </Block>
            </Block>
        )
    }

    const renderBody = () => {
        if(!isEditing && previousRating) {
            return (
                <RateComment 
                    rate = {previousRating}
                    user = {user}
                    onClick = {() => setIsEditing(true) }
                />    
            )
        } else {
            return renderEditableComment()
        }
    }

    if(!previousRatingFetched) {
        fetchPreviousRating().then()
    }


    return (
        <Block style = {styles.container}>
            <Text style = {styles.commentTitle}> {title} </Text>
            { renderBody() } 
        </Block>
    )
    
}

const styles = StyleSheet.create({
    starsContainer:  {
        width: '100%',
        paddingStart: 16,
        paddingEnd: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentBox: {
        marginStart: 16,
        marginEnd: 16
    },

    commentText: {
        marginTop: 8,
        marginStart: 16,
        marginEnd: 16,
        fontSize: theme.SIZES.FONT
    },

    commentTitle: {
        fontSize: theme.SIZES.FONT* 1.25,
        fontWeight: 600,
        marginBottom: 4
    },

    commentFooter: {
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },

    container: {
        marginTop: 24,
        flexDirection: 'column',
         width: '100%',

    },

    editableCommentContainer: {
        flexDirection: 'column',
        width: '100%'
    },

    editCommentRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    }

})