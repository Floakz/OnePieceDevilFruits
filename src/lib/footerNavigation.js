import { POLL_ENABLED } from './pollConfig.js';
import { LEGAL_DOCUMENTS } from './legalDocuments.js';

export const FOOTER_NAVIGATION = [
    ['Explore', [
        ['All Devil Fruits', '/'],
        ['Paramecia', '/paramecia'],
        ['Logia', '/logia'],
        ['Zoan', '/zoan'],
        ['Community Fruits', '/community'],
        ['Characters', '/characters'],
        ...(POLL_ENABLED ? [['Community Poll', '/poll']] : []),
    ]],
    ['Games and quizzes', [
        ['Fruit Finder', '/fruit-finder'],
        ['Fruit Guesser', '/fruit-guesser'],
        ['Blind Ranking', '/blind-ranking'],
        ['Crew Wars', '/crew-wars'],
        ['Grand Run', '/grand-run'],
        ['Daily Fight', '/daily-fight'],
        ['Quizzes', '/quizzes'],
    ]],
    ['Legal', Object.values(LEGAL_DOCUMENTS).map(({ label, path }) => [label, path])],
];
