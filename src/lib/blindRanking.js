export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const gameUrl = 'https://onepiecedevilfruits.com/blind-ranking/';
export const BLIND_RANKING_PAGE = {
    path: '/blind-ranking',
    url: gameUrl,
    title: 'One Piece Devil Fruit Blind Ranking Game',
    description: 'Rank ten random One Piece Devil Fruits for a random scenario. Place each fruit from 1 to 10, use one reroll, and see how your final ranking turns out.',
    jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'BreadcrumbList', itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onepiecedevilfruits.com/' },
                { '@type': 'ListItem', position: 2, name: 'Blind Ranking', item: gameUrl },
            ] },
            { '@type': 'WebApplication', name: 'Devil Fruit Blind Ranking', url: gameUrl, applicationCategory: 'GameApplication', operatingSystem: 'Any', isAccessibleForFree: true },
        ],
    },
};

export const RANKING_SCENARIOS = [
    {
        id: 'rescue', label: 'Island rescue',
        story: 'A storm is about to hit a small port. Get the townspeople to higher ground and keep them safe.',
    },
    {
        id: 'party', label: 'Kids’ birthday',
        story: 'You’re looking after twenty kids at a birthday party. Which powers would keep them entertained without anyone getting hurt?',
    },
    {
        id: 'dinner', label: 'Feed the crew',
        story: 'Your ship is days from land and the food is running out. You have a hundred hungry crewmates to feed.',
    },
    {
        id: 'rebuild', label: 'Rebuild a town',
        story: 'A pirate raid has left a town with damaged homes, blocked roads, and a broken harbour. Help the locals rebuild.',
    },
    {
        id: 'quiet', label: 'Quiet delivery',
        story: 'Get an important letter across a town full of patrols without being spotted or starting a fight.',
    },
    {
        id: 'stranded', label: 'Stranded crew',
        story: 'Your crew is stuck on an island for a week. You need drinking water, food, shelter, and a way to repair the ship.',
    },
    {
        id: 'cave-in', label: 'Mine rescue',
        story: 'Miners are trapped behind a cave-in. Reach them and get them out without causing another collapse.',
    },
    {
        id: 'archive', label: 'Save the maps',
        story: 'A fire is spreading through a port’s map archive. Get the workers and the irreplaceable charts out before the building is lost.',
    },
    {
        id: 'prison-break', label: 'Prison break',
        story: 'Your crewmates are locked inside a stone fort, and you are free outside. Get them out and away before reinforcements arrive.',
    },
    {
        id: 'convoy', label: 'Protect the convoy',
        story: 'Bandits are attacking wagons carrying medicine to a village. Keep the drivers safe and get the cargo through intact.',
    },
    {
        id: 'ship-duel', label: 'Duel on deck',
        story: 'An armed pirate has boarded your ship. Win the fight without sinking your own ship or injuring your crewmates.',
    },
    {
        id: 'overboard', label: 'Cargo overboard',
        story: 'Supply crates are drifting away from your ship. Working from the deck or a lifeboat, recover them before the current carries them out of reach.',
    },
    {
        id: 'ravine', label: 'Across the ravine',
        story: 'The bridge to a village has collapsed. Get your crew and their heavy supply crates across the deep, dry ravine safely.',
    },
    {
        id: 'summit', label: 'Race to the summit',
        story: 'Race other pirates to a flag on a rocky mountain peak. Reach it first, with loose slopes and sheer cliffs between you and the top.',
    },
    {
        id: 'night-watch', label: 'Night watch',
        story: 'Thieves are slipping into a dark warehouse district. Find and stop them while keeping the sleeping residents and stored goods safe.',
    },
    {
        id: 'courier-chase', label: 'Catch the thief',
        story: 'A thief has taken your crew’s Log Pose and is fleeing through a crowded market. Catch them and recover it without wrecking the stalls.',
    },
    {
        id: 'animals', label: 'Beasts on the loose',
        story: 'Large animals have escaped into a busy town. Bring them back to their enclosures without hurting them or the townspeople.',
    },
    {
        id: 'jungle-search', label: 'Lost in the jungle',
        story: 'Two crewmates are missing in a dense jungle. Find them before nightfall and lead everyone back to the ship without getting lost yourself.',
    },
    {
        id: 'frozen-camp', label: 'A freezing night',
        story: 'Your crew has a tent and a few tools on a freezing island. Keep everyone warm and sheltered until sunrise.',
    },
    {
        id: 'desert', label: 'Desert crossing',
        story: 'Guide a small caravan between oases in brutal heat. Keep the travellers and pack animals moving, and make the limited drinking water last.',
    },
    {
        id: 'blackout', label: 'Festival blackout',
        story: 'The lights fail halfway through a crowded night festival. Help people move safely, find separated families, and keep the celebration going.',
    },
    {
        id: 'statue', label: 'Handle with care',
        story: 'Move a huge, fragile statue from the docks to a hilltop museum. It must arrive in one piece, and the streets are too narrow for a wagon.',
    },
    {
        id: 'harvest', label: 'Beat the rain',
        story: 'Heavy rain will ruin a village’s ripe crops by evening. Help a handful of farmers harvest the fields and get everything into dry storage.',
    },
    {
        id: 'ruins', label: 'Into the ruins',
        story: 'Explore an unlit ruin, find a hidden treasure chamber, and bring its contents outside. The old floors and ceilings are dangerously fragile.',
    },
];

