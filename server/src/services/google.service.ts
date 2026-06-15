import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

interface GoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  picture?: string;
}

export async function verifyGoogleCode(code: string): Promise<GoogleUser> {
  const { tokens } = await client.getToken(code);
  
  if (!tokens.id_token) {
    throw new Error('No ID token received');
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error('Invalid token payload');

  return {
    googleId: payload.sub,
    email: payload.email || '',
    fullName: payload.name || 'Google User',
    picture: payload.picture,
  };
}