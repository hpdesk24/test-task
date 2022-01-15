import { test, expect } from '@playwright/test';
import { MailSac } from '../helpers/mailsac-helper';
import { MainPage } from '../page-objects/pages/main-page.po';
import data from '../data/sign-in-data'

test.describe("Sign in flow", () => {
    let mainPage: MainPage;

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.header.signInButton.click();
    })

    //This test works only in headed mode d/t google changing oath screen view in headless mode, so it is skipped by default
    //This is generally bad practice and not advised to automate logging with google via UI automation, but i added this test to show that it works
    test.skip('Should successfully sign in with google account', async ({ page }) => {

        await mainPage.loginModal.singInWithGglBtn.click();

        //fill in google form, row locators here, no separate po class for google OAUth form created
        await page.locator('#identifierId').type(data.googleEmail);
        await page.locator('#identifierNext').click();
        await page.locator('input[type="password"]').waitFor();
        await page.locator('input[type="password"]').type(data.googlePassword);
        await page.locator('#passwordNext').click();

        expect(await mainPage.header.getLoggedInUser()).toEqual("Pavlo ForTest");
    });

    test('Should successfully sign in via email link', async ({ request }) => {
        const mailHelper = new MailSac(request);
        const dateForEmail = Date.now();

        await test.step('Should send email', async () => {
            await mainPage.loginModal.signInWithEmail(data.user1);
            expect(await mainPage.loginModal.isEmailSentShown()).toBeTruthy()
        })

        await test.step('Should sign in with link from email', async () => {
            const signInLink = await mailHelper.getSignInLinkFromEmail(data.user1, dateForEmail);
            await mainPage.navigateTo(signInLink);
            expect(await mainPage.header.getLoggedInUser()).toEqual(data.user1);
        })
    });
})
