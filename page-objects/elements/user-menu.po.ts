import { Page } from "@playwright/test";
import { SHORT_TIMEOUT } from "../../data/general-data";

export class Header {
  readonly signInButton = this.page.locator('button:has-text("Sign in")');
  readonly loggedUser = this.page.locator("span.text-sm");
  readonly userMenuButton = this.page.locator("button.rounded-full");
  readonly signOutButton = this.page.locator('button:has-text("Sign out")');

  constructor(private page: Page) {}

  async getLoggedInUser(): Promise<string> {
    return this.loggedUser.textContent();
  }

  async signOut(): Promise<void> {
    await this.userMenuButton.click();
    await this.signOutButton.click();
    await this.signInButton.waitFor({
      state: "visible",
      timeout: SHORT_TIMEOUT,
    });
  }
}
