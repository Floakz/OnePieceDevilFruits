import { FRUIT_ARC_ORDER } from './fruitArcs.js';
import { getAbilityTags } from './fruitDiscovery.js';

export const MAX_GUESSES = 7;
export const GUESSER_PAGE = {
    path: '/fruit-guesser',
    url: 'https://onepiecedevilfruits.com/fruit-guesser',
    title: 'Fruit Guesser — One Piece Devil Fruit Guessing Game',
    description: 'Guess the mystery One Piece Devil Fruit from its silhouette in seven tries. Compare types, abilities, arcs and stats, then play again with a new random fruit.',
};

export const GUESSER_CLUES = [
    { key: 'type', label: 'Type' },
    { key: 'abilities', label: 'Abilities' },
    { key: 'arc', label: 'Debut arc' },
    { key: 'canon', label: 'Canon' },
    { key: 'awakening', label: 'Awakening' },
    { key: 'user', label: 'User' },
    { key: 'power', label: 'Power', unit: '/100' },
    { key: 'attack', label: 'Attack', unit: '/100' },
    { key: 'defense', label: 'Defense', unit: '/100' },
    { key: 'utility', label: 'Utility', unit: '/100' },
    { key: 'rarity', label: 'Rarity', unit: '/5' },
    { key: 'appearance', label: 'First appearance' },
];

export function getGuesserCatalog(fruits, details = []) {
    const expanded = new Map(details.map(fruit => [String(fruit.id), fruit]));
    return [...new Map(fruits.filter(fruit => fruit.id && fruit.name && fruit.img?.fruit !== 'noImg')
        .map(fruit => [String(fruit.id), { ...expanded.get(String(fruit.id)), ...fruit, id: String(fruit.id) }])).values()]
        .sort((a, b) => a.name.localeCompare(b.name));
}

export function createGuesserRound(fruits, { previousId, random = Math.random } = {}) {
    if (!fruits.length) return null;
    const choices = fruits.length > 1 ? fruits.filter(fruit => fruit.id !== previousId) : fruits;
    const target = choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))];
    return { targetId: target.id, fruitIds: fruits.map(fruit => fruit.id), guesses: [], phase: 'playing' };
}

export function guesserReducer(round, action) {
    if (action.type === 'START') return action.round;
    if (action.type !== 'GUESS' || !round || round.phase !== 'playing') return round;
    const id = String(action.fruitId);
    if (!round.fruitIds.includes(id) || round.guesses.includes(id) || round.guesses.length >= MAX_GUESSES) return round;
    const guesses = [...round.guesses, id];
    return { ...round, guesses, phase: id === round.targetId ? 'won' : guesses.length === MAX_GUESSES ? 'lost' : 'playing' };
}

