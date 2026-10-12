import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fruitsExpandedInfo from "../src/lib/fruits/fruitsExpandedInfo.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRUITS_PATH = path.join(ROOT, "public", "data", "fruits_v15.json");

const episodeRanges = [
    [1, 3, "Romance Dawn"],
    [4, 8, "Orange Town"],
    [9, 18, "Syrup Village"],
    [19, 30, "Baratie"],
    [31, 45, "Arlong Park"],
    [46, 47, "Buggy's Crew Adventure Chronicles"],
    [48, 53, "Loguetown"],
    [54, 61, "Warship Island (Non-canon)"],
    [62, 63, "Reverse Mountain"],
    [64, 67, "Whisky Peak"],
    [68, 69, "Diary of Koby-Meppo"],
    [70, 77, "Little Garden"],
    [78, 91, "Drum Island"],
    [92, 130, "Arabasta"],
    [131, 135, "Post-Arabasta (Non-canon)"],
    [136, 138, "Goat Island (Non-canon)"],
    [139, 143, "Ruluka Island (Non-canon)"],
    [144, 152, "Jaya"],
    [153, 195, "Skypiea"],
    [196, 206, "G-8 (Non-canon)"],
    [207, 228, "Long Ring Long Land"],
    [229, 263, "Water 7"],
    [264, 312, "Enies Lobby"],
    [313, 325, "Post-Enies Lobby"],
    [326, 336, "Ice Hunter (Non-canon)"],
    [337, 384, "Thriller Bark"],
    [385, 405, "Sabaody Archipelago"],
    [408, 421, "Amazon Lily"],
    [422, 425, "Impel Down"],
    [426, 429, "Little East Blue (Non-canon)"],
    [430, 456, "Impel Down"],
    [457, 489, "Marineford"],
    [490, 516, "Post-War"],
    [517, 522, "Return to Sabaody"],
    [523, 574, "Fish-Man Island"],
    [575, 578, "Z's Ambition (Non-canon)"],
    [579, 625, "Punk Hazard"],
    [626, 628, "Caesar Retrieval (Non-canon)"],
    [629, 746, "Dressrosa"],
    [747, 750, "Silver Mine (Non-canon)"],
    [751, 779, "Zou"],
    [780, 782, "Marine Rookie (Non-canon)"],
    [783, 877, "Whole Cake Island"],
    [878, 889, "Levely"],
    [890, 894, "Wano Country"],
    [895, 896, "Cidre Guild (Non-canon)"],
    [897, 1028, "Wano Country"],
    [1029, 1030, "Uta's Past (Non-canon)"],
    [1031, 1088, "Wano Country"],
    [1089, 1155, "Egghead"],
    [1156, Number.POSITIVE_INFINITY, "Elbaf"],
];

// Some older firstAppearance values predate the current metadata audit, while
// tie-in episodes can fall on a neighboring arc's numeric boundary. Keep these
// explicit so rerunning this migration remains deterministic.
const arcOverridesByName = new Map([
    ["Brush-Brush Fruit", "Dressrosa"],
    ["Pile-Pile Fruit", "Whole Cake Island"],
    ["Jacket-Jacket Fruit", "Dressrosa"],
    ["Ripe-Ripe Fruit", "Wano Country"],
    ["Mirror-Mirror Fruit", "Whole Cake Island"],
    ["Soot-Soot Fruit", "Post-War"],
    ["Dragon-Dragon Fruit, Allosaurus Model", "Sabaody Archipelago"],
    ["Wash-Wash Fruit", "Marineford"],
    ["Smelt-Smelt Fruit", "Silver Mine (Non-canon)"],
]);

function arcFromAppearance(firstAppearance) {
    if (firstAppearance === "One Piece Film: Gold") return "One Piece Film: Gold (Movie)";
    if (firstAppearance === "One Piece Live Attraction: Phantom") return "One Piece Live Attraction: Phantom";

    const episode = Number.parseInt(firstAppearance.match(/Episode\s+(\d+)/)?.[1], 10);
    if (!Number.isFinite(episode)) return null;

    return episodeRanges.find(([start, end]) => episode >= start && episode <= end)?.[2] ?? null;
}

const fruits = JSON.parse(await readFile(FRUITS_PATH, "utf8"));
const appearanceById = new Map(
    fruitsExpandedInfo.map(({ id, firstAppearance }) => [String(id), firstAppearance])
);

const updated = fruits.map((fruit) => {
    const firstAppearance = appearanceById.get(String(fruit.id));
    const debutArc = arcOverridesByName.get(fruit.name) || arcFromAppearance(firstAppearance);

    if (!firstAppearance || !debutArc) {
        throw new Error(`Could not determine debut arc for ${fruit.name} (${fruit.id})`);
    }

    return { ...fruit, debutArc };
});

await writeFile(FRUITS_PATH, `${JSON.stringify(updated, null, 4)}\n`, "utf8");
console.log(`Added debutArc to ${updated.length} fruits.`);
