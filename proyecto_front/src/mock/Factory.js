const faker = require("faker")
import { fake } from "faker"
import { v4 as uuid } from "uuid"
import { externalApi } from "../network/ApiClient"
import { MockStore } from './MockStore'

faker.setLocale("es")

//https://api.unsplash.com/search/photos?page=1&query=rehearsal+room&client_id=LsJr3nRL5p7V5lxpv3KFc6NGUFxvjL9PjxiuAOFWWkE


const roomPhotos = []


const fetchPhotos = async (qty, pageNumber) => {
    if (roomPhotos.length > qty) {
        return
    }
    const page = pageNumber ? pageNumber : 1
    const photos = await externalApi.get("https://api.unsplash.com/search/photos?page=" + page + "&query=rehearsal+room&client_id=LsJr3nRL5p7V5lxpv3KFc6NGUFxvjL9PjxiuAOFWWkE")
    photos.results.forEach((result, idx, arr) => {
        roomPhotos.push(result.urls.small)
    })
    return await fetchPhotos(qty, page + 1)
}


const badRoomOpinions = [
    "Malísima, una pérdida de tiempo y dinero",
    "Me dan a elegir entre esta sala y un pollo, me quedo con el pollo",
    "Mala iluminación y la acústica deja mucho que desear",
    "Delincuentes , devuelvan el dinero!!",
    "Me cobraron la reserva y , al llegar, se la dieron  a otra persona y se lavaron las manos. Una estafa",
    "El personal muy maleducado y poco atento",
    "Los colores de las paredes , un asco!",
    "PONGANLE PILAS A LA HIGENE MUCHACHOS!",
    "El precio no está acorde al servicio brindado",
    "Me tuvieron una hora esperando la sala que ya había reservado. UNA HORA! como si nuestro tiempo no valiera nada",
    "No cuentan con ninguno de los instrumentos que promocionan en la página",
    "Tienen que ir presos!!",
    "La instalación acústica deja mucho que desear. Para colmo, el sonido es malo y los parlantes están saturados",
    "Malo, no lo recomiendo.",
    "Poco puntuales",
    "No aceptan devoluciones si uno no puede asistir a la sala",
    "Poco espacio, mala acústica",
    "La mayoría de los instrumentos no funcionan o se escuchan mal",
    "No me reconocieron el pago",
    "La iluminación es precaria, la distribución espacial también",
    "DEVUELVANME LA PLATA!!",
    "Para eso ensayamos en mi patio",
    "Muy poca puntualidad y pésimo servicio",
    "Estafa",
    "Tienen muchas cosas por mejorar, no sabría por donde empezar",
    "Mala iluminación, poca puntualidad y pulcritud",
    "Se escucha todo lo que tocan las otras salas, pésima aislación acústica"

]

const neutralRoomOpinions = [
    "Buen espacio pero carece de todos los instrumentos",
    "Podría mejorar",
    "Buen lugar pero mejorar la puntualidad para la próxima",
    "Lindo, pero hay mejores",
    "A la banda no le gustó pero a mi me encantó",
    "Mejorar un poco la atención del personal. Lo demás todo bien!",
    "Lindo pero abran más días, cuesta un huevo conseguir lugar",
    "Muy alejado. La sala en sí , excelente!",
    "No me puedo quejar",
    "Buen precio , servicio regular",
    "Le agregaría un poco de luz",
    "Las plantas no eran adecuadas y carecían de riego",
    "A mi mamá le gustó"
]

const comodidadesMock = [
    "Aire acondicionado",
    "Alquiler de instrumentos",
    "Venta de comida",
    "Venta de bebidas",
    "Reparación de instrumentos",
    "Amplificadores",
    "Estacionamiento",
    "Alquiler de platillos",
    "Bar",
    "Camaras de seguridad",
    "Emergencias medicas",
    "Camaras de seguridad",
    "Guardarropas",
    "Internet Wifi",    
    "Jardin",
    "Matafuegos",
    "Metegol",
    "Parrilla",    
    "TV",
    "Venta de accesorios",
    "Alquiler de reproductores",
    "Atiende feriados",
    "Ofrece promociones",
    "Acustizado",
    "Insonorizado",
    "Tiene control Room",
    "Luz de emergencia"
]

