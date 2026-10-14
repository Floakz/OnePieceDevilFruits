import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FINDER_QUESTIONS, FINDER_QUESTION_COUNT, FINDER_DEFAULT_QUESTION_IDS, INITIAL_FINDER_STATE, createFinderRun, finderAnswersComplete, finderReducer, findFruitMatches, getFinderCandidates, getFinderQuestion, pickFinderMatch, restoreFinderState } from '../src/lib/fruitFinder.js';

const catalog = JSON.parse(readFileSync(new URL('../public/data/fruits_v15.json', import.meta.url), 'utf8'));
const responses = changes => ({ goal: 'travel', approach: 'escape', everyday: 'practical', escape: 'shortcut', form: 'open', priority: 'utility', drawback: 'setup', canon: 'all', ...changes });
const makeRun = () => ({ ...createFinderRun({ random: () => 0 }), questionIds: [...FINDER_DEFAULT_QUESTION_IDS], resultRoll: .42 });
const start = () => finderReducer(INITIAL_FINDER_STATE, { type: 'START', run: makeRun() });
const answer = (state, answerId) => finderReducer(state, { type: 'ANSWER', questionId: state.phase === 'editing' ? state.editingQuestionId : state.questionIds[state.questionIndex], answerId });

test('rankings follow answers independently of catalog order; variation happens only at the draw', () => {
    const answers = responses();
    const original = structuredClone(catalog);
    const expected = findFruitMatches(catalog, answers);
    assert.deepEqual(findFruitMatches(catalog, answers), expected);
    assert.deepEqual(findFruitMatches([...catalog].reverse(), answers), expected);
    assert.deepEqual(catalog, original);
    assert.equal(new Set(expected.map(match => match.fruit.id)).size, 3);
});

test('travel, helping from the air, and making things lead to different powers', () => {
    const travel = findFruitMatches(catalog, responses())[0];
    const help = findFruitMatches(catalog, responses({ goal: 'protect', everyday: 'help', escape: 'air', form: 'animal' }))[0];
    const build = findFruitMatches(catalog, responses({ goal: 'protect', approach: 'control', everyday: 'make', escape: 'shelter', form: 'unusual', drawback: 'contact' }))[0];
    assert.equal(new Set([travel.fruit.id, help.fruit.id, build.fruit.id]).size, 3);
    assert.ok(travel.reasons.some(reason => /space|movement/i.test(reason)));
    assert.ok(help.reasons.some(reason => /flight/i.test(reason)));
    assert.ok(help.reasons.some(reason => /healing/i.test(reason)));
    assert.ok(build.reasons.some(reason => /creation/i.test(reason)));
});

test('canon-only excludes non-canon and unknown status; the open pool includes both', () => {
    const fruits = [true, false, undefined].map((isCanon, index) => ({ id: String(index), name: `Warp-Warp ${index}`, type: 'Paramecia', isCanon }));
    assert.deepEqual(findFruitMatches(fruits, responses({ canon: 'canon' })).map(match => match.fruit.id), ['0']);
    assert.equal(findFruitMatches(fruits, responses()).length, 3);
});

test('every catalog family is eligible, including Ancient, Mythical and Special types', () => {
    const matches = findFruitMatches(catalog, responses(), { limit: catalog.length });
    assert.equal(matches.length, catalog.length);
    assert.deepEqual(new Set(matches.map(match => match.fruit.type)), new Set(catalog.map(fruit => fruit.type)));
});

test('a listed drawback lowers an otherwise identical match and is explained if it still wins', () => {
    const fruits = [
        { id: 'a', name: 'Warp-Warp A', type: 'Paramecia' },
        { id: 'b', name: 'Warp-Warp B', type: 'Paramecia' },
    ];
    const details = [
        { id: 'a', weaknesses: ['Heavy stamina drain from repeated use.'] },
        { id: 'b', weaknesses: ['Requires direct physical contact.'] },
    ];
    assert.equal(findFruitMatches(fruits, responses({ drawback: 'stamina' }), { details })[0].fruit.id, 'b');
    assert.equal(findFruitMatches(fruits, responses({ drawback: 'contact' }), { details })[0].fruit.id, 'a');
    const only = findFruitMatches(fruits.slice(0, 1), responses({ drawback: 'stamina' }), { details })[0];
    assert.equal(only.hasAvoidedDrawback, true);
    assert.equal(only.drawback, details[0].weaknesses[0]);
});

