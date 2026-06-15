import { Router } from 'express';
import Fixture from '../models/Fixture';
import { fetchFixturesByDate } from '../services/apifootball.service';

const router = Router();

router.post('/sync-today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const fixtures = await fetchFixturesByDate(today);
  let added = 0, updated = 0;

  for (const f of fixtures) {
    const isWC = f.league.name === 'World Cup';
    const isETH = f.league.country === 'Ethiopia';
    if (!isWC && !isETH) continue;

    const fixtureId = f.fixture.id;
    const exists = await Fixture.findOne({ fixtureId });
    
    const data = {
      fixtureId,
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      homeLogo: f.teams.home.logo || '',
      awayLogo: f.teams.away.logo || '',
      date: new Date(f.fixture.date),
      league: (isWC ? 'WC - ' : 'ETH - ') + (isWC ? (f.league.round || 'Group') : f.league.name),
      status: f.fixture.status.short === 'FT' ? 'FINISHED' : f.fixture.status.short === 'NS' ? 'SCHEDULED' : 'LIVE',
      homeScore: f.goals?.home ?? null,
      awayScore: f.goals?.away ?? null,
    };

    if (!exists) {
      await Fixture.create(data);
      added++;
    } else {
      await Fixture.updateOne({ fixtureId }, { 
        status: data.status, homeScore: data.homeScore, awayScore: data.awayScore,
        homeLogo: data.homeLogo, awayLogo: data.awayLogo
      });
      updated++;
    }
  }

  res.json({ success: true, added, updated });
});

router.get('/', async (req, res) => {
  const fixtures = await Fixture.find().sort({ date: 1 }).lean();
  res.json({ success: true, data: fixtures });
});

export default router;