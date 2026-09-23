import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://onepiecedevilfruits.com";
const CDN = "https://cd-opf.pages.dev";

const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const escapeXml = escapeHtml;

const slugify = (value = "") => String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cleanDescription = (value = "") => {
    const normalized = String(value).replace(/\s+/g, " ").trim();
    if (normalized.length <= 158) return normalized;
    return `${normalized.slice(0, 155).replace(/\s+\S*$/, "")}…`;
};

const fruitData = JSON.parse(await readFile(path.join(ROOT, "public", "data", "fruits_v13.json"), "utf8"));
const shell = await readFile(path.join(DIST, "index.html"), "utf8");

function jsonLd(value) {
    return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function headTags({ title, description, canonical, image, type = "website", structuredData, noindex = false }) {
    const tags = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}">`,
        `<link rel="canonical" href="${escapeHtml(canonical)}">`,
        `<meta property="og:site_name" content="One Piece Devil Fruits">`,
        `<meta property="og:type" content="${escapeHtml(type)}">`,
        `<meta property="og:title" content="${escapeHtml(title)}">`,
        `<meta property="og:description" content="${escapeHtml(description)}">`,
        `<meta property="og:url" content="${escapeHtml(canonical)}">`,
        `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
        `<meta name="twitter:title" content="${escapeHtml(title)}">`,
        `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    ];

    if (image) {
        tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
        tags.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
    }
    if (noindex) tags.push('<meta name="robots" content="noindex,follow">');
    if (structuredData) tags.push(`<script type="application/ld+json">${jsonLd(structuredData)}</script>`);
    return tags.join("\n    ");
}

function renderDocument(metadata, content) {
    const withoutManagedHead = shell
        .replace(/<title>[\s\S]*?<\/title>/i, "")
        .replace(/\s*<meta name="description"[^>]*>/gi, "")
        .replace(/\s*<link rel="canonical"[^>]*>/gi, "")
        .replace(/\s*<meta property="og:[^"]+"[^>]*>/gi, "")
        .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/gi, "");

    return withoutManagedHead
        .replace("</head>", `    ${headTags(metadata)}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

async function writeRoute(route, html) {
    const directory = route === "/" ? DIST : path.join(DIST, route.replace(/^\//, ""));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html, "utf8");
}

function breadcrumb(items) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${SITE}${item.path}`,
        })),
    };
}

function fruitLinks(items) {
    return `<ul class="prerender-fruit-list">${items.map((fruit) => `
        <li>
            <a href="/fruit/${slugify(fruit.name)}">
                <img src="${CDN}/fruits/${escapeHtml(fruit.id)}.webp" alt="${escapeHtml(fruit.name)}" width="110" height="100" loading="lazy">
                <strong>${escapeHtml(fruit.name)}</strong>
                ${fruit.japaneseName ? `<span lang="ja">${escapeHtml(fruit.japaneseName)}</span>` : ""}
                ${fruit.romanizedName ? `<span>${escapeHtml(fruit.romanizedName)}</span>` : ""}
            </a>
        </li>`).join("")}</ul>`;
}

const prerenderStyle = `<style>
    .prerender-page{max-width:1200px;margin:40px auto;padding:20px;color:#fff}.prerender-page a{color:inherit}
    .prerender-page nav{align-items:flex-start;padding:0}.prerender-fruit-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;list-style:none;padding:0}
    .prerender-fruit-list a{display:flex;min-height:220px;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:20px;border:1px solid #1869ff;border-radius:16px;background:#011a48;text-align:center;text-decoration:none}
    .prerender-fruit-list img{object-fit:contain}.prerender-fruit-list span{color:#b9cef3}.prerender-detail{max-width:900px;margin:40px auto;padding:24px;color:#fff}.prerender-detail img{max-width:220px;height:auto;object-fit:contain}
</style>`;

