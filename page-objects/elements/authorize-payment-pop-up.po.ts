import { FrameLocator, Page } from "@playwright/test";
import { LONG_TIMEOUT } from "../../data/general-data";

export class AuthorizePaymentModal {

    readonly authorizeButton = this.root.locator('#test-source-authorize-3ds');


    constructor(private root: FrameLocator) { }

    async authorizePayment(): Promise<void> {
        await this.authorizeButton.waitFor({ state: "visible", timeout: LONG_TIMEOUT })
        await this.authorizeButton.click();
    }

}