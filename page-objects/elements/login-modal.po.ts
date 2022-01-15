import { Page } from "@playwright/test";
import { SHORT_TIMEOUT } from "../../data/general-data";

export class LoginModal {
    readonly emailTextBox = this.page.locator('input[type="email"]');
    readonly singInWithEmailBtn = this.page.locator('button:has-text("Sign in with email")');
    readonly singInWithGglBtn = this.page.locator('button:has-text("Sign in with Google")');
    readonly emailSentText = this.page.locator('h3:has-text("Check your email")');

    constructor(private page: Page) { }

    async signInWithEmail(email: string): Promise<void> {
        await this.emailTextBox.type(email);
        await this.singInWithEmailBtn.click();
    }

    async isEmailSentShown(): Promise<boolean> {
        await this.emailSentText.waitFor({ state: "visible", timeout: SHORT_TIMEOUT });
        return this.emailSentText.isVisible();
    }
}