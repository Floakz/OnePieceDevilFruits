export const SITE_URL = 'https://onepiecedevilfruits.com';

// Directory index pages are served with a trailing slash by the host.
// Leave assets, external URLs, query strings, and fragments intact.
export function withTrailingSlash(value) {
    if (typeof value !== 'string') return value;
    const local = value.startsWith('/') && !value.startsWith('//');
    const site = value === SITE_URL || value.startsWith(`${SITE_URL}/`)
        || value.startsWith(`${SITE_URL}?`) || value.startsWith(`${SITE_URL}#`);
    if (!local && !site) return value;

    const relative = site ? value.slice(SITE_URL.length) : value;
    const [, pathname, suffix] = relative.match(/^([^?#]*)(.*)$/);
    if (/\.[^/]+$/.test(pathname)) return value;
    const path = `${pathname.replace(/\/+$/, '')}/`;
    return `${site ? SITE_URL : ''}${path}${suffix}`;
}

export function normalizeStructuredUrls(value) {
    if (Array.isArray(value)) return value.map(normalizeStructuredUrls);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeStructuredUrls(item)]));
    }
    return withTrailingSlash(value);
}
