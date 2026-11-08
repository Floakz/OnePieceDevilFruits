# Characters

The Characters tab lives at `/characters`, separate from the fruit catalog.
Its 21 profiles cover canon Devil Fruit users introduced by the end of Arabasta
whose fruits already exist in `public/data/fruits_v16.json`. Ace represents the
Flame-Flame Fruit in this period, even though the fruit catalog lists Sabo as its
current user. Non-canon characters and users introduced later are excluded.

`src/data/characterProfiles.json` is the curated content source. Profiles have
Japanese and romanized names, a short card description, background, personality,
abilities and limitations, relationships, trivia, and a story section. Each has
roughly 420–540 words. Ages, roles, and fruit classifications use the Arabasta
period. Character introductions can precede their fruit's debut: Alvida first
appears in Romance Dawn, for example.

Plot outcomes are placed in a native `details` section, closed by default and
labeled as spoilers through Arabasta. Switching profiles resets this disclosure.
The same disclosure is present in the prerendered HTML. Source metadata is retained
for research and is not displayed on the website.

Cards reuse the fruit card styles, including the floating fruit image, large
name, original names below it, and portrait beside the text. Detail pages reuse
the fruit detail layout. Related character cards include local portraits.

The roster is intentionally explicit. Adding fruits to the main catalog does
not automatically publish new characters. The character routes are lazy loaded,
so the fruit home page does not load character data.

## Pagination and loading

The list displays 12 characters per page, using the same paging controls as the
fruit catalog. Page one is `/characters`; later pages use `/characters/page/2`,
and so on. Search and group filters apply to the whole roster before paging.
Changing either filter returns to page one. Paging retains the filters, and
invalid or excessive page numbers redirect to an existing page.
The displayed total and number of pages update automatically when profiles are added.

Only the current page's cards and images are mounted. The browser loads a compact
index containing card and search fields for the roster, not all biographies.
Opening a character fetches that character's full JSON file. These requests are
cached and can be retried after a failure.

`scripts/character-data.mjs` is a Vite plugin that creates the compact index and
individual biography assets from the one authored JSON file. It serves them in
development and includes them in production builds. Filenames include content
hashes so edited biographies receive fresh URLs. No generated files need to be
edited or committed. Source changes refresh the development preview.

Every list page and detail page is included in prerendered HTML and the sitemap.
Each generated list page contains only its own cards. To change the number of
cards per page, edit `CHARACTER_PAGE_SIZE` in `src/lib/characterCatalog.js`.

## Search metadata and fruit links

Each profile has a `seoDescription`: a short, complete summary for search results
and social previews. Set `seoName` when a familiar alias should lead the page
title, such as `Mr. 5 (Gem)`. Otherwise the title uses `name`. Both fields belong
in `src/data/characterProfiles.json`; generated files need no manual changes.

`src/lib/characterSeo.js` supplies the same metadata to React and the HTML build.
It includes canonical URLs, portrait images, and page and breadcrumb structured
data. Navigation replaces the managed `page-json-ld` script so the previous
character's data cannot stay behind.

Fruit detail pages link current and previous users to published profiles when
both the name and fruit match. Names can match the profile's English, Japanese,
romanized name, or alias. This keeps Sabo's name separate from Ace's profile.
The fruit home page still does not load the character index.

## Research

The user's existing scraper was run on 2026-10-25. All 21 profiles were exported,
with 47 responses and no section errors. Full articles and available linked tabs
were used for research and the expanded biographies. Events after Arabasta are
left out of the authored copy.

To refresh research from PowerShell at the website root:

```powershell
& '..\one-piece-character-data-scraper\.venv\Scripts\python.exe' scripts\scrape-character-research.py --scraper '..\one-piece-character-data-scraper'
```

The helper imports the existing scraper without changing that repository.
It keeps the scraper's request delays, throttling and robots handling. A new
export is validated before replacing the previous complete export. Missing
profiles or section failures cause a nonzero exit. The raw export is
`.character-research.local`, ignored by Git and outside the published files.
Refreshing research does not overwrite the authored profiles.

Portraits reuse the site's local art. Some depict later outfits; they have not
all been replaced with Arabasta-era portraits. Ace uses his own local portrait
rather than the Flame-Flame Fruit's current-user image. Fandom's image CDN
returned HTTP 403 during this session, so no new portraits were downloaded.

Fruit links have a short note because the existing fruit pages cover later arcs.

## Checks

```powershell
node --test tests/characterCatalog.test.mjs tests/characterPagination.test.mjs tests/characterSeo.test.mjs
npm run build
```

The checks cover roster content, pagination boundaries, filters, page URLs,
compact metadata, separate biography assets, request caching and retry,
consistent search metadata, and current and previous user links.
