import { CHARACTER_DESCRIPTION, characterPageUrl } from './characterCatalog.js';

const SITE = 'https://onepiecedevilfruits.com';

export function getCharacterSeo(character) {
    if (!character) return {
        title: 'Character not found | One Piece Devil Fruits',
        description: 'This character is not in our collection.',
        canonical: `${SITE}/characters`,
        noindex: true,
    };

    const name = character.seoName || character.name;
    const description = character.seoDescription || character.about;
    const canonical = `${SITE}/characters/${character.slug}`;
    const image = character.portrait ? new URL(character.portrait, SITE).href : undefined;
    return {
        title: `${name} | One Piece Devil Fruits`,
        description,
        canonical,
        image,
        type: 'article',
        jsonLd: {
            '@context': 'https://schema.org', '@graph': [
                {
                    '@type': 'BreadcrumbList', itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                        { '@type': 'ListItem', position: 2, name: 'Characters', item: `${SITE}/characters` },
                        { '@type': 'ListItem', position: 3, name: character.name, item: canonical },
                    ],
                },
                {
                    '@type': 'WebPage', name, url: canonical, description, image,
                    alternateName: [...new Set([character.name, character.japaneseName, character.romanizedName, character.alias].filter(Boolean))],
                },
            ],
        },
    };
}

export function getCharactersSeo(page = 1) {
    const canonical = `${SITE}${characterPageUrl(page)}`;
    return {
        title: `${page > 1 ? `Page ${page} — ` : ''}Characters — East Blue to Arabasta | One Piece Devil Fruits`,
        description: CHARACTER_DESCRIPTION,
        canonical,
        jsonLd: {
            '@context': 'https://schema.org', '@type': 'CollectionPage',
            name: 'One Piece Characters', url: canonical, description: CHARACTER_DESCRIPTION,
        },
    };
}
