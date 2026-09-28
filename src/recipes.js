// The recipe box: Tasks 1 and 2.
//
// A recipe looks like this:
//
//   {
//     id: 'pancakes',
//     title: 'Pancakes',
//     serves: 4,
//     ingredients: [
//       { name: 'flour', qty: 200, unit: 'g' },
//       { name: 'milk',  qty: 300, unit: 'ml' },
//       { name: 'egg',   qty: 2,   unit: '' },
//     ],
//     steps: ['Whisk everything', 'Rest ten minutes', 'Fry'],
//     tags: ['breakfast', 'vegetarian'],
//   }

import { deepFreeze } from './freeze.js';

/**
 * Task 1. Makes a new, empty recipe box.
 *
 * Every call makes a box of its own. Two boxes never share a recipe.
 * What the box holds its recipes in is your choice.
 *
 * @returns {object} a new box
 */
export function createBox() {
  throw new Error('not implemented');
}

/**
 * Task 1. Puts a recipe in the box, under its `id`.
 *
 * - The author keeps their own object and may go on changing it. Nothing
 *   they change afterwards, at any level, reaches the box.
 * - The author's object stays changeable. Adding a recipe must not freeze
 *   anything the author holds.
 * - The recipe the box keeps can never be changed, at any level, by anyone.
 * - Adding a recipe with an id the box already has replaces the old one.
 *
 * @param {object} box
 * @param {object} recipe
 * @returns {void}
 */
export function addRecipe(box, recipe) {
  throw new Error('not implemented');
}

/**
 * Task 1. Lends out the recipe with this id.
 *
 * Hand back the recipe the box keeps — the same object every time, not a
 * copy. (Your answer to question 1 says why that is safe here.)
 *
 * @param {object} box
 * @param {string} id
 * @returns {object | undefined} the recipe, or undefined if the box has none
 */
export function getRecipe(box, id) {
  throw new Error('not implemented');
}

/**
 * Task 2. Returns the recipe resized to serve `servings` people.
 *
 * - Every ingredient's `qty` is multiplied by `servings / recipe.serves`,
 *   and `serves` becomes `servings`.
 * - The recipe you were given is not changed. It may be frozen (one from the
 *   box) or not (one a caller built); either way it comes back as it went in.
 * - Copy only what changes. The result shares everything that did not change
 *   with the original — `steps`, `tags` — rather than copying it.
 * - If `servings` is what the recipe already serves, nothing changes: return
 *   the recipe itself.
 *
 * The loop is written for you. The decisions inside it are yours.
 *
 * @param {object} recipe
 * @param {number} servings
 * @returns {object}
 */
export function scaleRecipe(recipe, servings) {
  const factor = servings / recipe.serves;
  const ingredients = [];
  for (const item of recipe.ingredients) {
    // TODO: put the scaled version of `item` into `ingredients`.
  }
  // TODO: build and return the scaled recipe.
  throw new Error('not implemented');
}
