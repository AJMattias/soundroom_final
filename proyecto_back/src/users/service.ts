import  * as dao from "./dao"
import { UserDto, 
         CreateUserDto, 
         LoginDto,
         LoginResponseDto, 
         CreateUserDtoTwo,
         LoginWithTokenDto}  from "./dto"
import {User, UserModel} from "./models"
import {AuthenticationException, AuthorizationException, ServerException} from "../common/exception/exception"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import * as Email from "../server/MailCtrl"
import { passwordTokens } from "./password_reset"
dotenv.config()
import { ultimoDia } from "../dateUtils/dateUtils"
//import { ReporteDto } from "../reporte/reporteDto";
import { Reporte } from "../reporte/modelReporte";
import { ReporteUsersDto } from "../reporte/reporteDto"
import { SalaDeEnsayoModel } from "../sala_de_ensayo/model"
import { StringLiteral } from "typescript"


export class UsersService{
    /**
     * El dao que usaremos internamente para acceder a la base de datos.
     * @param {dao.UsersDao} usersDao 
     */
    dao : dao.UsersDao;
    constructor(usersDao : dao.UsersDao){
        this.dao = usersDao
    }
    /***
     * Guarda un usuario en la base de datos y retorna el usuario creado
     * TODO : validar
     */
   async createUser(dto : CreateUserDto) : Promise<UserDto>{
        const user = await this.dao.store({
            name:  dto.name,
            last_name : dto.last_name,
            password : dto.password,
            email: dto.email,
            createdAt: new Date(),
            image_id: undefined,
            idPerfil: dto.idPerfil as unknown as string,
            idArtistType: dto.idArtistType as unknown as string,
            idArtistStyle: dto.idArtistStyle as unknown as string,
            enabled: "habilitado",
            userType: dto.userType,
            idSalaDeEnsayo: dto.idSalaDeEnsayo,
            tipoArtista: dto.tipoArtista

        })
        await this.sendMailPiola(user.email, "Usted ha creado la cuenta exitosamente. Gracias por elegir SoundRoom")
        return  this.mapToDto(user)
    }
    async createUser2(dtotwo : CreateUserDtoTwo) : Promise<UserDto>{
        return  this.mapToDto( 
            await this.dao.storetwo({
                name:  dtotwo.name,
                last_name : dtotwo.last_name,
                password : dtotwo.password,
                email: dtotwo.email,
                createdAt: new Date(),
                image_id: undefined,
            })
        )
    }
    /**
     * Busca a un usuario a partir de una ID. 
     * Tira un ModelNotFoundException si no encuentra a la Entidad 
     * @param id {string} la id  del usuario a buscar
     * @returns {UserDto} el usuario encontrado.
     * @throws {ModelNotFoundException}
     */
    async findUserById(id : string) : Promise<UserDto>{
        const user = await this.dao.findById(id)
        return this.mapToDto(user)
    }
    async findUserByEmail(email : string) : Promise<UserDto>{
        const user = await this.dao.findByEmail(email)
        return this.mapToDto(user)
    }
    /**
     *  Funcion de prueba que nos devuelve todos los usuarios en la base de datos
     */
    async getAllUsers() : Promise<Array<UserDto>>{
        const users = await this.dao.getAll()
        return users.map((user: User) => {
            return this.mapToDto(user)
        })
    }

    // async getNewUsersReport(fechaI: string, fechaH: string) : Promise<Array<ReporteUsersDto>>{
    //     let dateInit = new Date(fechaI);
    //     let dateEnd = new Date(fechaH);
    //     let reporteDto = []
        
    //     // Ordenamos las fechas para que la mas antigua sea la primera
    //     if (dateInit > dateEnd){
    //         var temp = dateInit;
    //         dateInit = dateEnd;
    //         dateEnd = temp;
    //     }
    //     // obtener mes de cada fecha
    //     const [yearI, monthI, dayI, ] = fechaI.split('/');
    //     const [yearH, monthH, dayH, ] = fechaI.split('/');

    //     //castear string to number
    //     const mesI = parseInt(monthI)
    //     const mesH = parseInt(monthH)

    //     for(let i=mesI;i<=mesH;i++){
            
