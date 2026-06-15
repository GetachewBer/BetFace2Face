import axios from 'axios';
import Fixture from '../models/Fixture';

const API_KEY = process.env.SPORTSDB_API_KEY || '3';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const WORLD_CUP_ID = 4662;

export async function syncWorldCupFixtures(): Promise<{ added: number; skipped: number }> {
  console.log('Syncing World Cup...');
  try {
    const response = await axios.get(`${BASE_URL}/${API_KEY}/eventsseason.php`, {
      params: { id: WORLD_CUP_ID, s: '2026' },
      timeout: 15000,
    });
    const events = response.data?.events || [];
    let added = 0, skipped = 0;
    for (const event of events) {
      const fixtureId = parseInt(event.idEvent);
      const exists = await Fixture.findOne({ fixtureId });
      if (!exists) {
        await Fixture.create({
          fixtureId, homeTeam: event.strHomeTeam || 'TBD', awayTeam: event.strAwayTeam || 'TBD',
          date: new Date(event.dateEvent + 'T' + (event.strTime || '15:00:00') + 'Z'),
          league: event.strLeague || 'World Cup 2026', status: event.strStatus || 'SCHEDULED',
          homeScore: event.intHomeScore || null, awayScore: event.intAwayScore || null,
        });
        added++;
      } else { skipped++; }
    }
    console.log(`World Cup: ${added} new, ${skipped} skipped`);
    return { added, skipped };
  } catch (err: any) { console.log('Error:', err.message); throw err; }
}

export async function getFixtures(filter?: { league?: string; status?: string }): Promise<any[]> {
  const query: any = {};
  if (filter?.league) query.league = filter.league;
  if (filter?.status) query.status = filter.status;
  return Fixture.find(query).sort({ date: 1 }).lean();
}