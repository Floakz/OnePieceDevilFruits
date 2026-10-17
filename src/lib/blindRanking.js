export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const gameUrl = 'https://onepiecedevilfruits.com/blind-ranking';
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
