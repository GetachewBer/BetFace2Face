import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

const API_ID = parseInt(process.env.TELEGRAM_API_ID || '0');
const API_HASH = process.env.TELEGRAM_API_HASH || '';
const PHONE = process.env.TELEGRAM_PHONE || '';

function ask(q: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(q, a => { rl.close(); r(a); }));
}

async function main() {
  console.log('API_ID:', API_ID);
  console.log('PHONE:', PHONE);

  const client = new TelegramClient(new StringSession(''), API_ID, API_HASH, { connectionRetries: 3 });

  await client.start({
    phoneNumber: PHONE,
    password: async () => await ask('\n🔐 Enter your 2FA password: '),
    phoneCode: async () => await ask('📱 Enter Telegram code from your phone: '),
    onError: (err: any) => console.error('Error:', err.message),
  });

  console.log('\n✅ Logged in successfully!');

  const session = client.session.save() as unknown as string;
  console.log('\n📌 COPY THIS LINE TO server/.env:');
  console.log('TELEGRAM_SESSION=' + session);

  await client.sendMessage(PHONE, { message: '✅ Bet2Face connected! OTP service ready.' });
  console.log('\nTest message sent to yourself!');

  await client.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});