    //         //armar las fechas para buscar en el mismo mes fechaI y fechaH
    //         const diaI = 
    //         const reportesUsuarios = await this.dao.findUsersBetwenDates(dateInit, dateEnd)

    //         //contar longitud del array y armar el dto con el mes y cantidad

    //         //añadir a reporteDto cada encontrado
    //     }
    
    //     const reportesUsuarios = await this.dao.findUsersBetwenDates(dateInit, dateEnd)
    //     // mapear dto con mes y cantidad
    //     return reportesUsuarios.map((data)=>this.mapToReporte(data));
    // }
    //     return users.map((user: User) => {
    //         return this.mapToDto(user)
    //     })
    // }

    async getAllUsersPp() : Promise<Array<UserDto>>{
        const users = await this.dao.getAllUserPerfilPermiso()
        return users.map((user: User) => {
            return this.mapToDto(user)
        })
    }



    async updateUser(userId: string, dto : CreateUserDto) : Promise<UserDto>{
        if(dto.enabled === "baja"){
            console.log("service baja: ", dto.enabled)
            return  this.mapToDto( 
                await this.dao.bajaUser(userId,{
                    name:  dto.name,
                    last_name : dto.last_name,
                    email: dto.email,
                    password : dto.password,
                    createdAt: dto.createdAt,
                    image_id: undefined,
                    enabled: dto.enabled,
                    idPerfil: dto.idPerfil as unknown as string,
                    idArtistType: dto.idArtistType as unknown as string,
                    idArtistStyle: dto.idArtistStyle as unknown as string,
                    userType: dto.userType,
                    idSalaDeEnsayo: dto.idSalaDeEnsayo,
                    tipoArtista: dto.tipoArtista
                }))
        }
        if(dto.enabled === "deshabilitado"){
            return  this.mapToDto( 
                await this.dao.disableUser(userId,{
                    name:  dto.name,
                    last_name : dto.last_name,
                    email: dto.email,
                    password : dto.password,
                    createdAt: dto.createdAt,
                    deletedAt: new Date(),
                    image_id: undefined,
                    enabled: dto.enabled,
                    idPerfil: dto.idPerfil as unknown as string,
                    idArtistType: dto.idArtistType as unknown as string,
                    idArtistStyle: dto.idArtistStyle as unknown as string,
                    userType: dto.userType,
                    idSalaDeEnsayo: dto.idSalaDeEnsayo,
                    tipoArtista: dto.tipoArtista
                }))
        } else {
            console.log('service update user, dtoUser: ', dto)
        return  this.mapToDto( 
            await this.dao.updateUser(userId,{
                name:  dto.name,
                last_name : dto.last_name,
                email: dto.email,
                password : dto.password,
                createdAt: dto.createdAt,
                deletedAt: dto.deletedAt,
                image_id: undefined,
                enabled: dto.enabled,
                idPerfil: dto.idPerfil,
                idArtistType: dto.idArtistType as unknown as string,
                idArtistStyle: dto.idArtistStyle as unknown as string,
                userType: dto.userType,
                idSalaDeEnsayo: dto.idSalaDeEnsayo,
                tipoArtista: dto.tipoArtista
            })
        )}
    }
    async updatePassword(userId: string, dto : CreateUserDto) : Promise<UserDto>{
        const passwordU = dto.password
        return  this.mapToDto( 
            await this.dao.updatePassword(userId,passwordU)
        )
    }

    async updateAddSala(userId: string, dto : CreateUserDto) : Promise<UserDto>{
        const idSala = dto.idSalaDeEnsayo
        return  this.mapToDto( 
            await this.dao.updateUserSalas(userId, idSala)
        )
    }

  

    /**
     *  Funcion para logearse y obtener un token JWT .
     *  Este token se va a usar en todas las requests para un usuario autenticado.
     */
    async login(email : string , password: string) : Promise<LoginResponseDto>{
        const user = await this.dao.findByEmail(email)
        if(user.password != password){
            throw new AuthenticationException()
        }
        const userDto =  this.mapToDto(user)
        const jwtKey =  process.env.JWT_KEY 
        if(!jwtKey){
            console.error("JWT_KEY missing from .env file. Please create one or copy it from .env-demo")
            throw new ServerException()
        }
        return {
            user: userDto,
            token: jwt.sign(userDto, jwtKey)
        }
    }

