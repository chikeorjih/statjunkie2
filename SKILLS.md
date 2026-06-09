# NHL API Skills

> Populate this file with notes and findings from the unofficial NHL Stats API.
> The app proxies all external calls through `/api/nhl/*` route handlers (see `src/app/api/nhl/`).

---

## Base URL

```
https://api-web.nhle.com/v1
```

## Authentication

None required. However, **server-side fetchers must include a browser User-Agent header** or the API returns HTTP 403. See `src/app/api/nhl/*/route.ts` for the proxy pattern used.

---

## Endpoints

### GET /standings/now

Returns current season standings with team metadata.

**Response shape:**
```json
{
  "standings": [
    {
      "teamAbbrev": { "default": "TOR" },
      "teamName": { "default": "Toronto Maple Leafs" },
      "teamLogo": "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
      "divisionName": "Atlantic",
      "conferenceName": "Eastern",
      "wins": 0,
      "losses": 0,
      "otLosses": 0,
      "points": 0
    }
  ]
}
```

**Used by:** `/api/nhl/teams/route.ts`

---

### GET /roster/{teamAbbrev}/current

Returns the current season roster for a team, split by position group.

**Example:** `/roster/TOR/current`

**Response shape:**
```json
{
  "forwards": [ /* RosterPlayer[] */ ],
  "defensemen": [ /* RosterPlayer[] */ ],
  "goalies": [ /* RosterPlayer[] */ ]
}
```

**RosterPlayer fields:**
| Field | Type | Notes |
|---|---|---|
| `id` | number | Player ID used in other endpoints |
| `headshot` | string | URL to player headshot image |
| `firstName.default` | string | |
| `lastName.default` | string | |
| `sweaterNumber` | number | Jersey number |
| `positionCode` | string | `C`, `L`, `R`, `D`, `G` |
| `shootsCatches` | string | `L` or `R` |
| `heightInInches` | number | |
| `weightInPounds` | number | |
| `birthDate` | string | ISO date string |
| `birthCountry` | string | 3-letter country code |

**Used by:** `/api/nhl/roster/[team]/route.ts`

---

### GET /player/{playerId}/landing

Returns full player details including season-by-season stats.

**Example:** `/player/8478402/landing`

**Response shape (abbreviated):**
```json
{
  "playerId": 8478402,
  "firstName": { "default": "Auston" },
  "lastName": { "default": "Matthews" },
  "position": "C",
  "headshot": "https://assets.nhle.com/mugs/nhl/20242025/TOR/8478402.png",
  "currentTeamAbbrev": "TOR",
  "featuredStats": {
    "regularSeason": {
      "subSeason": {
        "season": 20242025,
        "gameTypeId": 2,
        "gamesPlayed": 82,
        "goals": 69,
        "assists": 45,
        "points": 114,
        "plusMinus": 22,
        "pim": 18,
        "shots": 340,
        "shootingPctg": 20.29,
        "avgToi": "21:34",
        "powerPlayGoals": 20,
        "powerPlayPoints": 38,
        "shorthandedGoals": 1
      }
    }
  },
  "seasonTotals": [
    {
      "season": 20242025,
      "gameTypeId": 2,
      "leagueAbbrev": "NHL",
      "gamesPlayed": 82,
      "goals": 69,
      "assists": 45,
      "points": 114
    }
  ]
}
```

**Key `seasonTotals` fields:**
| Field | Type | Notes |
|---|---|---|
| `season` | number | 8-digit code, e.g. `20242025` = 2024-25 season |
| `gameTypeId` | number | `2` = regular season, `3` = playoffs |
| `leagueAbbrev` | string | `NHL`, `AHL`, `OHL`, etc. Filter to `NHL` only |

**Skater-specific fields in `seasonTotals`:**
`gamesPlayed`, `goals`, `assists`, `points`, `plusMinus`, `pim`, `shots`, `shootingPctg`, `avgToi`, `powerPlayGoals`, `powerPlayPoints`, `shorthandedGoals`, `gameWinningGoals`

**Goalie-specific fields in `seasonTotals`:**
`gamesPlayed`, `wins`, `losses`, `otLosses`, `goalsAgainstAvg`, `savePctg`, `shotsAgainst`, `saves`, `shutouts`

**Used by:** `/api/nhl/player/[id]/route.ts`

---

## Notes & Gotchas

- **Season codes:** Concatenation of start and end year, e.g. `20242025` for 2024-25.
- **Position codes:** `C` (centre), `L` (left wing), `R` (right wing), `D` (defence), `G` (goalie).
- **Team abbreviations:** 32 teams. Examples: `TOR`, `MTL`, `BOS`, `NYR`, `EDM`, `VGK`, `SEA`, `UTA`.
- **`featuredStats` vs `seasonTotals`:** `featuredStats.regularSeason.subSeason` is a pre-aggregated current-season total. `seasonTotals` has one entry per season per league, including minors, junior, and international.
- **Trailing average exclusion:** When computing the trailing average, filter `seasonTotals` to `gameTypeId === 2 && leagueAbbrev === 'NHL'` and exclude the current season entry (by season code) so current performance is not included in the baseline.
- **Rate limiting:** No known hard limits, but parallel fetching ~25 players works fine in practice. The Next.js route handler `revalidate` cache prevents hammering the API across page loads.
- **Image CDN:** Player headshots use `assets.nhle.com`. Team logos use SVGs from the same domain.

---

## Additional Endpoints (not yet used)

> Add notes here as you discover useful endpoints.

| Endpoint | Description |
|---|---|
| `GET /player/{id}/game-log/now` | Game-by-game log for the current season |
| `GET /schedule/now` | Today's games |
| `GET /score/now` | Live scores |
| `GET /skater-stats-leaders/current` | League-wide stat leaders |
| `GET /goalie-stats-leaders/current` | Goalie stat leaders |
| `GET /player/{id}/stats-summary/now` | Compact stats summary |