const positiveRoomOpinions = [
    "Excelente , cómodo , amplio",
    "Tiene todos los instrumentos que solicitamos",
    "Buena atención, económico",
    "Buena atención",
    "Relación precio calidad",
    "Buena ubicación",
    "Excelente!",
    "Lindisimoo :)",
    "This is rock!",
    "Me gusta , mejoraría un poco la descripción y fotos",
    "Impecable",
    "Recomendable",
    "Volvería a alquilar sin dudar",
    "Un lugar de paz y amor",
    "Calidad de primera",
    "Muy buena onda el propietario y empleados",
    "Me regalaron galletitas! :)",
    "Volvería con toda la familia",
    "Si las salas de ensayo fueran gustos de helado, es tan buena como el dulce de leche granizado",
    "SkereeeeeEE :)  ",
    "Prefiero alquilar esta sala que una noche en el paraíso",
    "Si Messi fuera músico alquilaría esta sala",
    "Tiene todos los instrumentos necesarios y buena acústica.",
    "DALEE CAMPEOON, DALE CAMPEOOO!!!"
]

const badArtistOpinions = [
    "NO PAGA, guarda , estafador",
    "Poca puntualidad a la hora de dejar la sala",
    "Poca higene",
    "Mala música, peor comportamiento",
    "No se presentó a la sala en el horario acordado",
    "Rompió un instrumento musical",
    "Rompió la pared! ¿Cómo hizo?",
    "Hace meses que tiene una orden vencida y no paga",
    "La música es un desastre. ",
    "Poco profesional",
    "Pésima puntualidad",
    "Dejaron la sala en muy malas condiciones",
    "Se robaron una guitarra!",
    "Podrían cuidar más la puntualidad en la próxima",
    "Un maleducado",
    "Mala actitud frente a la sala",
    "Cuidado con este cliente",
    "Muy mala atención al personal",
    "No respetaron las reglas del establecimiento",
    "Mejorar la puntualidad",
    "Los vecinos me denunciaron por ruidos molestos cuando tocaron ellos"
]

const goodArtistOpinions = [
    "Excelente todo",
    "Puntual para asistir y pagar",
    "De mis clientes favoritos",
    "Muy buena música , tiene talento",
    "Es un placer tenerlos en la sala",
    "Lindo trabajar con gente así",
    "Paga bien, toca bien y es un placer atenderlo",
    "Recomendable",
    "Van por buen camino, sigan así",
    "No me puedo quejar.",
    "Tienen talento para la música y son buenos clientes",
    "Pagan bien!",
    "Muy atentos a los detalles",
    "Pulcro y prolijo como siempre siempre!",
    "Junta responsabilidad con talento artístico",
    "Perfecto todo!",
    "Excelente cliente"
]

const imageForId = (uid) => {
    return "https://picsum.photos/200/300?" + uid
}

export const avatarForId = (uid) => {
    return "https://i.pravatar.cc/100?u=" + uid
}

const pickOne = (array) => {
    const idx = faker.random.number({ min: 0, max: (array.length - 1) })
    return array[idx]
}

export const pickMany = (array, numberToPick) => {
    const indexes = []
    for (let i = 0; i < numberToPick && i < array.length; i++) {
        let idx = faker.random.number({ min: 0, max: (array.length - 1) })
        while (indexes.indexOf(idx) != -1 && indexes.length < array.length) {
            idx = faker.random.number({ min: 0, max: (array.length - 1) })

        }
        indexes.push(idx)
    }
    return indexes.map((idx) => array[idx])
}


const addCommentsByScore = (ratings, scoreBounds, commentsArray) => {
    const filtered = ratings.filter((rating) => rating.score <= scoreBounds.max && rating.score >= scoreBounds.min)
    const comments = pickMany(commentsArray, filtered.length)
    return filtered.map((rating, idx, arr) => {
        return { ...rating, comment: comments[idx] }
    })
}


