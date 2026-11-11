export const POLL_ENABLED = true;

export const POLL_YEAR = 2026;
export const POLL_OPEN_AT = '2026-11-03T00:00:00.000Z';
export const POLL_CLOSE_AT = '2027-01-02T00:00:00.000Z';
export const POLL_TOP_N = 25;
export const POLL_ELIGIBLE_FRUIT_POLICY = 'all-catalog-fruits';

export const POLL_TYPES = ['Paramecia', 'Zoan', 'Logia'];

export function getPollState(now = Date.now()) {
    const opensAt = Date.parse(POLL_OPEN_AT);
    const closesAt = Date.parse(POLL_CLOSE_AT);
    if (now < opensAt) return 'upcoming';
    if (now >= closesAt) return 'closed';
    return 'open';
}

export function getPollTypeCategory(type = '') {
    if (type.includes('Paramecia')) return 'Paramecia';
    if (type.includes('Zoan')) return 'Zoan';
    if (type === 'Logia') return 'Logia';
    return null;
}

export function getEligibleFruits(fruits) {
    if (POLL_ELIGIBLE_FRUIT_POLICY === 'all-catalog-fruits') return fruits;
    if (POLL_ELIGIBLE_FRUIT_POLICY === 'canon-only') return fruits.filter(fruit => fruit.isCanon === true);
    throw new Error(`Unknown poll fruit eligibility policy: ${POLL_ELIGIBLE_FRUIT_POLICY}`);
}
