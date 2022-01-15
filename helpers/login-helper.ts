import { APIRequestContext, Page } from "@playwright/test";
import { SHORT_TIMEOUT } from "../data/general-data";
import { MailSac } from "./mailsac-helper";
import { RequestHelper } from "./request-helper";


export async function loginViaApi(email: string, request: APIRequestContext, page: Page): Promise<void> {
    const mailSac = new MailSac(request);
    const requestHelper = new RequestHelper(request);

    await requestHelper.postEmailLink(email);
    await page.waitForTimeout(SHORT_TIMEOUT);
    const singInLink = await mailSac.getSignInLinkFromEmail(email, true);
    await page.goto(singInLink)
}