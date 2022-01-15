import test, { expect } from "@playwright/test";
import { MainPage } from "../page-objects/pages/main-page.po";
import { PaymentPage } from "../page-objects/pages/payment-page.po";
import data from "../data/payment-data"
import { LONG_TIMEOUT } from "../data/general-data";
import { PaymentSuccessPage } from "../page-objects/pages/payment-success-page.po";

let mainPage: MainPage;
let paymentsPage: PaymentPage;
let paymentSuccessPage: PaymentSuccessPage;

test.describe('Payments - unauthorized user', () => {

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        mainPage = new MainPage(page);
        await mainPage.open();
    })

    test('Should not proceed to monthly payment for unauthorized user', async ({ page }) => {
        await mainPage.monthlyPaymentButton.click();
        expect(await mainPage.loginModal.emailTextBox.isVisible()).toBeTruthy();
    })

    test('Should not proceed to full payment for unauthorized user', async ({ page }) => {
        await mainPage.fullPaymentButton.click();
        expect(await mainPage.loginModal.emailTextBox.isVisible()).toBeTruthy();
    })

})

test.describe('Payments redirects', () => {

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        paymentsPage = new PaymentPage(page);
        await mainPage.open();
    })

    test('Should open correct payment screen for monthly subscription', async () => {
        await mainPage.monthlyPaymentButton.click();
        expect(await paymentsPage.totalAmount.innerText()).toEqual('£20.00\nper\nmonth')
    })

    test('Should open correct payment screen for full amount', async () => {
        await mainPage.fullPaymentButton.click();
        expect(await paymentsPage.totalAmount.innerText()).toEqual('£220.00')
    })
})

test.describe('Payment flow', () => {
    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        paymentsPage = new PaymentPage(page);
        paymentSuccessPage = new PaymentSuccessPage(page);
        await mainPage.open();
        await mainPage.fullPaymentButton.click();
    })

    test('Should successfully complete payment', async () => {
        //increase this test timeout, since it take more than 30 sec to complete flow
        test.setTimeout(60000);
        await paymentsPage.fillInPaymentDetails(data.successCard);
        await paymentsPage.submitButton.click();
        await paymentsPage.authorizeModal.authorizePayment();
        await paymentSuccessPage.waitForPaymentSuccessMessage();
        expect(await paymentSuccessPage.paymentSuccessText.isVisible()).toBeTruthy();
    })

    test('Should reject payment', async () => {
        test.setTimeout(60000);
        await paymentsPage.fillInPaymentDetails(data.failCard);
        await paymentsPage.submitButton.click();
        await paymentsPage.authorizeModal.authorizePayment();
        expect(await paymentsPage.isDeclineCardMessageShown()).toBeTruthy();
    })
})