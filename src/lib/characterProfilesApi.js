const requests = new Map();

export function loadCharacterProfile(entry) {
    if (!requests.has(entry.profilePath)) {
        const request = fetch(entry.profilePath, { cache: 'force-cache' }).then(async response => {
            if (!response.ok) throw new Error('Character could not load');
            const profile = await response.json();
            if (profile.slug !== entry.slug || !Array.isArray(profile.background) || !Array.isArray(profile.story)) {
                throw new Error('Invalid character profile');
            }
            return profile;
        }).catch(error => {
            requests.delete(entry.profilePath);
            throw error;
        });
        requests.set(entry.profilePath, request);
    }
    return requests.get(entry.profilePath);
}
