export const FRUIT_ARC_ORDER = [
    "Romance Dawn",
    "Orange Town",
    "Syrup Village",
    "Baratie",
    "Arlong Park",
    "Buggy's Crew Adventure Chronicles",
    "Loguetown",
    "Warship Island (Non-canon)",
    "Reverse Mountain",
    "Whisky Peak",
    "Diary of Koby-Meppo",
    "Little Garden",
    "Drum Island",
    "Arabasta",
    "Post-Arabasta (Non-canon)",
    "Goat Island (Non-canon)",
    "Ruluka Island (Non-canon)",
    "Jaya",
    "Skypiea",
    "G-8 (Non-canon)",
    "Long Ring Long Land",
    "Water 7",
    "Enies Lobby",
    "Post-Enies Lobby",
    "Ice Hunter (Non-canon)",
    "Thriller Bark",
    "Sabaody Archipelago",
    "Amazon Lily",
    "Impel Down",
    "Little East Blue (Non-canon)",
    "Marineford",
    "Post-War",
    "Return to Sabaody",
    "Fish-Man Island",
    "Z's Ambition (Non-canon)",
    "Punk Hazard",
    "Caesar Retrieval (Non-canon)",
    "Dressrosa",
    "Silver Mine (Non-canon)",
    "Zou",
    "Marine Rookie (Non-canon)",
    "Whole Cake Island",
    "Levely",
    "Wano Country",
    "Uta's Past (Non-canon)",
    "Egghead",
    "Elbaf",
    "One Piece Film: Gold (Movie)",
    "One Piece Live Attraction: Phantom",
];

const arcOrder = new Map(FRUIT_ARC_ORDER.map((arc, index) => [arc, index]));

export function filterFruitsByDebutArc(fruits, selectedArc = "all") {
    if (!selectedArc || selectedArc === "all") return fruits;
    return fruits.filter((fruit) => fruit.debutArc === selectedArc);
}

export function getFruitArcOptions(fruits) {
    const counts = new Map();

    for (const fruit of fruits) {
        if (!fruit.debutArc) continue;
        counts.set(fruit.debutArc, (counts.get(fruit.debutArc) || 0) + 1);
    }

    return [...counts.entries()]
        .sort(([arcA], [arcB]) => {
            const orderA = arcOrder.get(arcA) ?? Number.MAX_SAFE_INTEGER;
            const orderB = arcOrder.get(arcB) ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB || arcA.localeCompare(arcB);
        })
        .map(([name, count]) => ({ name, count }));
}
