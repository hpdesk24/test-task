import { APIRequestContext } from "@playwright/test";
import { APP_API_BASEURL } from "../data/general-data";

export class RequestHelper {

    constructor(private request: APIRequestContext) { }

    async postEmailLink(mailbox: string): Promise<void> {
        const csrf = await this.getCsrf();
        await this.request.post(
            APP_API_BASEURL + '/auth/signin/email?',
            {
                form: {
                    email: mailbox,
                    csrfToken: csrf
                }
            }
        )
    }

    private async getCsrf(): Promise<string> {
        const csrfResponse = await (await this.request.get(
            APP_API_BASEURL + '/auth/csrf'
        )).json()
        return csrfResponse["csrfToken"]
    }
}