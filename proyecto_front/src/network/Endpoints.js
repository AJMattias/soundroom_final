
import {LocalPhoneStorage, STORAGE_ENDPOINT} from '../storage/LocalStorage'

export const LOCALHOST_ENDPOINT = "http://localhost:3000"

export function getBaseUrl() {
    const stored = LocalPhoneStorage.get(STORAGE_ENDPOINT) 
    return stored ? stored : LOCALHOST_ENDPOINT
}