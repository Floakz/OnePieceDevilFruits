export const CHARACTER_DESCRIPTION = 'Explore One Piece characters introduced from East Blue through Arabasta, with their abilities, Devil Fruits, and full stories behind a spoiler warning.';
export const CHARACTER_INTRO = 'Devil Fruit users introduced from East Blue through Arabasta.';
export const CHARACTER_GROUPS = ['Straw Hats', 'Baroque Works', 'Marines', 'Kingdom allies', 'Other pirates', 'Non-canon'];
export const CHARACTER_PAGE_SIZE = 12;

export function getCharacterStory(profile) {
    return {
        warning: profile.canon === false ? 'Anime-only story' : 'Includes later manga spoilers',
        sections: [
            { title: profile.canon === false ? 'Warship Island' : 'Through Arabasta', paragraphs: profile.story },
            ...(profile.laterStory || []),
        ],
    };
}

const normalize = value => String(value).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function filterCharacters(profiles, query = '', group = 'all') {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return profiles.filter(profile => {
        if (group !== 'all' && profile.group !== group) return false;
        const text = normalize([profile.name, profile.japaneseName, profile.romanizedName, profile.alias, profile.group, profile.role, profile.debutArc, profile.fruitName, profile.fruitRomanizedName].join(' '));
        return terms.every(term => text.includes(term));
    });
}

export function paginateCharacters(profiles, { query = '', group = 'all', page = 1 } = {}) {
    const filtered = filterCharacters(profiles, query, group);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / CHARACTER_PAGE_SIZE));
    const requested = Number(page);
    const currentPage = Math.min(Number.isSafeInteger(requested) && requested > 0 ? requested : 1, totalPages);
    const start = (currentPage - 1) * CHARACTER_PAGE_SIZE;
    const visible = filtered.slice(start, start + CHARACTER_PAGE_SIZE);
    return { visible, total, totalPages, currentPage, rangeStart: total ? start + 1 : 0, rangeEnd: start + visible.length };
}

export function characterPageUrl(page, queryParams = {}) {
    const params = new URLSearchParams(queryParams);
    params.delete('page');
    const path = page > 1 ? `/characters/page/${page}` : '/characters';
    return params.size ? `${path}?${params}` : path;
}
