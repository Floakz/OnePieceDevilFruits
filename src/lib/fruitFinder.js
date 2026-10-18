import { getAbilityTags } from './fruitDiscovery.js';
import fruitsExpandedInfo from './fruits/fruitsExpandedInfo.js';

export const FINDER_PAGE = {
    title: 'Devil Fruit Finder Quiz — Find Your One Piece Power',
    description: 'Answer eight questions from a rotating pool to find a One Piece Devil Fruit that fits you. Matches follow your choices, with variety when several fruits fit closely.',
    url: 'https://onepiecedevilfruits.com/fruit-finder/',
};

const coreQuestions = [
    {
        id: 'goal', question: 'What would you want your power to do first?',
        answers: [
            { id: 'protect', label: 'Keep my crew safe.', tags: { protection: 7, healing: 6, binding: 3 }, reason: 'You wanted a way to protect your crew.' },
            { id: 'travel', label: 'Take me places I couldn’t reach before.', tags: { movement: 7, flight: 7, space: 5 }, reason: 'You wanted more freedom to get around.' },
            { id: 'outsmart', label: 'Give me an edge nobody sees coming.', tags: { stealth: 7, mind: 6, disabling: 5, time: 5, aim: 4 }, reason: 'You wanted to catch people off guard.' },
            { id: 'fight', label: 'Help me win a fight.', tags: { strength: 7, force: 6, cutting: 6, explosions: 5, elements: 5, transformation: 4 }, reason: 'You wanted a power you could fight with.' },
        ],
    },
    {
        id: 'approach', question: 'If you have to fight, how would you handle it?',
        answers: [
            { id: 'close', label: 'Get in close and take them on.', tags: { strength: 5, transformation: 5, body: 5, cutting: 4 }, reason: 'You preferred fighting up close.' },
            { id: 'distance', label: 'Keep my distance and pick my moment.', tags: { elements: 5, aim: 5, summoning: 4, sound: 4, explosions: 3 }, reason: 'You preferred fighting from a distance.' },
            { id: 'control', label: 'Trap them or take away their options.', tags: { binding: 5, disabling: 5, terrain: 4, time: 4, mind: 4 }, reason: 'You wanted to control how a fight plays out.' },
            { id: 'escape', label: 'Get everyone out before it gets worse.', tags: { movement: 5, space: 5, flight: 4, protection: 3 }, reason: 'You would rather get people out of danger.' },
        ],
    },
    {
        id: 'everyday', question: 'What would you use it for on an ordinary day?',
        answers: [
            { id: 'make', label: 'Make things and fix what’s broken.', tags: { creation: 6, terrain: 3, liquids: 2 }, reason: 'You wanted a power for making things.' },
            { id: 'help', label: 'Look after people who need help.', tags: { healing: 6, protection: 3 }, reason: 'You wanted to help people outside a fight.' },
            { id: 'quiet', label: 'Go about my business without being noticed.', tags: { stealth: 6, mind: 3, sound: 2 }, reason: 'You wanted to stay out of sight.' },
            { id: 'practical', label: 'Move supplies and make awkward jobs easier.', tags: { space: 6, movement: 4, size: 4, strength: 3 }, reason: 'You wanted a practical power for everyday jobs.' },
        ],
    },
    {
        id: 'escape', question: 'You’re trapped and need to get out. What would help most?',
        answers: [
            { id: 'air', label: 'Take to the air.', tags: { flight: 7 }, reason: 'You wanted to be able to take to the air.' },
            { id: 'shortcut', label: 'Find a way through that nobody else can use.', tags: { space: 7, movement: 5, body: 2 }, reason: 'You wanted a way past normal obstacles.' },
            { id: 'shelter', label: 'Keep everyone safe until help arrives.', tags: { protection: 7, creation: 3 }, reason: 'You wanted a safe place to hold out.' },
            { id: 'surroundings', label: 'Change the surroundings and make an exit.', tags: { terrain: 7, force: 4, size: 3 }, reason: 'You wanted to change the ground around you.' },
        ],
    },
    {
        id: 'form', question: 'Which sounds the most fun to use?',
        answers: [
            { id: 'element', label: 'Become an element, like fire or ice.', family: 'Logia', reason: 'You liked the idea of an elemental body.' },
            { id: 'animal', label: 'Turn into an animal or a mythical creature.', family: 'Zoan', reason: 'You liked the idea of an animal transformation.' },
            { id: 'unusual', label: 'Have an unusual power I can get creative with.', family: 'Paramecia', reason: 'You preferred an unusual power with room to experiment.' },
            { id: 'open', label: 'I’m open to any of them.' },
        ],
    },
    {
        id: 'priority', question: 'Pick the thing you’d hate to be without.',
        answers: [
            { id: 'attack', label: 'Enough force to finish a fight.', stat: 'attack' },
            { id: 'defense', label: 'A defense I can rely on.', stat: 'defense' },
            { id: 'utility', label: 'A power with plenty of everyday uses.', stat: 'utility' },
        ],
    },
    {
        id: 'drawback', question: 'Which downside would put you off the most?',
        answers: [
            { id: 'setup', label: 'Needing setup or special conditions first.', avoid: 'setup' },
            { id: 'contact', label: 'Having to get close enough to touch someone.', avoid: 'contact' },
            { id: 'stamina', label: 'Getting worn out after using it.', avoid: 'stamina' },
            { id: 'collateral', label: 'Struggling to use it safely around other people.', avoid: 'collateral' },
        ],
    },
    {
        id: 'canon', question: 'Should we include fruits from films and other non-canon stories?',
        answers: [
            { id: 'canon', label: 'Stick to canon fruits.' },
            { id: 'all', label: 'Include everything in the catalog.' },
        ],
    },
];

