import axios from 'axios';

// Replace with your actual Telegram Bot Token from @BotFather
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Your Telegram Chat ID (where you receive messages)
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

/**
 * Send OTP code via Telegram to Admin
 * In production, you'd send directly to user's Telegram
 * For now, OTP goes to your Telegram for verification
 */
export const sendOtpToTelegram = async (
  phone: string,
  code: string
): Promise<boolean> => {
  try {
    const message = `
🔐 *BetFace2Face - OTP Verification*
    
📱 Phone: \`${phone}\`
🔢 OTP Code: *${code}*
⏰ Expires in: 5 minutes
    
_Use this code to verify your phone number._
    `;

    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });

    return response.data.ok;
  } catch (error: any) {
    console.error('Telegram send failed:', error.message);
    // Even if Telegram fails, we still return the OTP via API response (demo mode)
    return false;
  }
};

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send welcome message after successful registration
 */
export const sendWelcomeMessage = async (
  phone: string,
  nickname: string
): Promise<void> => {
  try {
    const message = `
🎉 *New User Registered!*

👤 Nickname: *${nickname}*
📱 Phone: \`${phone}\`
🕐 Time: ${new Date().toLocaleString()}
    `;

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error('Welcome message failed');
  }
};