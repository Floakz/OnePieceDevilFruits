# Daily fight vote totals

Daily fights start fresh on **2026-11-07 (UTC)**. The frontend only supports dates on or after `DAILY_FIGHT_START_DATE` in `src/lib/dailyFightApi.js`. Dates before launch are hidden from navigation and rejected before any Firestore request.

## One document per fight

The existing `fights/{date}` document stores the matchup plus `leftVotes` and `rightVotes`. A normal visit reads this one document. A vote atomically increments the chosen counter, then rereads the document to display current results. There are no realtime listeners, vote-collection queries, aggregation queries, user vote documents, extra legacy counters, migrations, new collections or Cloud Functions.

If rollout day's matchup already exists without counters, its new totals start at zero. Firestore `increment(1)` initializes the selected missing counter to one; missing counters display as zero. The old vote records remain untouched and are never queried or included. The app preserves the existing matchup. New daily matchups are created automatically with both counters at zero, using a transaction to prevent simultaneous visitors from replacing the matchup.

## Browser vote tracking

Each browser saves its choice under `daily-fight-v2-voted-{date}` in localStorage. The new prefix keeps old votes from blocking participation in the fresh tally. A saved choice blocks ordinary repeat votes after refresh; a storage event updates the choice shown in other tabs.

The local choice is reserved before sending the increment. If storage is blocked, no vote is sent. If a write fails, the reservation is removed so the user can retry. If only the subsequent results read fails, the choice stays saved and the page reports that the vote was saved. Clearing browser storage or using another browser/device can allow repeat voting; this is browser-side prevention for a casual poll, not a server-enforced one-vote-per-person guarantee.

## Viewing history

Today's fight can be voted on, and its results appear after the browser has voted. Previous fights from the launch date onward remain open for voting. Their current results appear immediately, including for visitors without a local vote. Each browser can vote once per fight, independently of its votes on other dates. The results overlay lets clicks reach the voting cards until that browser has voted. Navigation uses "View previous fight" and "Back to today". Older pre-launch fights remain unavailable.

Voting stays open when a fight becomes a previous day's fight; its results can continue changing. The client updates today's date periodically and when the tab regains focus. Future dates remain unavailable, and missing past fights are never generated retroactively.

## Firebase rules rollout

The rules supplied in the chat explicitly deny updates to fight documents, so **publish the complete replacement in [firestore.rules](../firestore.rules)** before using the counter implementation. This file preserves public read-only fruits and public fight reads, permits zero-counter matchup creation only for today's UTC date, and permits exactly one counter increment of one on today's or a previous fight from the launch date onward. Matchup changes, counter resets, deletions, votes before launch, and votes on future dates are rejected. Legacy vote records stay readable but cannot receive new writes.

The server checks `request.time` in UTC, so the date restriction applies even to a modified client or a browser with an incorrect clock. Browser vote eligibility still relies on localStorage; these rules do not enforce one vote per person. No Firestore document lookups are used in the rules.

This replacement supersedes the earlier version that closed voting on previous dates. Use the latest file so both the frontend and Firebase allow previous-day votes. It was prepared locally; it has not been deployed or verified against the production project. Publishing the rules does not require a collection migration or Cloud Function. Compare it with the currently deployed rules if they have changed since the copy supplied in the chat.

References: [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started), [UTC rule timestamps](https://firebase.google.com/docs/reference/rules/rules.Timestamp), and [atomic increments](https://firebase.google.com/docs/firestore/manage-data/add-data#increment_a_numeric_value).

## Percentages and verification

`leftPct = Math.round(leftVotes / (leftVotes + rightVotes) * 100)`. With votes present, `rightPct = 100 - leftPct` so the whole percentages sum to 100. Both show zero when there are no votes.

Run `node --test tests/dailyFightApi.test.mjs`, `npx eslint src/lib/dailyFightApi.js src/pages/games/dailyFight/dailyFight.jsx`, and `npm run build`.
