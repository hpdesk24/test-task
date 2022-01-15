import { Page } from '@playwright/test';
import { LONG_TIMEOUT, SHORT_TIMEOUT } from '../../data/general-data';
import { generateRandomCardData } from '../../helpers/common-helper';
import { AuthorizePaymentModal } from '../elements/authorize-payment-pop-up.po';


export class PaymentPage {

    readonly totalAmount = this.page.locator('#ProductSummary-totalAmount');
    readonly cardNumberInput = this.page.locator('#cardNumber');
    readonly cardExpiryInput = this.page.locator('#cardExpiry');
    readonly cvcInput = this.page.locator('#cardCvc');
    readonly cardNameInput = this.page.locator('#billingName');
    readonly submitButton = this.page.locator('[data-testid="hosted-payment-submit-button"]');
    readonly declineCardMessage = this.page.locator('[role="alert"]:has-text("Your card has been declined.")')
    readonly authorizeModal: AuthorizePaymentModal;

    constructor(private page: Page) {
        this.authorizeModal = new AuthorizePaymentModal(
            this.page.frameLocator('div iframe')
                .frameLocator('#challengeFrame')
                .frameLocator('.FullscreenFrame'));
    }

    async fillInPaymentDetails(cardNumber: string): Promise<void> {
        const data = generateRandomCardData();
        await this.cardNumberInput.waitFor({ state: "visible", timeout: SHORT_TIMEOUT })
        await this.cardNameInput.type('Test', { delay: 100 });
        await this.cardNumberInput.type(cardNumber, { delay: 100 });
        await this.cardExpiryInput.type(data.expiry, { delay: 100 });
        await this.cvcInput.type(data.cvc, { delay: 100 });
    }

    async isDeclineCardMessageShown(): Promise<boolean> {
        await this.declineCardMessage.waitFor({ state: "visible", timeout: LONG_TIMEOUT });
        return this.declineCardMessage.isVisible();
    }
}