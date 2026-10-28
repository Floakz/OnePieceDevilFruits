import { useCallback, useEffect, useState } from 'react';
import characterIndex from '../lib/characterIndex.js';
import { loadCharacterProfile } from '../lib/characterProfilesApi.js';

export default function useCharacterProfile(slug) {
    const entry = characterIndex.find(character => character.slug === slug);
    const [result, setResult] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const retry = useCallback(() => setAttempt(value => value + 1), []);

    useEffect(() => {
        if (!entry) return;
        let active = true;
        setResult({ key: entry.profilePath, status: 'loading' });
        loadCharacterProfile(entry).then(profile => {
            if (active) setResult({ key: entry.profilePath, status: 'ready', profile });
        }).catch(() => {
            if (active) setResult({ key: entry.profilePath, status: 'error' });
        });
        return () => { active = false; };
    }, [entry, attempt]);

    const current = result?.key === entry?.profilePath ? result : null;
    return { entry, profile: current?.profile, status: !entry ? 'not-found' : current?.status || 'loading', retry };
}