export const Factory = new function () {

    this.createRooms = async (qty) => {
        await fetchPhotos(qty)

        roomPhotos.map((picture) => {
            const user = this.createUser()
            const id = uuid()
            const room = {
                id: id,
                owner: user,
                ownerName: user.name + " " + user.last_name,
                ownerImage: user.image,
                image: picture,
                name: faker.company.companyName(),
                address: faker.address.streetAddress(),
                summary: faker.company.catchPhrase(),
                hourlyRate:  faker.random.number({min: 50, max: 1500, precision: 0.5}),
                enabled: true,
                comodidades: pickMany(comodidadesMock, Math.floor((Math.random()*comodidadesMock.length)))
            }
            MockStore.storeRoom(room)
            return room
        })
    }
    this.createUser = () => {
        const id = uuid()
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const email = faker.internet.email(firstName, lastName)
        const avatar = avatarForId(id)

        const user = {
            id: id,
            name: firstName,
            last_name: lastName,
            email: email,
            image: avatar
        }

        MockStore.storeUser(user)
        return user
    }

    this.createArtist = () => {
        const user = this.createUser()
        const artist = {
            id: uuid(),
            user: user,
            userId: user.id,
            style: faker.music.genre()
        }
        MockStore.storeArtist(artist)
        return artist
    }

    this.createRoom = () => {
        const user = this.createUser()
        const id = uuid()
        const room = {
            id: id,
            owner: user,
            ownerName: user.name + " " + user.last_name,
            ownerImage: user.image,
            image: imageForId(id),
            name: faker.company.companyName(),
            address: faker.address.streetAddress(),
            summary: faker.company.catchPhrase()
        }
        MockStore.storeRoom(room)
        return room
    }

    this.createRoomForUser = (user) => {
        const id = uuid()
        const room = {
            id: id,
            owner: user,
            ownerName: user.name + " " + user.last_name,
            ownerImage: user.image,
            image: imageForId(id),
            name: faker.company.companyName(),
            address: faker.address.streetAddress(),
            summary: faker.company.catchPhrase()
        }
        MockStore.storeRoom(room)
        return room
    }

    this.createRatingsForRoom = (roomId) => {
        const artists = MockStore.getArtists()
        const ratingsNumber = faker.random.number({ min: 1, max: 15 })
        const randomArtists = pickMany(artists, ratingsNumber)
        const newRatings = randomArtists.map((artist) => {
            const score = faker.random.number({ min: 1, max: 5 })
            return {
                user: artist.user,
                artist: artist,
                otherId: roomId,
                score: score
            }
        })
        let ratings = []
        //Good comments 
        ratings = ratings.concat(
            addCommentsByScore(newRatings, { min: 4, max: 5 }, positiveRoomOpinions)
        )
        // Neutral comments
        ratings = ratings.concat(
            addCommentsByScore(newRatings, { min: 3, max: 3 }, neutralRoomOpinions)
        )
        // Negative comments
        ratings = ratings.concat(
            addCommentsByScore(newRatings, { min: 1, max: 2 }, badRoomOpinions)
        )
        MockStore.storeRatings(ratings)
    }


    this.createRatingsForArtist = (artistId) => {
        const ratingsNumber = faker.random.number({ min: 1, max: 15 })
        const randomRooms = pickMany(MockStore.getRooms(), ratingsNumber)
        const newRatings = randomRooms.map((room) => {
            const score = faker.random.number({ min: 1, max: 5 })
            return {
                id: uuid(),
                user: room.owner,
                otherId: artistId,
                score: score
            }
        })
        let ratings = []
        //Good comments 
        ratings = ratings.concat(
            addCommentsByScore(newRatings, { min: 3, max: 5 }, goodArtistOpinions)
        )

        // Negative comments
        ratings = ratings.concat(
            addCommentsByScore(newRatings, { min: 1, max: 2 }, badArtistOpinions)
        )
        MockStore.storeRatings(ratings)
    }

    this.createReservationsForRoom = (room) => { 
        const qty = faker.random.number({min: 1, max: 20})
        const users = pickMany(MockStore.getArtists(),qty ).map((artist) => artist.user)
        users.forEach((user, idx, arr) => {
            this.createReservationsForRoomAndUser(room, user)
        })
    }

    this.createReservationsForRoomAndUser = (room, user) => {
        const daysLater = faker.random.number({min: 0, max: 30})
        const start =  faker.date.soon(daysLater)
        const end = faker.date.soon(0, start) 
        MockStore.storeReservation({
            id: uuid(),
            start: start,
            end:  end,
            user:  user,
            room: room
        })
    }


}