const questionVariants = [
    {
        id: 'crew-role', group: 'goal', question: 'What would your crewmates rely on you for?',
        labels: { protect: 'Keeping people safe when things get rough.', travel: 'Finding a way to places we can’t normally reach.', outsmart: 'Getting the upper hand without anyone noticing.', fight: 'Taking on the strongest opponent.' },
    },
    {
        id: 'roadblock', group: 'approach', question: 'A stronger enemy blocks the road. What’s your plan?',
        labels: { close: 'Get close enough to land a proper hit.', distance: 'Stay out of reach and strike from there.', control: 'Stop them moving before making my move.', escape: 'Find a safe route around them.' },
    },
    {
        id: 'shore-leave', group: 'everyday', question: 'Your ship has docked for a few days. Where would you help out?',
        labels: { make: 'Build or repair what the crew needs.', help: 'Help the injured crew recover.', quiet: 'Scout the area without drawing attention.', practical: 'Unload the ship and move supplies.' },
    },
    {
        id: 'blocked-route', group: 'escape', question: 'The way back to your ship is blocked. What would you do?',
        labels: { air: 'Look for a route through the air.', shortcut: 'Open a different way through.', shelter: 'Hold out somewhere safe until help comes.', surroundings: 'Move or reshape whatever’s blocking us.' },
    },
    {
        id: 'training', group: 'form', question: 'What would you most enjoy learning to control?',
        labels: { element: 'An elemental body.', animal: 'An animal or hybrid form.', unusual: 'A strange ability with tricks to figure out.', open: 'Any power, as long as it’s useful.' },
    },
    {
        id: 'backup-plan', group: 'priority', question: 'A mission goes wrong. Which backup would you want most?',
        labels: { attack: 'Enough force to break through.', defense: 'Something that can take a hit.', utility: 'A power that gives me another way to solve it.' },
    },
    {
        id: 'dealbreaker', group: 'drawback', question: 'What would make you regret choosing a fruit?',
        labels: { setup: 'It only works after I’ve prepared everything.', contact: 'I need to touch the target first.', stamina: 'It drains me too quickly.', collateral: 'I can’t use it safely with people nearby.' },
    },
];

export const FINDER_QUESTIONS = [
    ...coreQuestions.map(question => ({ ...question, group: question.id })),
    ...questionVariants.map(variant => {
        const original = coreQuestions.find(question => question.id === variant.group);
        return { id: variant.id, group: variant.group, question: variant.question, answers: original.answers.map(answer => ({ ...answer, label: variant.labels[answer.id] })) };
    }),
];
export const FINDER_QUESTION_COUNT = coreQuestions.length;
export const FINDER_DEFAULT_QUESTION_IDS = coreQuestions.map(question => question.id);
export const INITIAL_FINDER_STATE = { version: 2, phase: 'intro', questionIds: [], questionIndex: 0, answers: {}, resultRoll: 0, editingQuestionId: null };
export const FINDER_SESSION_KEY = 'fruit-finder-session-v1';
const questionsById = new Map(FINDER_QUESTIONS.map(question => [question.id, question]));

export function getFinderQuestion(id) { return questionsById.get(id); }

function validQuestionSet(questionIds) {
    return Array.isArray(questionIds) && questionIds.length === FINDER_QUESTION_COUNT
        && new Set(questionIds).size === FINDER_QUESTION_COUNT
        && questionIds.every(id => questionsById.has(id))
        && new Set(questionIds.map(id => questionsById.get(id).group)).size === FINDER_QUESTION_COUNT;
}

export function createFinderRun({ random = Math.random } = {}) {
    // One question from each subject keeps shuffled runs balanced.
    const questionIds = FINDER_DEFAULT_QUESTION_IDS.map(group => {
        const pool = FINDER_QUESTIONS.filter(question => question.group === group);
        return pool[Math.floor(random() * pool.length)].id;
    });
    for (let index = questionIds.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [questionIds[index], questionIds[other]] = [questionIds[other], questionIds[index]];
    }
    return { ...INITIAL_FINDER_STATE, phase: 'questions', questionIds, answers: {}, resultRoll: random() };
}

