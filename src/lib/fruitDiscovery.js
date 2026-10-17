import { FRUIT_ARC_ORDER } from './fruitArcs.js';

// Curated from the abilities in the catalog. Keep these explicit: matching words
// in weaknesses would, for example, give every fruit a water-related tag.
export const ABILITY_TAGS = [
    { id: 'elements', label: 'Elemental powers', names: ['Heat-Heat', 'Sickle-Sickle'] },
    { id: 'flight', label: 'Flight', names: ['Bird-Bird', 'Tweet-Tweet', 'Bug-Bug', 'Fish-Fish', 'Dragon-Dragon Fruit, Pteranodon', 'Dragon-Dragon Fruit, Model: Nidhöggr', 'Dragon-Dragon Fruit, Model: Kirin', 'Dino-Dino', 'Float-Float', 'Spin-Spin'] },
    { id: 'healing', label: 'Healing', names: ['Heal-Heal', 'Bird-Bird Fruit, Model: Phoenix', 'Horm-Horm', 'Op-Op'] },
    { id: 'movement', label: 'Movement', names: ['Warp-Warp', 'Door-Door', 'Swim-Swim', 'Spring-Spring', 'Float-Float', 'Paw-Paw', 'Mirror-Mirror', 'Wheel-Wheel', 'Roll-Roll', 'Arrow-Arrow'] },
    { id: 'binding', label: 'Binding & trapping', names: ['String-String', 'Bind-Bind', 'Sew-Sew', 'Wax-Wax', 'Lick-Lick', 'Stick-Stick', 'Thorn-Thorn', 'Book-Book', 'Swamp-Swamp'] },
    { id: 'creation', label: 'Creation', names: ['Garb-Garb', 'Cook-Cook', 'Bis-Bis', 'Wax-Wax', 'Lick-Lick', 'Arms-Arms', 'Brush-Brush', 'Glorp-Glorp', 'Smelt-Smelt', 'Cream-Cream', 'Butter-Butter', 'String-String', 'Munch-Munch', 'Straw-Straw'] },
    { id: 'body', label: 'Body alteration', names: ['Gum-Gum', 'Chop-Chop', 'Dice-Dice', 'Spike-Spike', 'Flower-Flower', 'Berry-Berry', 'Smooth-Smooth', 'Ripple-Ripple', 'Jacket-Jacket', 'Clone-Clone', 'Mochi-Mochi', 'Wheel-Wheel', 'Roll-Roll', 'Pile-Pile', 'Munch-Munch', 'Tone-Tone'] },
    { id: 'mind', label: 'Mind & senses', names: ['Memo-Memo', 'Glare-Glare', 'Brain-Brain', 'Hollow-Hollow', 'Love-Love', 'Millet-Millet', 'Vision-Vision', 'Dragon-Dragon Fruit, Model: Kirin', 'Hobby-Hobby', 'Ride-Ride', 'Whisper-Whisper'] },
    { id: 'size', label: 'Size & weight', names: ['Kilo-Kilo', 'Ton-Ton', 'Huge-Huge', 'Mini-Mini', 'Press-Press'] },
    { id: 'time', label: 'Time & aging', names: ['Time-Time', 'Age-Age', 'Ripe-Ripe', 'Slow-Slow'] },
    { id: 'space', label: 'Space & storage', names: ['Warp-Warp', 'Door-Door', 'Op-Op', 'Mirror-Mirror', 'Pocket-Pocket', 'Castle-Castle', 'Book-Book', 'Scroll-Scroll'] },
    { id: 'explosions', label: 'Explosions', names: ['Bomb-Bomb', 'Pop-Pop'] },
    { id: 'poison', label: 'Poison & disease', names: ['Venom-Venom', 'Sick-Sick', 'Gas-Gas', 'Snake-Snake Fruit, Model: King Cobra'] },
    { id: 'cutting', label: 'Cutting', names: ['Dice-Dice', 'Snip-Snip', 'Sickle-Sickle', 'String-String'] },
    { id: 'souls', label: 'Souls & shadows', names: ['Soul-Soul', 'Revive-Revive', 'Shadow-Shadow', 'Hollow-Hollow'] },
    { id: 'strength', label: 'Strength boosts', names: ['Strong-Strong', 'Pump-Pump'] },
    { id: 'protection', label: 'Protection', names: ['Barrier-Barrier', 'Twinkle-Twinkle', 'Turtle-Turtle', 'Bis-Bis', 'Wax-Wax', 'Castle-Castle'] },
    { id: 'terrain', label: 'Terrain control', names: ['Isle-Isle', 'Stone-Stone', 'Push-Push', 'Sand-Sand', 'Ice-Ice', 'Woods-Woods', 'Tremor-Tremor'] },
    { id: 'disabling', label: 'Disabling powers', names: ['Wash-Wash', 'Bubble-Bubble', 'Rust-Rust', 'Wring-Wring', 'Hobby-Hobby', 'Love-Love', 'Slow-Slow', 'Sick-Sick'] },
    { id: 'stealth', label: 'Stealth', names: ['Clear-Clear', 'Calm-Calm', 'Clone-Clone', 'Dog-Dog Fruit, Model: Nine Tailed Fox'] },
    { id: 'sound', label: 'Sound', names: ['Tone-Tone', 'Calm-Calm'] },
    { id: 'force', label: 'Force & shockwaves', names: ['Magnet-Magnet', 'Press-Press', 'Paw-Paw', 'Tremor-Tremor', 'Human-Human Fruit, Model: Buddha'] },
    { id: 'summoning', label: 'Summoning', names: ['Puff-Puff', 'Hollow-Hollow', 'Soul-Soul', 'Brush-Brush', 'Vision-Vision', 'Dragon-Dragon Fruit, Model: Kirin'] },
    { id: 'liquids', label: 'Liquid production', names: ['Glug-Glug', 'Cream-Cream', 'Butter-Butter', 'Bubble-Bubble', 'Venom-Venom'] },
    { id: 'aim', label: 'Targeting & luck', names: ['Mark-Mark', 'Luck-Luck'] },
    { id: 'transformation', label: 'Animal transformation', names: [] },
];