export function normalizeGuesserQuery(value = '') {
    return String(value).normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function searchGuesserFruits(fruits, query, guessed = []) {
    const term = normalizeGuesserQuery(query);
    if (!term) return [];
    return fruits.filter(fruit => !guessed.includes(fruit.id) && [fruit.name, fruit.romanizedName, fruit.japaneseName, fruit.user]
        .some(value => value && normalizeGuesserQuery(value).includes(term)))
        .sort((a, b) => Number(normalizeGuesserQuery(b.name).startsWith(term)) - Number(normalizeGuesserQuery(a.name).startsWith(term)) || a.name.localeCompare(b.name))
        .slice(0, 8);
}

const unknown = value => value == null || String(value).trim() === '' || /^(unknown|n\/a|none)$/i.test(String(value).trim());
const number = value => !unknown(value) && Number.isFinite(Number(value)) ? Number(value) : null;

function compareText(value, target) {
    return { value: unknown(value) ? 'Unknown' : value, status: unknown(value) || unknown(target) ? 'unknown' : value === target ? 'correct' : 'incorrect' };
}

function compareNumber(value, target, { near = 0, suffix = '' } = {}) {
    const guessed = number(value);
    const hidden = number(target);
    return {
        value: guessed == null ? 'Unknown' : `${guessed}${suffix}`,
        status: guessed == null || hidden == null ? 'unknown' : guessed === hidden ? 'correct' : near && Math.abs(guessed - hidden) <= near ? 'partial' : 'incorrect',
        direction: guessed == null || hidden == null || guessed === hidden ? null : hidden > guessed ? 'higher' : 'lower',
    };
}

function compareBoolean(value, target, yes, no) {
    return compareText(typeof value === 'boolean' ? value ? yes : no : null, typeof target === 'boolean' ? target ? yes : no : null);
}

export function compareGuesserFruits(guess, target) {
    const guessedTags = getAbilityTags(guess);
    const targetTags = getAbilityTags(target);
    const shared = guessedTags.filter(tag => targetTags.some(other => other.id === tag.id));
    const type = compareText(guess.type, target.type);
    const family = value => /zoan/i.test(value || '') ? 'Zoan' : /paramecia/i.test(value || '') ? 'Paramecia' : /logia/i.test(value || '') ? 'Logia' : null;
    if (type.status === 'incorrect' && family(guess.type) && family(guess.type) === family(target.type)) type.status = 'partial';
    const arc = compareText(guess.debutArc, target.debutArc);
    // Movie and attraction entries are appended to the catalog, not chronological.
    const chronologicalArcs = FRUIT_ARC_ORDER.filter(value => !value.startsWith('One Piece '));
    const guessArc = chronologicalArcs.indexOf(guess.debutArc);
    const targetArc = chronologicalArcs.indexOf(target.debutArc);
    if (guessArc >= 0 && targetArc >= 0 && guessArc !== targetArc) {
        arc.direction = targetArc > guessArc ? 'later' : 'earlier';
    }
    const appearance = compareText(guess.firstAppearance, target.firstAppearance);
    const guessEpisode = /^Episode\s+(\d+)$/i.exec(guess.firstAppearance || '');
    const targetEpisode = /^Episode\s+(\d+)$/i.exec(target.firstAppearance || '');
    if (guessEpisode && targetEpisode && Number(guessEpisode[1]) !== Number(targetEpisode[1])) {
        appearance.direction = Number(targetEpisode[1]) > Number(guessEpisode[1]) ? 'later' : 'earlier';
    }
    return {
        type,
        abilities: {
            value: guessedTags.map(tag => tag.label).join(' · ') || 'Uncategorized',
            status: !guessedTags.length || !targetTags.length ? 'unknown' : shared.length === guessedTags.length && shared.length === targetTags.length ? 'correct' : shared.length ? 'partial' : 'incorrect',
        },
        arc,
        canon: compareBoolean(guess.isCanon, target.isCanon, 'Canon', 'Non-canon'),
        awakening: compareBoolean(guess.isAwakened, target.isAwakened, 'Confirmed', 'Not confirmed'),
        user: compareText(guess.user, target.user),
        power: compareNumber(guess.power, target.power, { near: 10 }),
        attack: compareNumber(guess.ratings?.attack, target.ratings?.attack, { near: 10 }),
        defense: compareNumber(guess.ratings?.defense, target.ratings?.defense, { near: 10 }),
        utility: compareNumber(guess.ratings?.utility, target.ratings?.utility, { near: 10 }),
        rarity: compareNumber(guess.rarity, target.rarity),
        appearance,
    };
}

export const CLUE_STATUS = { correct: 'Match', partial: 'Partial / close', incorrect: 'Different', unknown: 'Unknown' };
export const CLUE_SYMBOL = { correct: '✓', partial: '≈', incorrect: '×', unknown: '?' };

export function clueDescription(clue, label) {
    return `${label}: ${clue.value}. ${CLUE_STATUS[clue.status]}.${clue.direction ? ` The mystery fruit is ${clue.direction}.` : ''}`;
}