export function finderAnswersComplete(answers, questionIds = FINDER_DEFAULT_QUESTION_IDS) {
    return validQuestionSet(questionIds) && questionIds.every(id => questionsById.get(id).answers.some(answer => answer.id === answers?.[id]));
}

export function restoreFinderState(saved) {
    if (!saved || (saved.version !== undefined && saved.version !== 2)) return null;
    if (saved.version === undefined) {
        const complete = finderAnswersComplete(saved.answers);
        saved = { ...saved, version: 2, questionIds: saved.phase === 'intro' ? [] : FINDER_DEFAULT_QUESTION_IDS, resultRoll: 0, editingQuestionId: null,
            phase: saved.phase === 'questions' && complete ? 'review' : saved.phase };
    }
    if (!['intro', 'questions', 'review', 'editing', 'result'].includes(saved.phase)
        || !Number.isInteger(saved.questionIndex) || saved.questionIndex < 0 || saved.questionIndex >= FINDER_QUESTION_COUNT
        || !saved.answers || typeof saved.answers !== 'object' || Array.isArray(saved.answers)
        || !Number.isFinite(saved.resultRoll) || saved.resultRoll < 0 || saved.resultRoll >= 1) return null;
    if (saved.phase === 'intro') return Array.isArray(saved.questionIds) && !saved.questionIds.length && !Object.keys(saved.answers).length && saved.questionIndex === 0 && saved.editingQuestionId === null ? { ...INITIAL_FINDER_STATE, questionIds: [], answers: {} } : null;
    if (!validQuestionSet(saved.questionIds)) return null;
    if (!Object.entries(saved.answers).every(([id, value]) => saved.questionIds.includes(id) && questionsById.get(id).answers.some(answer => answer.id === value))) return null;
    if (!saved.questionIds.slice(0, saved.questionIndex).every(id => saved.answers[id])) return null;
    if (saved.phase === 'result' && !finderAnswersComplete(saved.answers, saved.questionIds)) return null;
    if (saved.phase === 'review' && !Object.keys(saved.answers).length) return null;
    if (saved.phase === 'editing' ? !saved.questionIds.includes(saved.editingQuestionId) || !saved.answers[saved.editingQuestionId] : saved.editingQuestionId !== null) return null;
    return { version: 2, phase: saved.phase, questionIds: [...saved.questionIds], questionIndex: saved.questionIndex, answers: { ...saved.answers }, resultRoll: saved.resultRoll, editingQuestionId: saved.editingQuestionId };
}

export function finderReducer(state, action) {
    if (action.type === 'START') {
        const run = restoreFinderState(action.run);
        return run?.phase === 'questions' && !Object.keys(run.answers).length && run.questionIndex === 0 ? run : state;
    }
    if (action.type === 'REVIEW' && ['questions', 'result'].includes(state.phase) && Object.keys(state.answers).length) return { ...state, phase: 'review' };
    if (action.type === 'EDIT' && state.phase === 'review' && state.questionIds.includes(action.questionId) && state.answers[action.questionId]) return { ...state, phase: 'editing', editingQuestionId: action.questionId };
    if (action.type === 'CANCEL_EDIT' && state.phase === 'editing') return { ...state, phase: 'review', editingQuestionId: null };
    if (action.type === 'RESUME' && state.phase === 'review') {
        if (finderAnswersComplete(state.answers, state.questionIds)) return { ...state, phase: 'result' };
        return { ...state, phase: 'questions', questionIndex: state.questionIds.findIndex(id => !state.answers[id]) };
    }
    if (!['questions', 'editing'].includes(state.phase)) return state;
    const question = questionsById.get(state.phase === 'editing' ? state.editingQuestionId : state.questionIds[state.questionIndex]);
    if (action.type !== 'ANSWER' || action.questionId !== question?.id || !question.answers.some(answer => answer.id === action.answerId)) return state;
    const answers = { ...state.answers, [question.id]: action.answerId };
    if (state.phase === 'editing') return { ...state, phase: 'review', answers, editingQuestionId: null };
    return {
        ...state, answers,
        phase: state.questionIndex === state.questionIds.length - 1 ? 'result' : 'questions',
        questionIndex: Math.min(state.questionIndex + 1, state.questionIds.length - 1),
    };
}

