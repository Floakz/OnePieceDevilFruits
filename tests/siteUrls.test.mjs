import test from 'node:test';
import assert from 'node:assert/strict';
import { SITE_URL, normalizeStructuredUrls, withTrailingSlash } from '../src/lib/siteUrls.js';

test('page URLs use a trailing slash before queries and fragments', () => {
    for (const prefix of ['', SITE_URL]) {
        assert.equal(withTrailingSlash(`${prefix}/fruit/glare-glare-fruit`), `${prefix}/fruit/glare-glare-fruit/`);
        assert.equal(withTrailingSlash(`${prefix}/logia?page=2#fruit-list`), `${prefix}/logia/?page=2#fruit-list`);
        assert.equal(withTrailingSlash(`${prefix}/?ability=flight#fruit-filters`), `${prefix}/?ability=flight#fruit-filters`);
        assert.equal(withTrailingSlash(`${prefix}/quizzes/`), `${prefix}/quizzes/`);
    }
    assert.equal(withTrailingSlash(SITE_URL), `${SITE_URL}/`);
});

test('normalization preserves assets, external destinations, and missing values', () => {
    for (const value of [undefined, null, '', '/sitemap.xml', '/404.html', `${SITE_URL}/assets/preview.jpg`,
        'https://cd-opf.pages.dev/fruits/fruit.webp', 'https://schema.org', 'https://example.com/page',
        '//example.com/page', `${SITE_URL}.example.com/page`, '#fruit-facts']) {
        assert.equal(withTrailingSlash(value), value);
    }
});

test('structured page and breadcrumb URLs agree without changing images or source data', () => {
    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'WebPage', url: `${SITE_URL}/fruit/glare-glare-fruit`, image: `${SITE_URL}/images/fruit.webp` },
            { '@type': 'BreadcrumbList', itemListElement: [{ item: `${SITE_URL}/paramecia` }] },
            { '@id': `${SITE_URL}/blind-ranking#game`, count: 10, value: null },
        ],
    };
    const original = structuredClone(data);
    const normalized = normalizeStructuredUrls(data);
    assert.equal(normalized['@graph'][0].url, `${SITE_URL}/fruit/glare-glare-fruit/`);
    assert.equal(normalized['@graph'][0].image, data['@graph'][0].image);
    assert.equal(normalized['@graph'][1].itemListElement[0].item, `${SITE_URL}/paramecia/`);
    assert.equal(normalized['@graph'][2]['@id'], `${SITE_URL}/blind-ranking/#game`);
    assert.deepEqual(data, original);
    assert.deepEqual(normalizeStructuredUrls(normalized), normalized);
});