test('generic seawater weaknesses are not mistaken for the chosen special drawback', () => {
    const fruit = { id: 'a', name: 'Warp-Warp A', type: 'Paramecia' };
    const match = findFruitMatches([fruit], responses({ drawback: 'stamina' }), { details: [{ id: 'a', weaknesses: ['Standard Devil Fruit weaknesses: seawater drains stamina.'] }] })[0];
    assert.equal(match.hasAvoidedDrawback, false);
    assert.equal(match.drawback, null);
});

test('editorial stats distinguish comparable powers without rewarding rarity or power scores', () => {
    const fruits = [
        { id: 'a', name: 'Warp-Warp A', type: 'Paramecia', power: 100, rarity: 10 },
        { id: 'b', name: 'Warp-Warp B', type: 'Paramecia', power: 1, rarity: 1 },
        { id: 'c', name: 'Warp-Warp C', type: 'Paramecia' },
    ];
    const details = [{ id: 'a', ratings: { attack: 90, utility: 20 } }, { id: 'b', ratings: { attack: 20, utility: 90 } }];
    assert.equal(findFruitMatches(fruits, responses(), { details })[0].fruit.id, 'b');
    assert.equal(findFruitMatches(fruits, responses({ priority: 'attack' }), { details })[0].fruit.id, 'a');
    assert.ok(findFruitMatches(fruits, responses(), { details }).every(match => Number.isFinite(match.score)));
});

test('incomplete or invalid answers cannot silently choose a fruit', () => {
    assert.equal(finderAnswersComplete({}), false);
    assert.deepEqual(findFruitMatches(catalog, {}), []);
    assert.deepEqual(findFruitMatches(catalog, responses({ goal: 'missing' })), []);
    assert.deepEqual(findFruitMatches(catalog, responses({ canon: 'missing' })), []);
    assert.deepEqual(findFruitMatches([], responses()), []);
});

test('answer events cannot skip questions; review edits one answer and returns to the list', () => {
    let state = start();
    const firstEvent = { type: 'ANSWER', questionId: 'goal', answerId: 'travel' };
    state = finderReducer(state, firstEvent);
    assert.equal(state.questionIndex, 1);
    assert.equal(finderReducer(state, firstEvent), state);
    state = finderReducer(state, { type: 'REVIEW' });
    assert.equal(state.phase, 'review');
    state = finderReducer(state, { type: 'EDIT', questionId: 'goal' });
    assert.equal(state.answers.goal, 'travel');
    state = answer(state, 'protect');
    assert.equal(state.phase, 'review');
    state = finderReducer(state, { type: 'RESUME' });
    assert.equal(state.questionIndex, 1);
    for (const id of FINDER_DEFAULT_QUESTION_IDS.slice(1)) state = answer(state, responses()[id]);
    assert.equal(state.phase, 'result');
    assert.equal(state.answers.goal, 'protect');
    state = finderReducer(state, { type: 'REVIEW' });
    assert.equal(state.phase, 'review');
    assert.equal(Object.keys(state.answers).length, 8);
    state = finderReducer(state, { type: 'EDIT', questionId: 'goal' });
    state = answer(state, 'outsmart');
    assert.equal(state.phase, 'review');
    state = finderReducer(state, { type: 'RESUME' });
    assert.equal(state.phase, 'result');
    assert.equal(state.answers.goal, 'outsmart');
    assert.equal(state.answers.escape, 'shortcut');
    assert.equal(state.resultRoll, .42);
    assert.deepEqual(state.questionIds, FINDER_DEFAULT_QUESTION_IDS);
});

test('a fresh attempt clears previous answers; result is unavailable before completion', () => {
    const state = answer(start(), 'protect');
    const run = createFinderRun({ random: () => .999 });
    assert.equal(finderReducer(state, { type: 'RESUME' }), state);
    assert.deepEqual(finderReducer(state, { type: 'START', run }), run);
    assert.deepEqual(run.answers, {});
});

