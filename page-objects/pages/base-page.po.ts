import { Page } from "@playwright/test";
import { Header } from "../elements/user-menu.po";

export abstract class BasePage {
  readonly header: Header;

  constructor(protected page: Page) {
    this.header = new Header(page);
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
