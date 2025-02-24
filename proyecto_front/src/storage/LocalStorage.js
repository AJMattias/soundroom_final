
export const STORAGE_JWT_KEY = "jwt_key"

export const STORAGE_ENDPOINT = "network_endpoint"

export const STORAGE_ARTIST_PROFILE = "profile_artist"

export const STORAGE_USER = "user"

export const STORAGE_ROOMOWNED = "room"

export const STORAGE_NEWPASSWORD = "new_password"

/**
 *  Esta clase nos permite guardar de manera genérica datos del usuario locales.
 *  Por ejemplo, nos va a permitir guardar el jwt token del usuario logueado, 
 *  de manera análoga a las cookies de web.
 */
export const LocalPhoneStorage = new function (){
    var cache = {}

    this.set = async function (key, value) {
       cache[key] = value
    }

    this.get = function(key) {
        return cache[key]
    }
    this.reset = function () {
        for(let key in cache) {
            cache[key] = undefined
        }
    }
}()

export const getLoggedUser = () => {
    return LocalPhoneStorage.get(STORAGE_USER)
}

export const getRoomCreated = () => {
    return LocalPhoneStorage.get(ROOM_STORAGEOWNED)
    //setear localphonestorage roomstorage
    LocalPhoneStorage.set()
}


//gemini:
// Función para inicializar el estado de cambio de contraseña
export const initNewPasswordStatus = () => {
    console.log('setting newPasswordStatus started to true');
    const existingStatus = JSON.parse(localStorage.getItem(STORAGE_NEWPASSWORD));

    if (existingStatus) {
        // Si el objeto ya existe, solo modifica 'started'
        existingStatus.started = true;
        localStorage.setItem(STORAGE_NEWPASSWORD, JSON.stringify(existingStatus));
    } else {
        // Si el objeto no existe, crea uno nuevo con 'started' true, 'newPasswordStatus' false y 'token' vacío
        const obj = { started: true, newPasswordStatus: false, token: '' };
        localStorage.setItem(STORAGE_NEWPASSWORD, JSON.stringify(obj));
    }
};

// Función para obtener el objeto de estado de cambio de contraseña
export const getNewPasswordStatus = () => {
    const value = localStorage.getItem(STORAGE_NEWPASSWORD);
    if (value === null) {
        return { started: false, newPasswordStatus: false, token: '' }; // Valores predeterminados con token vacío
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        console.error("Error parsing new_password from localStorage:", error);
        return { started: false, newPasswordStatus: false, token: '' }; // Manejo de error con token vacío
    }
};

// Función para establecer el valor de newPasswordStatus
export const setNewPasswordStatus = (newPasswordStatus) => {
    console.log(`setting newPasswordStatus a ${newPasswordStatus}`);
    const obj = getNewPasswordStatus(); // Obtener el objeto actual
    obj.newPasswordStatus = newPasswordStatus; // Actualizar newPasswordStatus
    localStorage.setItem(STORAGE_NEWPASSWORD, JSON.stringify(obj));
};

export const setTokenLocalStorage = (token) => {
    console.log('token a guardar:', token);
    const obj = getNewPasswordStatus();
    obj.token = token;
    localStorage.setItem(STORAGE_NEWPASSWORD, JSON.stringify(obj));
};

// Funciones para simplificar el uso de setNewPasswordStatus.
export const setPasswordChangeTrue = () => {
    setNewPasswordStatus(true);
};

export const setPasswordChangeFalse = () => {
    setNewPasswordStatus(false);
};

// Funcion que solo retorna el valor booleano de newPasswordStatus.
export const getPasswordChangeStatus = () => {
    return getNewPasswordStatus().newPasswordStatus;
};

export const getTokenLocalStorage = () => {
    const obj = getNewPasswordStatus();
    return obj.token;
};

export const getNewPasswordStatusWithToken = () => {
    return getNewPasswordStatus();
};

// Funciones para simplificar el uso
export const startNewPasswordFlow = () => {
    initNewPasswordStatus();
};

export const resetNewPasswordFlow = () => {
    setPasswordChangeFalse();
};


// chatgpt
// // Función para guardar datos en localStorage
// export const setNewPasswordStatus = (value) => {
//     localStorage.setItem(STORAGE_NEWPASSWORD, JSON.stringify(value));
// };

// // Función para obtener datos de localStorage
// export const getNewPasswordStatus = () => {
//     return JSON.parse(localStorage.getItem(STORAGE_NEWPASSWORD)) || false;
// };