test('a tab can restore quiz progress, completed matches, and edited answers', () => {
    const progress = { ...makeRun(), questionIndex: 2, answers: { goal: 'travel', approach: 'escape' } };
    const result = { ...makeRun(), phase: 'result', questionIndex: 7, answers: responses() };
    const review = { ...result, phase: 'review' };
    const editing = { ...review, phase: 'editing', editingQuestionId: 'everyday' };
    for (const state of [INITIAL_FINDER_STATE, progress, result, review, editing]) {
        assert.deepEqual(restoreFinderState(JSON.parse(JSON.stringify(state))), state);
    }
    const restored = restoreFinderState(result);
    const ranked = findFruitMatches(catalog, restored.answers, { questionIds: restored.questionIds });
    assert.deepEqual(pickFinderMatch(ranked, restored.resultRoll), pickFinderMatch(ranked, result.resultRoll));
});

test('damaged or outdated saved quizzes cannot skip questions or reveal unfinished results', () => {
    assert.equal(restoreFinderState(null), null);
    assert.equal(restoreFinderState({ phase: 'result', questionIndex: 7, answers: {} }), null);
    assert.equal(restoreFinderState({ phase: 'questions', questionIndex: 5, answers: { goal: 'protect' } }), null);
    assert.equal(restoreFinderState({ phase: 'questions', questionIndex: 0, answers: { goal: 'old-answer' } }), null);
    assert.equal(restoreFinderState({ phase: 'questions', questionIndex: 0, answers: { unknown: 'travel' } }), null);
    assert.equal(restoreFinderState({ phase: 'questions', questionIndex: 99, answers: responses() }), null);
    assert.equal(restoreFinderState({ ...makeRun(), questionIds: Array(8).fill('goal') }), null);
    assert.equal(restoreFinderState({ ...makeRun(), questionIds: ['crew-role', ...FINDER_DEFAULT_QUESTION_IDS.slice(0, 7)] }), null);
    assert.equal(restoreFinderState({ ...makeRun(), resultRoll: 1 }), null);
    assert.equal(restoreFinderState({ ...makeRun(), phase: 'editing', editingQuestionId: 'goal' }), null);
});

test('each run draws a balanced question subset and shuffles its order', () => {
    assert.ok(FINDER_QUESTIONS.length > FINDER_QUESTION_COUNT);
    const a = createFinderRun({ random: () => 0 });
    const b = createFinderRun({ random: () => .999 });
    for (const run of [a, b]) {
        assert.equal(new Set(run.questionIds).size, 8);
        assert.deepEqual(new Set(run.questionIds.map(id => getFinderQuestion(id).group)), new Set(FINDER_DEFAULT_QUESTION_IDS));
        assert.deepEqual(restoreFinderState(run), run);
    }
    assert.notDeepEqual(a.questionIds, b.questionIds);
    assert.notDeepEqual(a.questionIds.map(id => getFinderQuestion(id).group), b.questionIds.map(id => getFinderQuestion(id).group));
});

test('selected question variants score their actual answers, without counting unasked questions', () => {
    const run = createFinderRun({ random: () => .999 });
    const answers = Object.fromEntries(run.questionIds.map(id => [id, responses()[getFinderQuestion(id).group]]));
    const ranked = findFruitMatches(catalog, answers, { questionIds: run.questionIds });
    assert.equal(finderAnswersComplete(answers, run.questionIds), true);
    assert.ok(ranked.length);
    assert.deepEqual(ranked.map(match => [match.fruit.id, match.score]), findFruitMatches(catalog, responses()).map(match => [match.fruit.id, match.score]));
    assert.equal(finderAnswersComplete(answers), false);
    assert.deepEqual(findFruitMatches(catalog, { ...answers, [run.questionIds[0]]: 'missing' }, { questionIds: run.questionIds }), []);
});

