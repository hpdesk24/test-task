import { Page } from '@playwright/test';
import { LoginModal } from '../elements/login-modal.po';
import { BasePage } from './base-page.po';


export class MainPage extends BasePage {

    readonly loginModal: LoginModal
    readonly monthlyPaymentButton = this.page.locator('button:has-text("Pay £20/mo")')
    readonly fullPaymentButton = this.page.locator('button:has-text("Pay £220")')

    constructor(page: Page) {
        super(page);
        this.loginModal = new LoginModal(page);
    }

    open(): Promise<void> {
        return this.navigateTo('https://qa-challenge-tabeo.vercel.app');
    }
}