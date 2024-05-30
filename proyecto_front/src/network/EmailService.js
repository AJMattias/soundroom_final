import { api } from "./ApiClient";

class EmailService {
    async sendEmailToUser(user, message) {
        await api.post("/email/send", {
            to: user.email,
            message: message
        })
    }
}

export const emailService = new EmailService()