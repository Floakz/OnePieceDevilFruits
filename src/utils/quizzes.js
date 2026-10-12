import { slugify } from "../lib/slugify";

const quizModules = import.meta.glob(
    '../lib/quizzes/allQuizzes/*.json',
    { eager: true }
);

export const quizzes = Object.values(quizModules).map(
    module => ({
        ...module.default,
        slug: slugify(module.default.title),
    })
);
