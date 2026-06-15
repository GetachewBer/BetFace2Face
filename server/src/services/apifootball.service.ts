import axios from 'axios';

const API_KEY = process.env.API_FOOTBALL_KEY || '';
const BASE_URL = 'https://v3.football.api-sports.io';
const HEADERS = { 'x-apisports-key': API_KEY };

export async function fetchFixturesByDate(date: string): Promise<any[]> {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: HEADERS,
      params: { date },
      timeout: 15000,
    });
    return response.data.response || [];
  } catch (err: any) {
    console.error('API error:', err.message);
    return [];
  }
}