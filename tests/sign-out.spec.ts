
import { test, expect } from '@playwright/test';
import { loginViaApi } from '../helpers/login-helper';
import { MailSac } from '../helpers/mailsac-helper';
import { ErrorPage } from '../page-objects/pages/error-page.po';
import { MainPage } from '../page-objects/pages/main-page.po';
import data from '../data/sign-in-data'

test("Sign out flow", async ({ page, request }) => {
    const mainPage = new MainPage(page);
    const mailHelper = new MailSac(request);
    const errorPage = new ErrorPage(page);

    await test.step('Login', async () => {   
        await page.context().clearCookies();
        await loginViaApi(data.user2, request, page);
    })

    await test.step('Should sign out user', async () => {
        await mainPage.header.signOut();
        expect(await mainPage.header.signInButton.isVisible()).toBe(true);
    })

    await test.step('Should not sign in with expired link', async () => {
        const link = await mailHelper.getSignInLinkFromEmail(data.user2);
        await mainPage.navigateTo(link);
        expect(await errorPage.errorMessage.innerText()).toEqual('Unable to sign in')
    })
})