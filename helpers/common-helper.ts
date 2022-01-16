export function generateRandomCardData(): { expiry: string; cvc: string } {
  const expiry = "01" + (new Date().getFullYear() + 2).toString().substring(2);
  const cvc = Math.floor(Math.random() * (999 - 100 + 1) + 100).toString();
  return { expiry, cvc };
}
