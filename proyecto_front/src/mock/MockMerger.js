import { ApiException } from "../exception/ApiException"
import { api } from "../network/ApiClient"

/**
 *  Clase para traer cosas de backend Y de los mocks, para realizar la migración de a poco desde el Mock a backend.
 */
class MockMerger {
    /**
     *  De forma similar al get de ApiClient, pero recibe dos parámetros: La url para el GET en backend y una función
     *  que debe hacer la búsqueda local usando MockStore.
     * 
     * @param {string} url La URL GET para traer el objeto del backend.
     * @param {Function} localSearch Una función para buscar en el MockStore el objeto deseado.
     */
    async get(url, localSearch) {
        let remote
        let mocked
        try {
            remote = await api.get(url)
        } catch (exception) {
            if(exception.error == "NOT_FOUND") {
                mocked = typeof(localSearch) == "function" ? localSearch() : undefined
            } else {
                console.error("ApiException "+exception.error)
                throw exception
            }
        }
        // Si no existe en ninguno de los dos lados simulamos una excepcion de not found
        if(!remote && !mocked) {
            throw new ApiException(404, "NOT_FOUND", "NOT_FOUND","The entity is not found in the backend or in mocks")
        }
        return remote ? remote : mocked
    }
}

export const merger = new MockMerger()