const normalizeName = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

// A fruit can change hands. Match the named user as well as the fruit.
export function findFruitUserCharacter(profiles, fruitId, userName) {
    const name = normalizeName(userName);
    if (!fruitId || !name) return undefined;
    return profiles.find(profile => String(profile.fruitId) === String(fruitId)
        && [profile.name, profile.alias, profile.japaneseName, profile.romanizedName]
            .some(candidate => normalizeName(candidate) === name));
}
