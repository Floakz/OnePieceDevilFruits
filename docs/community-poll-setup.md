# Community Poll local preview

The community poll is currently a local-only UI preview. It does not use Firebase Authentication, Firestore, App Check, Cloud Functions, or any poll backend.

## Run locally

1. Start the site with `npm run dev`.
2. Open `/poll`, then select and rank three fruits at `/poll/vote`.
3. Confirm the final-vote popup to save the ballot in the browser's localStorage.
4. Visit the thank-you page, then use **Reset local preview vote** to repeat the workflow.

Poll ballots are stored only in the current browser and device. They are not shared across browsers, sent to a server, or available as aggregate poll results. Clearing site data removes the local ballot.

The fruit catalog is loaded from the site's static `/data/fruits_v16.json` asset and cached in localStorage. The poll uses the static catalog path only, with no Firestore fallback.

## Configuration

Edit `src/lib/pollConfig.js` to change the year, voting dates, top-N value, or fruit eligibility policy. `POLL_TOP_N` is reserved for a future results implementation.

## Future backend integration

Firebase ballot persistence, identity, security rules, and results export are intentionally absent. They can be designed and added separately without changing the existing Firebase setup used elsewhere on the site.