const drawbackPatterns = {
    setup: /prepar|setup|set.up|requires.*(?:gesture|condition)|must.*(?:touch|eat|see|hear|know|mark)/i,
    contact: /\btouch\b|physical contact|direct contact|close.range|short.range|get close|melee/i,
    stamina: /stamina|exhaust|fatigue|drain|tiring|taxing|energy consumption/i,
    collateral: /bystander|collateral|friendly fire|indiscriminate|uncontroll|hard to control|difficult to control|(?:harm|hurt|injur|hinder|damage|danger|risk).*(?:allies|crew|teammates)|(?:allies|crew|teammates).*(?:harm|hurt|injur|danger)/i,
};
const standardWeakness = /seawater|seastone|sea.stone|standard devil/i;
const familyOf = fruit => ['Logia', 'Zoan', 'Paramecia'].find(family => fruit.type?.includes(family));

export function findFruitMatches(fruits, answers, { details = fruitsExpandedInfo, limit = 3, questionIds = FINDER_DEFAULT_QUESTION_IDS } = {}) {
    if (!finderAnswersComplete(answers, questionIds)) return [];
    const extraById = new Map(details.map(fruit => [String(fruit.id), fruit]));
    const choices = questionIds.map(id => { const question = questionsById.get(id); return { question, answer: question.answers.find(answer => answer.id === answers[id]) }; });
    const seen = new Set();
    return fruits.filter(fruit => {
        if (!fruit.id || !fruit.name || seen.has(String(fruit.id)) || (answers.canon === 'canon' && fruit.isCanon !== true)) return false;
        seen.add(String(fruit.id));
        return true;
    }).map(fruit => {
        const extra = extraById.get(String(fruit.id)) || {};
        const tags = getAbilityTags(fruit);
        const weaknesses = (extra.weaknesses || []).filter(text => !standardWeakness.test(text));
        const reasons = [];
        let score = 0;
        let abilityMatchCount = 0;
        let avoidedDrawback;
        for (const { question, answer } of choices) {
            // One ability score per question: having lots of tags alone should not win.
            const matched = tags.filter(tag => answer.tags?.[tag.id]).sort((a, b) => answer.tags[b.id] - answer.tags[a.id] || a.id.localeCompare(b.id))[0];
            if (matched) {
                abilityMatchCount++;
                const points = answer.tags[matched.id];
                score += points;
                reasons.push({ questionId: question.id, key: matched.id, points, text: `${matched.label} — ${answer.reason.charAt(0).toLowerCase()}${answer.reason.slice(1)}` });
            }
            if (answer.family && familyOf(fruit) === answer.family) {
                score += 3;
                reasons.push({ questionId: question.id, key: 'family', points: 3, text: `${answer.family} — ${answer.reason.charAt(0).toLowerCase()}${answer.reason.slice(1)}` });
            }
            if (answer.stat) {
                const rating = extra.ratings?.[answer.stat];
                // Editorial stats add at most 1.5 points. Missing ratings stay neutral.
                score += 1.5 * (Number.isFinite(rating) ? Math.max(0, Math.min(100, rating)) / 100 : .5);
            }
            if (answer.avoid) {
                avoidedDrawback = weaknesses.find(text => drawbackPatterns[answer.avoid].test(text));
                if (avoidedDrawback) score -= 5;
            }
        }
        const reasonKeys = new Set();
        const distinctReasons = reasons.sort((a, b) => b.points - a.points || a.questionId.localeCompare(b.questionId)).filter(reason => {
            if (reasonKeys.has(reason.key)) return false;
            reasonKeys.add(reason.key);
            return true;
        }).slice(0, 3);
        return {
            fruit, score, abilityMatchCount, reasons: distinctReasons.map(reason => reason.text),
            summary: (extra.abilities?.[0] || fruit.about || '').split(/(?<=[.!?])\s+/)[0],
            drawback: avoidedDrawback || weaknesses[0] || null,
            hasAvoidedDrawback: Boolean(avoidedDrawback),
        };
    }).sort((a, b) => b.score - a.score || a.fruit.name.localeCompare(b.fruit.name, 'en') || String(a.fruit.id).localeCompare(String(b.fruit.id), 'en'))
        .slice(0, Math.max(0, limit));
}

export function getFinderCandidates(matches) {
    const best = matches[0];
    if (!best) return [];
    if (best.score <= 0 || best.abilityMatchCount < 2) return [best];
    // Build a pool of good fits, then give each one the same chance.
    // Require multiple matching answers so a loose coincidence cannot enter the draw.
    const cutoff = best.score * .65;
    const minimumMatches = Math.max(2, best.abilityMatchCount - 1);
    return matches.filter(match => match.score >= cutoff && match.abilityMatchCount >= minimumMatches
        && (best.hasAvoidedDrawback || !match.hasAvoidedDrawback));
}

export function pickFinderMatch(matches, roll) {
    const candidates = getFinderCandidates(matches);
    if (candidates.length <= 1 || !Number.isFinite(roll) || roll < 0 || roll >= 1) return candidates[0] || null;
    return candidates[Math.floor(roll * candidates.length)];
}
