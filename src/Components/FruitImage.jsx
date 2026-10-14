import { useState } from 'react';

export default function FruitImage({ fruit, kind = 'fruit', src, alt, onLoad, onError, ...props }) {
    const cdn = import.meta.env.VITE_CDN_BASE;
    const folder = kind === 'character' ? 'characters' : 'fruits';
    const placeholder = `/images/${kind === 'character' ? 'character' : 'fruit'}-placeholder.svg`;
    const sources = [...new Set([
        src || (fruit?.id && cdn ? `${cdn}/${folder}/${fruit.id}.webp` : null),
        fruit?.id ? `/images/${folder}/${fruit.id}.webp` : null,
        kind === 'character' ? fruit?.img?.user : fruit?.img?.fruit,
        placeholder,
    ].filter(value => value && value !== 'noImg'))];
    const sourceKey = sources.join('|');
    const [failed, setFailed] = useState({ key: sourceKey, index: 0 });
    const index = failed.key === sourceKey ? failed.index : 0;
    return <img {...props} src={sources[index] || placeholder}
        alt={alt ?? (kind === 'character' ? fruit?.user || 'Unknown user' : fruit?.name || 'Devil Fruit')}
        onLoad={onLoad}
        onError={event => {
            if (index < sources.length - 1) setFailed({ key: sourceKey, index: index + 1 });
            else onError?.(event);
        }} />;
}
