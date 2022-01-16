import { Page } from "@playwright/test";
import { LONG_TIMEOUT } from "../../data/general-data";

export class PaymentSuccessPage {
  readonly paymentSuccessText = this.page.locator('h1:has-text("Thank you!")');

  constructor(private page: Page) {}

  waitForPaymentSuccessMessage(): Promise<void> {
    return this.paymentSuccessText.waitFor({
      state: "visible",
      timeout: LONG_TIMEOUT,
    });
  }
}
