// Keep the poll hidden until voting is ready to launch.
export const POLL_ENABLED = false;

export const POLL_YEAR = 2026;
export const POLL_OPEN_AT = '2026-11-03T00:00:00.000Z';
export const POLL_CLOSE_AT = '2027-01-02T00:00:00.000Z';
export const POLL_TOP_N = 25;
export const POLL_ELIGIBLE_FRUIT_POLICY = 'all-catalog-fruits';
export const POLL_LOCAL_STORAGE_KEY = `community-poll-${POLL_YEAR}-voted`;
export const POLL_LOCAL_BALLOT_KEY = `community-poll-${POLL_YEAR}-ballot`;
export const POLL_LOCAL_VOTER_ID_KEY = `community-poll-${POLL_YEAR}-voter-id`;

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

export function readLocalVotedFlag() {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem(POLL_LOCAL_STORAGE_KEY) === 'true';
    } catch (error) {
        console.warn('Could not read the poll status from local storage:', error);
        return false;
    }
}

export function setLocalVotedFlag(voted) {
    if (typeof window === 'undefined') return;
    try {
        if (voted) window.localStorage.setItem(POLL_LOCAL_STORAGE_KEY, 'true');
        else window.localStorage.removeItem(POLL_LOCAL_STORAGE_KEY);
    } catch (error) {
        console.warn('Could not update the poll status in local storage:', error);
    }
}