export function createRankingRound(fruits, { random = Math.random, previousScenarioId } = {}) {
    const scenarios = RANKING_SCENARIOS.filter(scenario => scenario.id !== previousScenarioId);
    const scenarioId = scenarios[Math.floor(random() * scenarios.length)].id;
    const deck = [...new Set(fruits.filter(fruit => fruit.id && fruit.name).map(fruit => String(fruit.id)))];
    if (deck.length < 11) throw new Error('A round needs at least eleven different fruits');
    for (let index = deck.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    return { scenarioId, deck: deck.slice(0, 11), cursor: 0, slots: Array(10).fill(null), rerollsLeft: 1, phase: 'playing' };
}

// Preview fruits are cosmetic and must not expose the round's hidden deck.
export function getRankingDrawPreviews(fruits, deck, random = Math.random) {
    const hidden = new Set(deck);
    const previews = fruits.filter(fruit => fruit.id && fruit.name && !hidden.has(String(fruit.id)));
    for (let index = previews.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [previews[index], previews[other]] = [previews[other], previews[index]];
    }
    return previews.slice(0, 4);
}

export function rankingReducer(round, action) {
    if (action.type === 'SET_ROUND') return action.round;
    if (!round || round.phase !== 'playing' || action.fruitId !== round.deck[round.cursor]) return round;
    if (action.type === 'REROLL') {
        if (round.rerollsLeft !== 1 || round.cursor + 1 >= round.deck.length) return round;
        return { ...round, cursor: round.cursor + 1, rerollsLeft: 0 };
    }
    if (action.type === 'PLACE') {
        if (!Number.isInteger(action.rank) || action.rank < 1 || action.rank > 10 || round.slots[action.rank - 1]) return round;
        const slots = [...round.slots];
        slots[action.rank - 1] = action.fruitId;
        return { ...round, slots, cursor: round.cursor + 1, phase: slots.every(Boolean) ? 'complete' : 'playing' };
    }
    return round;
}

export function rankingShareText(round, fruits, { includeUrl = true } = {}) {
    const byId = new Map(fruits.map(fruit => [String(fruit.id), fruit]));
    const scenario = RANKING_SCENARIOS.find(item => item.id === round.scenarioId);
    return [`My blind ranking: ${scenario.label}`, '1 = best fit · 10 = worst fit',
        ...RANKS.map(rank => `${rank}. ${byId.get(round.slots[rank - 1])?.name || 'Empty'}`),
        `Reroll ${round.rerollsLeft ? 'saved' : 'used'}.${includeUrl ? ` Your turn: ${BLIND_RANKING_PAGE.url}` : ''}`,
    ].join('\n');
}
