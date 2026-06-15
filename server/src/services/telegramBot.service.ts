import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; first_name: string; username?: string; };
    chat: { id: number; };
    text?: string;
  };
}

class TelegramBotService {
  // Store pending phone verifications
  private pendingPhones: Map<string, number> = new Map(); // phone -> chatId
  private pendingOTPs: Map<string, { code: string; expires: Date }> = new Map();

  async sendMessage(chatId: number | string, text: string): Promise<boolean> {
    try {
      await axios.post(`${API}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async handleUpdate(update: TelegramUpdate): Promise<void> {
    const msg = update.message;
    if (!msg?.text) return;

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const firstName = msg.from.first_name;

    console.log(`📩 Telegram: ${firstName} (${chatId}): ${text}`);

    // Command: /start
    if (text === '/start') {
      await this.sendMessage(chatId, 
        `👋 <b>Welcome to Bet2Face, ${firstName}!</b>\n\n` +
        `To register, send:\n` +
        `<code>/register +2519xxxxxxx</code>\n\n` +
        `Replace with your phone number.`
      );
      return;
    }

    // Command: /register +2519...
    if (text.startsWith('/register')) {
      const phone = text.replace('/register', '').trim();
      
      if (!phone || !phone.startsWith('+251')) {
        await this.sendMessage(chatId, '❌ Invalid format. Use: <code>/register +251912345678</code>');
        return;
      }

      // Save chat ID for this phone
      this.pendingPhones.set(phone, chatId);
      
      // Generate and store OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      this.pendingOTPs.set(phone, { code: otp, expires: new Date(Date.now() + 5 * 60000) });

      // Send OTP back to user
      await this.sendMessage(chatId,
        `✅ <b>Phone registered!</b>\n\n` +
        `📱 Phone: ${phone}\n` +
        `🔐 OTP: <b><code>${otp}</code></b>\n\n` +
        `⏰ Expires in 5 minutes.\n` +
        `Enter this code on the website.`
      );

      console.log(`✅ OTP for ${phone}: ${otp} (chat: ${chatId})`);
      return;
    }

    // Unknown command
    await this.sendMessage(chatId, 'Send /start to begin or /register +2519... to link your phone.');
  }

  // Check if phone has pending OTP
  getOTP(phone: string): { code: string; expires: Date; chatId: number } | null {
    const otp = this.pendingOTPs.get(phone);
    const chatId = this.pendingPhones.get(phone);
    
    if (!otp || !chatId) return null;
    if (new Date() > otp.expires) {
      this.pendingOTPs.delete(phone);
      this.pendingPhones.delete(phone);
      return null;
    }
    
    return { ...otp, chatId };
  }

  verifyOTP(phone: string, code: string): boolean {
    const otp = this.getOTP(phone);
    if (!otp) return false;
    
    if (otp.code === code) {
      this.pendingOTPs.delete(phone);
      return true;
    }
    return false;
  }

  getChatId(phone: string): number | undefined {
    return this.pendingPhones.get(phone);
  }
}

export const telegramBot = new TelegramBotService();