    async loginWithToken(email: string, token: string): Promise<LoginResponseDto> {
        const user  = await this.dao.findByEmail(email)
        if(!passwordTokens.checkToken(email, token)) {
            throw new AuthorizationException()
        }
        const userDto =  this.mapToDto(user)
        const jwtKey =  process.env.JWT_KEY 
        if(!jwtKey){
            console.error("JWT_KEY missing from .env file. Please create one or copy it from .env-demo")
            throw new  ServerException()
        }
        return {
            user: userDto,
            token: jwt.sign(userDto, jwtKey)
        }    
    }

    async resetPassword(email: string): Promise<LoginWithTokenDto> {
        const user  = await this.dao.findByEmail(email)
        const token = passwordTokens.createToken(email)
        await this.sendMail(user.email, "Su código de login es "+token)
        return {
            email: email,
            token: token
        }
    }

    /**
     * Funcion quu nos permite mapear las entidades de dominio User en UserDto para devolver en el json.
     * @param user {User} clase de dominio de User a convertir
     * @returns {UserDto} el dto a devolver como json por routes
     */
    mapToDto(user : User) : UserDto{
        return {
            name: user.name,
            last_name: user.lastName,
            email: user.email,
            password: user.password,
            idPerfil: user.idPerfil, 
            idArtistType: user.idArtistType, 
            idArtistStyle: user.idArtistStyle,
            idSalaDeEnsayo: user.idSalaDeEnsayo,
            id: user.id,
            isAdmin: user.isAdmin,
            enabled: user.enabled,
            createdAt: user.createdAt,
            deletedAt: user.deletedAt,
            userType: user.userType,
            tipoArtista: user.tipoArtista
        }
    }
    mapToReporte(reporte: Reporte): ReporteUsersDto{
        return{
            mes: reporte.mes,
            cantidad: reporte.cantidad
        }
    }

    async sendMailPiola(to: string, message: string) {
        const mailOptions = {
            from: 'soundroomapp@gmail.com',
            to: to,
            subject: "Registro de usuarios",
            html: '<div id=":pf" class="a3s aiL "><table><tbody> <tr> <td style="padding:16px 24px"> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%"> <tbody> <tr> <td> <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="auto"> <tbody> <tr> <td> <img alt="Imagen de SoundRoom" border="0" height="70" width="70" src="https://fs-01.cyberdrop.to/SoundRoom_logo-X6fFVkX9.png" style="border-radius:50%;outline:none;color:#ffffff;max-width:unset!important;text-decoration:none" class="CToWUd"></a></td> </tr> </tbody> </table></td> </tr> <tr> <td> <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center" style="max-width:396px;padding-bottom:4px;text-align:center"> <tbody> <tr> <td><h2 style="margin:0;color:#262626;font-weight:400;font-size:16px;line-height:1.5">' + "Usted ha creado la cuenta exitosamente. Gracias por elegir SoundRoom" + '</h2></td> </tr> </tbody> </table></td> </tr></tbody></table></div>',
            text: message,
            //borrar todo html en caso de que se rompa je
            }
      await Email.sendEmailAsync(mailOptions)
    }

    async sendMail(to: string, message: string) {
        const mailOptions = {
            from: 'soundroomapp@gmail.com',
            to: to,
            subject: "Registro de usuarios",
            text: message,
            //borrar todo html en caso de que se rompa je
            }
      await Email.sendEmailAsync(mailOptions)
    }




// reportes

