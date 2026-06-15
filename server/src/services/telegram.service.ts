import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const API_ID = parseInt(process.env.TELEGRAM_API_ID || "0");
const API_HASH = process.env.TELEGRAM_API_HASH || "";
const PHONE = process.env.TELEGRAM_PHONE || "";
const SESSION = process.env.TELEGRAM_SESSION || "";

let client: TelegramClient | null = null;
let connected = false;

export async function connectTelegram(): Promise<void> {
  console.log("DEBUG: API_ID=" + API_ID + " HASH=" + (API_HASH ? "yes" : "no") + " SESSION=" + (SESSION ? "yes" : "no"));

  if (!API_ID || !API_HASH || !SESSION) {
    console.log("Telegram not configured");
    return;
  }

  try {
    client = new TelegramClient(new StringSession(SESSION), API_ID, API_HASH, {});
    await client.connect();
    connected = true;
    console.log("Telegram connected as: " + PHONE);
  } catch (err: any) {
    console.log("Telegram error: " + err.message);
  }
}

export async function sendOTP(toPhone: string, otp: string): Promise<boolean> {
  console.log("OTP for " + toPhone + ": " + otp);

  if (!connected || !client) {
    console.log("Not connected - OTP in console");
    return true;
  }

  try {
    await client.sendMessage(toPhone, { message: "Bet2Face OTP: " + otp });
    console.log("OTP SENT to " + toPhone);
    return true;
  } catch (err: any) {
    console.log("Send error: " + err.message);
    return true;
  }
}