export function getAbilityTags(fruit) {
    return ABILITY_TAGS.filter(tag =>
        (tag.id === 'elements' && fruit.type === 'Logia')
        || (tag.id === 'transformation' && fruit.type?.includes('Zoan'))
        || tag.names.some(name => fruit.name?.startsWith(name))
    );
}

export const SORT_OPTIONS = [
    ['name-asc', 'Name: A–Z'], ['name-desc', 'Name: Z–A'],
    ['debut-asc', 'Debut: earliest first'], ['debut-desc', 'Debut: latest first'],
];

export const FILTER_DEFAULTS = { arc: 'all', canon: 'all', awakening: 'all', ability: 'all', sort: 'name-asc' };

export function readDiscoveryFilters(params) {
    const valid = {
        arc: FRUIT_ARC_ORDER, canon: ['canon', 'non-canon', 'unknown'],
        awakening: ['awakened', 'not-confirmed', 'unknown'],
        ability: ABILITY_TAGS.map(tag => tag.id), sort: SORT_OPTIONS.map(([value]) => value),
    };
    return Object.fromEntries(Object.entries(FILTER_DEFAULTS).map(([key, fallback]) => {
        const value = params.get(key);
        return [key, valid[key].includes(value) ? value : fallback];
    }));
}

export function filterAndSortFruits(fruits, filters) {
    const matchesStatus = (value, filter, yes, no) => filter === 'all'
        || (filter === yes && value === true)
        || (filter === no && value === false)
        || (filter === 'unknown' && typeof value !== 'boolean');
    const result = fruits.filter(fruit =>
        (filters.arc === 'all' || fruit.debutArc === filters.arc)
        && matchesStatus(fruit.isCanon, filters.canon, 'canon', 'non-canon')
        && matchesStatus(fruit.isAwakened, filters.awakening, 'awakened', 'not-confirmed')
        && (filters.ability === 'all' || getAbilityTags(fruit).some(tag => tag.id === filters.ability))
    );
    const byName = (a, b) => a.name.localeCompare(b.name) || String(a.id).localeCompare(String(b.id));
    return result.sort((a, b) => {
        if (filters.sort.startsWith('name')) return byName(a, b) * (filters.sort === 'name-desc' ? -1 : 1);
        const arcA = FRUIT_ARC_ORDER.indexOf(a.debutArc);
        const arcB = FRUIT_ARC_ORDER.indexOf(b.debutArc);
        // Unplaced debuts stay at the end in either direction.
        if (arcA === -1 || arcB === -1) return arcA === arcB ? byName(a, b) : arcA === -1 ? 1 : -1;
        return (arcA - arcB) * (filters.sort === 'debut-desc' ? -1 : 1) || byName(a, b);
    });
}