test('good fits have equal chances, while weak or unsuitable fruits never enter the draw', () => {
    const candidate = (id, score, abilityMatchCount = 3, hasAvoidedDrawback = false) => ({ fruit: { id }, score, abilityMatchCount, hasAvoidedDrawback });
    const ranked = [candidate('best', 20), candidate('close', 14), candidate('fewer-answers', 13.4, 1), candidate('unwanted-drawback', 13.3, 3, true), candidate('unrelated', 10, 4)];
    assert.deepEqual(getFinderCandidates(ranked).map(match => match.fruit.id), ['best', 'close']);
    assert.equal(pickFinderMatch(ranked, 0).fruit.id, 'best');
    assert.equal(pickFinderMatch(ranked, .01).fruit.id, 'best');
    assert.equal(pickFinderMatch(ranked, .999).fruit.id, 'close');
    const counts = { best: 0, close: 0 };
    for (let index = 0; index < 100; index++) counts[pickFinderMatch(ranked, index / 100).fruit.id]++;
    assert.deepEqual(counts, { best: 50, close: 50 });
});

test('choosing every first answer draws from several good catalog matches', () => {
    const answers = Object.fromEntries(FINDER_DEFAULT_QUESTION_IDS.map(id => [id, getFinderQuestion(id).answers[0].id]));
    const ranked = findFruitMatches(catalog, answers, { limit: catalog.length });
    const eligible = getFinderCandidates(ranked);
    assert.ok(eligible.length >= 3);
    const counts = new Map();
    for (let index = 0; index < eligible.length * 100; index++) {
        const result = pickFinderMatch(ranked, (index + .5) / (eligible.length * 100));
        assert.equal(result.fruit.isCanon, true);
        counts.set(result.fruit.id, (counts.get(result.fruit.id) || 0) + 1);
    }
    assert.equal(counts.size, eligible.length);
    assert.ok([...counts.values()].every(count => count === 100));
});

test('one clear fit stays the result for every draw; weak coincidences are not randomized', () => {
    const best = { fruit: { id: 'best' }, score: 20, abilityMatchCount: 3 };
    const weak = { fruit: { id: 'weak' }, score: 10, abilityMatchCount: 2 };
    for (const roll of [0, .25, .5, .999]) assert.equal(pickFinderMatch([best, weak], roll), best);
    const vague = [{ ...best, score: 1, abilityMatchCount: 0 }, { ...weak, score: 1, abilityMatchCount: 0 }];
    assert.equal(pickFinderMatch(vague, .999), vague[0]);
    assert.equal(pickFinderMatch([], .5), null);
});

test('all equally strong fits can be drawn, including those later in alphabetical order', () => {
    const ranked = Array.from({ length: 8 }, (_, index) => ({ fruit: { id: String(index) }, score: 20, abilityMatchCount: 3 }));
    assert.equal(getFinderCandidates(ranked).length, 8);
    assert.equal(pickFinderMatch(ranked, .999).fruit.id, '7');
});

test('real catalog draws stay within close fits and preserve canon-only answers', () => {
    const ranked = findFruitMatches(catalog, responses({ canon: 'canon' }), { limit: catalog.length });
    const eligible = getFinderCandidates(ranked);
    assert.ok(eligible.length > 1);
    const results = new Set();
    for (const roll of [0, .25, .5, .75, .999]) {
        const result = pickFinderMatch(ranked, roll);
        assert.equal(result.fruit.isCanon, true);
        assert.ok(eligible.includes(result));
        results.add(result.fruit.id);
    }
    assert.ok(results.size > 1);
});

test('old saved progress migrates without losing answers, and an old review opens as a list', () => {
    const progress = restoreFinderState({ phase: 'questions', questionIndex: 2, answers: { goal: 'travel', approach: 'escape' } });
    assert.equal(progress.questionIndex, 2);
    assert.equal(progress.answers.goal, 'travel');
    assert.deepEqual(progress.questionIds, FINDER_DEFAULT_QUESTION_IDS);
    assert.equal(progress.resultRoll, 0);
    const review = restoreFinderState({ phase: 'questions', questionIndex: 0, answers: responses() });
    assert.equal(review.phase, 'review');
    assert.deepEqual(review.answers, responses());
});

test('cancelling an edit preserves answers and an unanswered question cannot be edited', () => {
    const review = finderReducer(answer(start(), 'travel'), { type: 'REVIEW' });
    assert.equal(finderReducer(review, { type: 'EDIT', questionId: 'canon' }), review);
    const editing = finderReducer(review, { type: 'EDIT', questionId: 'goal' });
    assert.deepEqual(finderReducer(editing, { type: 'CANCEL_EDIT' }), review);
    assert.equal(editing.resultRoll, review.resultRoll);
});