const listingPages = [
    { route: "/", label: "All Devil Fruits", category: null, title: "All Devil Fruits — Complete List, Types, Users & Powers", description: "Explore every known One Piece Devil Fruit, including English, Japanese and romanized names, users, types, powers and detailed abilities." },
    { route: "/paramecia", label: "Paramecia Devil Fruits", category: "Paramecia", title: "Paramecia Devil Fruits — Complete List & Users", description: "Browse all known Paramecia Devil Fruits with their English, Japanese and romanized names, users, powers and abilities." },
    { route: "/logia", label: "Logia Devil Fruits", category: "Logia", title: "Logia Devil Fruits — Complete List & Users", description: "Browse all known Logia Devil Fruits with their English, Japanese and romanized names, users, powers and abilities." },
    { route: "/zoan", label: "Zoan Devil Fruits", category: "Zoan", title: "Zoan Devil Fruits — Complete List & Users", description: "Browse all known Zoan Devil Fruits with their English, Japanese and romanized names, users, powers and abilities." },
];

for (const page of listingPages) {
    const fruits = page.category ? fruitData.filter((fruit) => fruit.type?.includes(page.category)) : fruitData;
    const canonical = `${SITE}${page.route === "/" ? "/" : page.route}`;
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            breadcrumb([{ name: "Home", path: "/" }, ...(page.route === "/" ? [] : [{ name: page.label, path: page.route }])]),
            { "@type": "CollectionPage", name: page.label, url: canonical, description: page.description, mainEntity: { "@type": "ItemList", numberOfItems: fruits.length, itemListElement: fruits.map((fruit, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE}/fruit/${slugify(fruit.name)}`, name: fruit.name })) } },
        ],
    };
    const content = `${prerenderStyle}<main class="prerender-page"><nav aria-label="Breadcrumb"><a href="/">Home</a></nav><h1>${escapeHtml(page.label)}</h1><p>${escapeHtml(page.description)}</p>${fruitLinks(fruits)}</main>`;
    await writeRoute(page.route, renderDocument({ title: page.title, description: page.description, canonical, structuredData }, content));
}

for (const fruit of fruitData) {
    const slug = slugify(fruit.name);
    const route = `/fruit/${slug}`;
    const canonical = `${SITE}${route}`;
    const categoryPath = fruit.type?.includes("Logia") ? "/logia" : fruit.type?.includes("Zoan") ? "/zoan" : "/paramecia";
    const title = `${fruit.name}${fruit.romanizedName ? ` (${fruit.romanizedName})` : ""} | One Piece Devil Fruits`;
    const description = cleanDescription(`${fruit.name}${fruit.romanizedName ? `, or ${fruit.romanizedName}` : ""}, is a ${fruit.type || "Devil Fruit"}${fruit.user ? ` used by ${fruit.user}` : ""}. ${fruit.about || "See its powers, names and details."}`);
    const image = `${CDN}/fruits/${fruit.id}.webp`;
    const crumbs = breadcrumb([
        { name: "Home", path: "/" },
        { name: `${fruit.type || "Devil Fruit"} Fruits`, path: categoryPath },
        { name: fruit.name, path: route },
    ]);
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            crumbs,
            { "@type": "WebPage", name: fruit.name, alternateName: [fruit.romanizedName, fruit.japaneseName].filter(Boolean), url: canonical, description, image, about: { "@type": "Thing", name: fruit.name, alternateName: [fruit.romanizedName, fruit.japaneseName].filter(Boolean), description: fruit.about } },
        ],
    };
    const content = `${prerenderStyle}<main class="prerender-detail"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${categoryPath}">${escapeHtml(fruit.type || "Devil Fruits")}</a> / <span>${escapeHtml(fruit.name)}</span></nav><article><img src="${image}" alt="${escapeHtml(fruit.name)}" width="220" height="200"><h1>${escapeHtml(fruit.name)}</h1>${fruit.japaneseName ? `<p lang="ja">${escapeHtml(fruit.japaneseName)}</p>` : ""}${fruit.romanizedName ? `<p>${escapeHtml(fruit.romanizedName)}</p>` : ""}<h2>About ${escapeHtml(fruit.name)}</h2><p>${escapeHtml(fruit.about || "Details coming soon.")}</p><dl><dt>Type</dt><dd>${escapeHtml(fruit.type || "Unknown")}</dd><dt>User</dt><dd>${escapeHtml(fruit.user || "Unknown")}</dd><dt>Name meaning</dt><dd>${escapeHtml(fruit.nameMeaning || "Unknown")}</dd></dl></article></main>`;
    await writeRoute(route, renderDocument({ title, description, canonical, image, type: "article", structuredData }, content));
}

const utilityPages = [
    ["/community", "Community Devil Fruits", "Discover original Devil Fruits submitted by the One Piece fan community."],
    ["/fruit-finder", "Devil Fruit Finder", "Answer a few questions to discover which One Piece Devil Fruit best matches you."],
    ["/crew-wars", "Crew Wars", "Build your One Piece crew and test it in Crew Wars."],
    ["/grand-run", "Grand Run", "Play Grand Run and test your One Piece knowledge and reflexes."],
    ["/daily-fight", "Daily Fight", "Choose the winner in today's One Piece character matchup."],
    ["/quizzes", "One Piece Quizzes", "Test your One Piece knowledge with character, story and Devil Fruit quizzes."],
    ["/treasure-chest", "One Piece Treasure Chest", "Explore selected One Piece collectibles and treasures."],
];

for (const [route, heading, description] of utilityPages) {
    const canonical = `${SITE}${route}`;
    const structuredData = { "@context": "https://schema.org", "@graph": [breadcrumb([{ name: "Home", path: "/" }, { name: heading, path: route }]), { "@type": "WebPage", name: heading, url: canonical, description }] };
    const content = `${prerenderStyle}<main class="prerender-page"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>${escapeHtml(heading)}</span></nav><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p></main>`;
    await writeRoute(route, renderDocument({ title: `${heading} | One Piece Devil Fruits`, description, canonical, structuredData }, content));
}

const sitemapUrls = ["/", ...listingPages.slice(1).map((page) => page.route), ...utilityPages.map(([route]) => route), ...fruitData.map((fruit) => `/fruit/${slugify(fruit.name)}`)];
const fruitByRoute = new Map(fruitData.map((fruit) => [`/fruit/${slugify(fruit.name)}`, fruit]));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls.map((route) => {
    const fruit = fruitByRoute.get(route);
    return `  <url><loc>${escapeXml(`${SITE}${route}`)}</loc>${fruit ? `<image:image><image:loc>${escapeXml(`${CDN}/fruits/${fruit.id}.webp`)}</image:loc><image:title>${escapeXml(fruit.name)}</image:title></image:image>` : ""}</url>`;
}).join("\n")}
</urlset>\n`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, "utf8");

const redirects = new Map();
for (const fruit of fruitData) {
    const canonical = `/fruit/${slugify(fruit.name)}`;
    redirects.set(`/fruit/${fruit.id}`, canonical);
    const romanized = slugify(fruit.romanizedName);
    if (romanized && romanized !== slugify(fruit.name)) redirects.set(`/fruit/${romanized}`, canonical);
}
const redirectLines = [
    "/fruits / 301",
    "/fruits/community /community 301",
    "/fruit-battle /crew-wars 301",
    ...[...redirects].map(([from, to]) => `${from} ${to} 301`),
    "/* /404.html 404",
];
await writeFile(path.join(DIST, "_redirects"), `${redirectLines.join("\n")}\n`, "utf8");

const notFoundContent = `${prerenderStyle}<main class="prerender-page"><h1>Page not found</h1><p>The page you requested does not exist.</p><p><a href="/">Browse all Devil Fruits</a></p></main>`;
await writeFile(path.join(DIST, "404.html"), renderDocument({ title: "Page Not Found | One Piece Devil Fruits", description: "The requested page could not be found.", canonical: `${SITE}/404`, noindex: true }, notFoundContent), "utf8");

console.log(`Prerendered ${fruitData.length} fruit pages and ${listingPages.length + utilityPages.length} index pages.`);
