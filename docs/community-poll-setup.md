# Community poll setup

The community poll uses the site's existing Firebase project. Each voter submits three distinct fruits in rank order. The app stores one document per Firebase Authentication UID per year, at `communityPolls/{year}/ballots/{uid}`:

| Field | Value |
| --- | --- |
| `first` | Fruit ID in first place |
| `second` | Fruit ID in second place |
| `third` | Fruit ID in third place |
| `createdAt` | Firestore server timestamp |

The three ranks are saved together in one write, so a failed submission cannot leave a partial ballot. The first successful submission is final. Clients can only read their own ballot by its document path; they cannot list ballots, edit them, or delete them. Anonymous sign-in needs no account prompt. It limits votes to one per Firebase identity, so clearing site data or switching browsers can allow another vote. Old local preview votes are not imported.

## Before deploying the website

1. In the same Firebase project used by the site, check that **Authentication → Sign-in method → Anonymous** is enabled. Daily Fight already uses it. Keep the current `VITE_FB_*` settings. [Firebase anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth).
2. Add the `/communityPolls/{year}` block from [firestore.rules](../firestore.rules) to the live Firestore rules and publish. If the live rules already match the repository for other paths, you can publish the entire file. Review any broader rules that also match the poll, since an allow from any matching rule grants access. [Firestore rules setup](https://firebase.google.com/docs/firestore/security/get-started).
3. In **Firestore Database → Data**, create the `communityPolls` collection and a document with ID `2026`. Add these two fields as timestamps. [Firebase Console guide](https://firebase.google.com/docs/firestore/using-console).

   | Field | UTC value |
   | --- | --- |
   | `opensAt` | November 3, 2026 at 00:00 |
   | `closesAt` | January 2, 2027 at 00:00 |

   The setup script can also create the document using [Application Default Credentials](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) for an admin with Firestore write access.

   ```sh
   node scripts/community-poll.mjs setup YOUR_FIREBASE_PROJECT_ID
   ```

   The script refuses to overwrite an existing poll. Ballot documents appear automatically when users vote. No new Firebase project, Cloud Function, or custom index is required.

4. Deploy the site and open `/poll`. Use a test project or the Firebase emulators to submit a test ballot so it doesn't count in the live results.

Firestore enforces the dates from the yearly document. For a new season, update [pollConfig.js](../src/lib/pollConfig.js) and create the new year's document. Keep the app dates and the Firestore document in sync if the dates change. The ballot picker uses the site's static fruit catalog, so newly added fruits can appear without editing Firestore.

## Export the results

With admin credentials that can read Firestore, run:

```sh
node scripts/community-poll.mjs results YOUR_FIREBASE_PROJECT_ID 2026 > poll-results-2026.json
```

The export validates all three IDs on every ballot against the catalog in the checkout used for the export. A ballot with an unknown, ineligible, or repeated fruit ID is counted in `ignoredBallots` and contributes no points. If a fruit is removed from the catalog later, use the catalog from the end of that poll when tallying again.

The JSON contains aggregate ballot counts and a top 25 with points and counts by placement. First place earns 3 points, second earns 2, and third earns 1. Ties are broken by first-place count, then second-place count, then fruit name. The export is separate from the public site so you can decide when to reveal it.

To verify the rules locally, start the Firestore emulator with `firestore.rules` for project `demo-community-poll`. Set `FIRESTORE_EMULATOR_HOST` to its host and port and run `node --test tests/pollRules.emulator.mjs`.
