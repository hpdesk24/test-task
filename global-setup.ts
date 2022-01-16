import { chromium } from "@playwright/test";
import { TEST_USER } from "./data/general-data";
import { loginViaApi } from "./helpers/login-helper";
import path from "path";
import dotenv from "dotenv";

export default async () => {
  dotenv.config();
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await loginViaApi(TEST_USER, context.request, page);
  await page
    .context()
    .storageState({ path: path.join(__dirname, "/state.json") });
  await context.close();
  await browser.close();
};
