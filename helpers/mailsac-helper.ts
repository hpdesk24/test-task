import { APIRequestContext } from "@playwright/test";
import { EMAIL_RETRY_TIMEOUT, MAIL_API_BASEURL } from "../data/general-data";

export class MailSac {

    constructor(private request: APIRequestContext) { }

    private async getAllMessagesAsJson(mailbox: string): Promise<any[]> {
        const allMessages = await this.request.get(
            `${MAIL_API_BASEURL}/addresses/${mailbox}/messages`,
            { headers: { "Mailsac-Key": process.env.MAIL_API_KEY } }
        )
        return allMessages.json()
    }

    // Filter messages with required subject, and optionally received after certain date  
    private async filterMessages(mailbox: string, date?: number): Promise<any[]> {
        const allMessages = await this.getAllMessagesAsJson(mailbox);
        return allMessages.filter(
            (mail) => {
                return mail.subject === 'Sign in to qa-challenge-tabeo.vercel.app'
                    && (date ? Date.parse(mail.received) >= date : true)
            })
    }

    // Fetch required sign-in link, will retry up to 6 times with SHORT_TIMEOUT delay to find mail
    // throws error if mail is not found
    async getSignInLinkFromEmail(mailbox: string, date?: number): Promise<string> {
        let message = await this.filterMessages(mailbox, date);
        let retryCount = 6;
        while (message.length < 1 && retryCount > 0) {
            console.log(`Mail not yet received, retry in ${EMAIL_RETRY_TIMEOUT} ms, retry count - ${retryCount}`)
            await new Promise(r => setTimeout(r, EMAIL_RETRY_TIMEOUT));
            message = await this.filterMessages(mailbox, date);
            retryCount--;
        }
        if (message.length === 0)
            throw Error(`No mail was found with specified parameters: ${mailbox} ${date}`)
        return message[0].links[1];
    }
}