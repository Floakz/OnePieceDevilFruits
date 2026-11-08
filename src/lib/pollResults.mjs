function getTimestampMillis(value) {
    if (value && typeof value.toDate === 'function') return value.toDate().getTime();
    const millis = new Date(value).getTime();
    return Number.isFinite(millis) ? millis : null;
}

function compareNames(left, right) {
    const comparison = new Intl.Collator('en', { sensitivity: 'base' }).compare(left.name, right.name);
    if (comparison !== 0) return comparison;
    return String(left.id).localeCompare(String(right.id), 'en');
}

export function detectBallotBursts(ballots, { windowMs = 5000, minimumBallots = 3 } = {}) {
    const datedBallots = ballots
        .map(ballot => ({ ballot, millis: getTimestampMillis(ballot.createdAt) }))
        .filter(item => item.millis !== null)
        .sort((left, right) => left.millis - right.millis);
    const bursts = [];
    let start = 0;

    while (start < datedBallots.length) {
        let end = start + 1;
        while (end < datedBallots.length && datedBallots[end].millis - datedBallots[start].millis <= windowMs) {
            end++;
        }

        if (end - start >= minimumBallots) {
            bursts.push({
                ballots: end - start,
                startAt: new Date(datedBallots[start].millis).toISOString(),
                endAt: new Date(datedBallots[end - 1].millis).toISOString(),
            });
            start = end;
        } else {
            start++;
        }
    }

    return bursts;
}

export function calculatePollResults(ballots, fruits, {
    topN = 25,
    burstWindowMs = 5000,
    burstMinimumBallots = 3,
} = {}) {
    const fruitById = new Map(fruits.map(fruit => [String(fruit.id), fruit]));
    const totals = new Map(fruits.map(fruit => [String(fruit.id), {
        id: String(fruit.id),
        name: fruit.name,
        points: 0,
        firstPlaceVotes: 0,
        secondPlaceVotes: 0,
        thirdPlaceVotes: 0,
    }]));
    const validBallots = [];
    let ignoredBallots = 0;

    for (const ballot of ballots) {
        const choices = [ballot.first, ballot.second, ballot.third];
        if (
            choices.some(id => typeof id !== 'string' || !fruitById.has(id))
            || new Set(choices).size !== 3
        ) {
            ignoredBallots++;
            continue;
        }

        const first = totals.get(choices[0]);
        const second = totals.get(choices[1]);
        const third = totals.get(choices[2]);
        first.points += 3;
        first.firstPlaceVotes++;
        second.points += 2;
        second.secondPlaceVotes++;
        third.points++;
        third.thirdPlaceVotes++;
        validBallots.push(ballot);
    }

    const ranking = [...totals.values()]
        .sort((left, right) => right.points - left.points
            || right.firstPlaceVotes - left.firstPlaceVotes
            || right.secondPlaceVotes - left.secondPlaceVotes
            || compareNames(left, right))
        .slice(0, Math.max(0, topN))
        .map((fruit, index) => ({ rank: index + 1, ...fruit }));

    return {
        totalVoters: validBallots.length,
        ignoredBallots,
        ranking,
        anomalies: detectBallotBursts(validBallots, {
            windowMs: burstWindowMs,
            minimumBallots: burstMinimumBallots,
        }),
    };
}