    daysInMonth (month: number, year: number) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
    }
    // intento mio incompleto
    // async reporteUserByDateRange(fechaI: string, fechaH: string): Promise<number>{
    //     // convertir string a Date:
    //     //https://bobbyhadz.com/blog/typescript-convert-string-to-date#convert-a-string-to-a-date-object-in-typescript
        
    //     const  fechaInicio = new Date(fechaI)
    //     const  fechaHasta= new Date(fechaH)
    //     const monthI = fechaInicio.getMonth()
    //     const monthH = fechaHasta.getMonth()
    //     let newObj = Intl.DateTimeFormat('en-US', {
    //         timeZone: "America/Argentina/Buenos_Aires"
    //      })
    //      let fir = newObj.format(fechaInicio)
    //      console.log(fir)
    //     console.log("Servicio, rango de fechas- Desde", fechaInicio, "hasta", fechaHasta)
    //     console.log("mes inicio: " , fechaInicio.getMonth(), "mes fin: ", fechaHasta.getMonth() )
    //     let dtoNewUsersReportes = []
    //     var contadorUsers = 0
        
    //     //luego contar por mes
    //     for(let i: number = monthI; i <=monthH ;i++){
    //         //crear fechas intermedias para buscar por mes
    //         console.log("mes: ", i)
    //         let fechaInicioIntermedia = new Date(fechaInicio)
    //         fechaInicioIntermedia.setDate(fechaInicio.getDate())
    //         fechaInicioIntermedia.setMonth(fechaInicio.getMonth()+1)   
    //         fechaInicioIntermedia.setFullYear(fechaInicio.getFullYear())
    //         console.log("fecha Inicio", fechaInicioIntermedia)
    //         let fechaHastaIntermedia = new Date()
    //         //check if mes es final, ver usar dia de fechaHasta
    //         if (i = monthH){
    //             console.log( "i = month")
    //             fechaHastaIntermedia = fechaHasta
    //         } 
            
    //         const diasmes = this.daysInMonth(i,  fechaHasta.getFullYear())
    //         fechaHastaIntermedia.setDate(diasmes)
    //         console.log("dias en el mes", diasmes)
    //         console.log("fecha Hasta", fechaHastaIntermedia)
                
    //         //no funciona, de vuelve 0
    //         const countUsers: number = await SalaDeEnsayoModel.countDocuments({
    //             //createdAt: { $lte: new Date('2019-01-01'), $gte: new Date('2020-01-01') }
    //             createdAt: { $gte: fechaInicioIntermedia, $lte: fechaHastaIntermedia }
    //         })
    //         const reporteDto = this.mapToReporte({
    //             mes: i,
    //             cantidad: countUsers
    //         })
    //         console.log("mes: ", i, "typeOf: ",  typeof i)
    //         dtoNewUsersReportes.push(reporteDto)
            
            
        

    //         console.log(countUsers)
    //         contadorUsers = countUsers
        
    //     // return this.mapToReporte((reporte: Reporte) => {
            
    //     // })
    //     }
    // console.log(dtoNewUsersReportes)
    // return contadorUsers
    // }
    

    // funcionando: Función para obtener la cantidad de documentos por mes entre dos fechas
    async obtenerCantidadDocumentosPorMes(fechaInicio: string, fechaFin: string): Promise<{ mes: string, cantidad: number }[]> {
        try {
            // Parsear fechas
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            console.log("fecha Inicio", fechaInicioObj)
            console.log("fecha Fin", fechaFinObj)
            // Obtener la diferencia en meses
            const diffMeses = (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinObj.getMonth() - fechaInicioObj.getMonth() + 1;

            // Inicializar el array de resultados
            const resultados: { año: number, mes: string, cantidad: number }[] = [];

            // Consultar la cantidad de documentos por mes
            for (let i = 0; i < diffMeses; i++) {
                const fechaActual = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i, 1);
                const fechaSiguiente = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i + 1, 1);

                const cantidad = await UserModel.countDocuments({
                    createdAt: {
                        $gte: fechaActual,
                        $lt: fechaSiguiente
                    }
                });

                const nombreDelMes = this.obtenerNombreDelMes(fechaActual.getMonth());
                resultados.push({ año: fechaActual.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad });
            }

            return resultados;
        } catch (error) {
            console.error('Error al obtener la cantidad de documentos por mes:', error);
            throw error;
        }
        
        // intento uno
        // try {
        //     const inicio = new Date(fechaInicio);
        //     const fin = new Date(fechaFin);
        //     const resultados = await SalaDeEnsayoModel.aggregate([
        //       {
        //         $match: {
        //           createdAt: { $gte: inicio, $lte: fin }
        //         }
        //       },
        //       {
        //         $group: {
        //           _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        //           count: { $sum: 1 }
        //         }
        //       },
        //       {
        //         $project: {
        //           _id: 0,
        //           mes: '$_id',
        //           cantidad: '$count'
        //         }
        //       }
        //     ]);

        //     console.log(resultados)
        // }catch (error) {
        //     throw new Error('Error al consultar los documentos por mes');
    }
    
    async obtenerArtistasNuevosPorMes(fechaInicio: string, fechaFin: string): Promise<{ mes: string, cantidad: number }[]> {
        try {
            // Parsear fechas
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            console.log("fecha Inicio", fechaInicioObj)
            console.log("fecha Fin", fechaFinObj)
            // Obtener la diferencia en meses
            const diffMeses = (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinObj.getMonth() - fechaInicioObj.getMonth() + 1;

            // Inicializar el array de resultados
            const resultados: { año: number, mes: string, cantidad: number }[] = [];

            // Consultar la cantidad de documentos por mes
            for (let i = 0; i < diffMeses; i++) {
                const fechaActual = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i, 1);
                const fechaSiguiente = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i + 1, 1);

                const cantidad = await UserModel.countDocuments({
                    createdAt: {
                        $gte: fechaActual,
                        $lt: fechaSiguiente
                    },
                    userType:"artista"
                });
                const nombreDelMes = this.obtenerNombreDelMes(fechaActual.getMonth());
                resultados.push({ año: fechaActual.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad });
            }
            
            console.log(resultados)
            return resultados;
        } catch (error) {
            console.error('Error al obtener la cantidad de documentos por mes:', error);
            throw error;
        }
    }
    // helper parsea
    obtenerNombreDelMes = (mes: number): string => {
        const nombresDeMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return nombresDeMeses[mes];
    }

    async obtenerUsuariosActivosPorMes(fechaInicio: string, fechaFin: string): Promise<{ mes: string, cantidad: number }[]> {
        try {
            // Parsear fechas
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            console.log("fecha Inicio", fechaInicioObj)
            console.log("fecha Fin", fechaFinObj)
            // Obtener la diferencia en meses
            const diffMeses = (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinObj.getMonth() - fechaInicioObj.getMonth() + 1;

            // Inicializar el array de resultados
            const resultados: { año: number, mes: string, cantidad: number }[] = [];

            // Consultar la cantidad de documentos por mes
            for (let i = 0; i < diffMeses; i++) {
                const fechaActual = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i, 1);
                const fechaSiguiente = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i + 1, 1);

                const cantidad = await UserModel.countDocuments({
                    createdAt: {
                        $gte: fechaActual,
                        $lt: fechaSiguiente
                    },
                    enabled:"habilitado"
                });
                const nombreDelMes = this.obtenerNombreDelMes(fechaActual.getMonth());
                resultados.push({ año: fechaActual.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad });
            }
            
            console.log(resultados)
            return resultados;
        } catch (error) {
            console.error('Error al obtener la cantidad de documentos por mes:', error);
            throw error;
        }
    }


    async obtenerUsuariosBajaPorMes(fechaInicio: string, fechaFin: string): Promise<{ mes: string, cantidad: number }[]> {
        try {
            // Parsear fechas
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            console.log("fecha Inicio", fechaInicioObj)
            console.log("fecha Fin", fechaFinObj)
            // Obtener la diferencia en meses
            const diffMeses = (fechaFinObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinObj.getMonth() - fechaInicioObj.getMonth() + 1;

            // Inicializar el array de resultados
            const resultados: { año: number, mes: string, cantidad: number }[] = [];

            // Consultar la cantidad de documentos por mes
            for (let i = 0; i < diffMeses; i++) {
                const fechaActual = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i, 1);
                const fechaSiguiente = new Date(fechaInicioObj.getFullYear(), fechaInicioObj.getMonth() + i + 1, 1);

                const cantidad = await UserModel.countDocuments({
                    createdAt: {
                        $gte: fechaActual,
                        $lt: fechaSiguiente
                    },
                    enabled:"baja"
                });

                const nombreDelMes = this.obtenerNombreDelMes(fechaActual.getMonth());
                resultados.push({ año: fechaActual.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad });
            }
            
            console.log(resultados)
            return resultados;
        } catch (error) {
            console.error('Error al obtener la cantidad de documentos por mes:', error);
            throw error;
        }
    }

    async propietariosAlquilanSala(fechaInicioS: string, fechaFinS: string): Promise<{ mes: string, cantidad: number }[]> {
        const fechaInicioObj = new Date(fechaInicioS);
        const fechaFinObj = new Date(fechaFinS);
        try {
            const resultados: { mes: string, año: number, cantidad: number }[] = [];

            // Utilizamos un bucle para recorrer los meses entre las fechas de inicio y fin
            const currentDate = new Date(fechaInicioObj);
            while (currentDate <= fechaFinObj) {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth() + 1;
        
              // Utilizamos agregación para contar usuarios con salas de ensayo habilitadas en el mes actual
              const count = await UserModel.aggregate([
                { $lookup: { from: 'Sala_De_Ensayo', localField: 'idRoom', foreignField: '_id', as: 'salas' } }, // Unir usuarios con sus salas de ensayo
                { $unwind: '$salas' }, // Separar cada sala de ensayo en un documento independiente
                { $match: { 'salas.enabled': true } }, // Filtrar salas de ensayo habilitadas
                { $addFields: { mes: { $month: '$createdAt' }, año: { $year: '$createdAt' } } }, // Extraer mes y año de la fecha de creación del usuario
                { $match: { mes: month, año: year } }, // Filtrar por mes y año
                { $group: { _id: '$_id', count: { $sum: 1 } } }, // Contar usuarios
                { $group: { _id: null, total: { $sum: '$count' } } } // Sumar el total de usuarios
              ]);
        
              // Si no hay usuarios con salas de ensayo habilitadas en el mes actual, agregamos 0 al resultado
              const quantity = count.length > 0 ? count[0].total : 0;
              const nombreDelMes = this.obtenerNombreDelMes(currentDate.getMonth());
                resultados.push({ año: currentDate.getFullYear(), mes: //fechaActual.getMonth() + 1
                    nombreDelMes
                    , cantidad: quantity });
        
              // Avanzamos al siguiente mes
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
        
            // Devolvemos el array con los resultados por mes
            return resultados;
          } catch (error) {
            console.error('Error al contar usuarios con sala de ensayo habilitada por mes:', error);
            throw error;
        }
    }
    async propietariosAlquilanSala2(fechaInicioS: string, fechaFinS: string): Promise<{ mes: string, cantidad: number }[]> {
        const fechaInicioObj = new Date(fechaInicioS);
        const fechaFinObj = new Date(fechaFinS);
    
        try {
            const resultados: { mes: string, cantidad: number }[] = [];
    
            // Utilizamos un bucle para recorrer los meses entre las fechas de inicio y fin
            const currentDate = new Date(fechaInicioObj);
            while (currentDate <= fechaFinObj) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
    
                // Ajustamos las fechas de inicio y fin del mes actual
                const inicioMes = new Date(year, month - 1, 1);
                const finMes = new Date(year, month, 1);
    
                // Utilizamos agregación para contar usuarios con salas de ensayo habilitadas en el mes actual
                const count = await SalaDeEnsayoModel.aggregate([
                    {
                        $match: {
                            enabled: true,
                            createdAt: {
                                $gte: inicioMes,
                                $lt: finMes
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$idOwner"
                        }
                    },
                    {
                        $count: "total"
                    }
                ]);
    
                // Si no hay usuarios con salas de ensayo habilitadas en el mes actual, agregamos 0 al resultado
                const quantity = count.length > 0 ? count[0].total : 0;
                const nombreDelMes = this.obtenerNombreDelMes(currentDate.getMonth());
                resultados.push({ mes: nombreDelMes, cantidad: quantity });
    
                // Avanzamos al siguiente mes
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
    
            // Devolvemos el array con los resultados por mes
            return resultados;
        } catch (error) {
            console.error("Error al contar usuarios con sala de ensayo habilitada por mes:", error);
            throw error;
        }
    }

}
export const instance = new UsersService(dao.instance)