import { APIRequestContext } from "@playwright/test";
import { EMAIL_RETRY_TIMEOUT, MAIL_API_BASEURL } from "../data/general-data";

interface MailsacMessage {
  _id: string;
  subject: string;
  read: boolean | null;
  links: string[];
}

export class MailSac {
  constructor(private request: APIRequestContext) {}

  // Fetch required sign-in link
  // if `unread` provided will retry up to 6 times with SHORT_TIMEOUT delay to wait for unread email in mailbox
  // throws error if mail is not found, sets found mail to 'read' state
  async getSignInLinkFromEmail(
    mailbox: string,
    unread?: boolean
  ): Promise<string> {
    let message: MailsacMessage;
    if (unread) {
      message = await this.getLastMessage(mailbox, unread);
      let retryCount = 6;
      while (message === undefined && retryCount > 0) {
        console.log(
          `Mail not yet received, retry in ${EMAIL_RETRY_TIMEOUT} ms, retry count - ${retryCount}`
        );
        await new Promise((r) => setTimeout(r, EMAIL_RETRY_TIMEOUT));
        message = await this.getLastMessage(mailbox, unread);
        retryCount--;
      }
    } else {
      message = await this.getLastMessage(mailbox);
    }
    if (!message)
      throw Error(`No mail was found with specified parameters: ${mailbox}`);

    await this.setMessageToRead(mailbox, message._id);
    return message.links[1];
  }

  //Set message to read
  private async setMessageToRead(
    mailbox: string,
    messageID: string
  ): Promise<void> {
    await this.request.put(
      `${MAIL_API_BASEURL}/addresses/${mailbox}/messages/${messageID}/read/true`,
      { headers: { "Mailsac-Key": process.env.MAIL_API_KEY } }
    );
  }

  //Get all messages
  private async getAllMessagesAsJson(
    mailbox: string
  ): Promise<MailsacMessage[]> {
    const allMessages = await this.request.get(
      `${MAIL_API_BASEURL}/addresses/${mailbox}/messages`,
      { headers: { "Mailsac-Key": process.env.MAIL_API_KEY } }
    );
    return allMessages.json();
  }

  // Get last message with required subject, optionally - unread
  private async getLastMessage(
    mailbox: string,
    unread?: boolean
  ): Promise<MailsacMessage | undefined> {
    const allMessages = await this.getAllMessagesAsJson(mailbox);
    return allMessages.filter((mail) => {
      return (
        mail.subject === "Sign in to qa-challenge-tabeo.vercel.app" &&
        (unread ? mail.read !== true : true)
      );
    })[0];
  }
}