const comparisons = [
    ['Mera Mera', 'Magu Magu', 'Compare fire with magma: two different takes on heat.'],
    ['Hie Hie', 'Yuki Yuki', 'Ice and snow give these Logias different ways to control the cold.'],
    ['Kiro Kiro', 'Ton Ton', 'Both change body weight. Compare the limits of each.'],
    ['Toshi Toshi', 'Juku Juku', 'Both deal with aging, but they work in different ways.'],
    ['Wapu Wapu', 'Doa Doa', 'Teleportation or doorways: compare two ways to get around.'],
    ['Bari Bari', 'Kira Kira', 'Barriers or a diamond body: two approaches to protection.'],
    ['Supa Supa', 'Bara Bara', 'A body made of blades versus a body that splits apart.'],
    ['Bomu Bomu', 'Pamu Pamu', 'Both cause explosions, with different ways to set them off.'],
    ['Mato Mato', 'Raki Raki', 'Luck and perfect aim offer very different ways to land a hit.'],
];

export function getRelatedFruits(current, fruits, limit = 5) {
    const currentTags = getAbilityTags(current);
    const rootName = fruit => fruit.romanizedName?.split(' no Mi')[0];
    return fruits.filter(fruit => String(fruit.id) !== String(current.id)).map(fruit => {
        const pair = comparisons.find(([a, b]) =>
            (rootName(current) === a && rootName(fruit) === b)
            || (rootName(current) === b && rootName(fruit) === a));
        const shared = getAbilityTags(fruit).filter(tag => currentTags.some(other => other.id === tag.id));
        const specific = shared.filter(tag => !['transformation', 'elements'].includes(tag.id));
        const sameType = fruit.type === current.type;
        const sameModelFamily = current.type?.includes('Zoan') && rootName(current) && rootName(current) === rootName(fruit);
        const score = (pair ? 100 : 0) + specific.length * 12 + shared.length * 2 + (sameModelFamily ? 8 : 0) + (sameType && shared.length ? 3 : 0);
        const reason = pair?.[2] || (specific.length
            ? `Also offers ${specific.slice(0, 2).map(tag => tag.label.toLowerCase()).join(' and ')}${!sameType ? `, through a ${fruit.type} power` : ''}.`
            : sameModelFamily ? `A different model of the ${rootName(current)} fruit.`
                : shared.some(tag => tag.id === 'transformation')
                ? `Another animal transformation${sameType ? ` in the ${fruit.type} family` : `, this time a ${fruit.type}`}.`
                : sameType ? `Another ${fruit.type} to compare with this one.` : 'Another elemental power to explore.');
        return { ...fruit, reason, score };
    }).filter(fruit => fruit.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name) || String(a.id).localeCompare(String(b.id)))
        .slice(0, limit);
}
