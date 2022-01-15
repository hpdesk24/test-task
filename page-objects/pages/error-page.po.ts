import { Page } from '@playwright/test';


export class ErrorPage {

    readonly errorMessage = this.page.locator('.error h1')

    constructor(private page: Page) {

    }
}