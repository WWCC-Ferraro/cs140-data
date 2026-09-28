// The meal plan: Tasks 3 and 4.

import { scaleRecipe } from './recipes.js';

/**
 * Task 3. Makes a new, empty meal plan.
 *
 * A plan is a list: meals in the order they were planned, and the same
 * recipe may appear more than once.
 *
 * @returns {object[]}
 */
export function createPlan() {
  throw new Error('not implemented');
}

/**
 * Task 3. Adds a meal to the end of the plan, and returns it.
 *
 * The meal — an "entry" — is `recipe` resized to `servings` (use your
 * `scaleRecipe`). It has everything a recipe has: `id`, `title`, `serves`,
 * `ingredients`, `steps`, `tags`.
 *
 * An entry is the planner's own, to edit freely: change an ingredient's name
 * or quantity, add or remove an ingredient. None of that may reach the box,
 * the recipe you were passed, or any other entry — including another entry
 * made from the same recipe.
 *
 * @param {object[]} plan
 * @param {object} recipe  usually one lent out by getRecipe, so frozen
 * @param {number} servings
 * @returns {object} the new entry
 */
export function planMeal(plan, recipe, servings) {
  throw new Error('not implemented');
}

/**
 * Task 4. The shopping list for the whole plan.
 *
 * - One line per ingredient: `{ name, qty, unit }`, with `qty` totalled
 *   across every entry.
 * - Names that differ only in capitals are the same ingredient ('Flour' and
 *   'flour'). The line keeps the name as it was first seen.
 * - The same name in a different unit is a different line: '300 ml milk' and
 *   '1 cup milk' cannot be added together.
 * - Anything in `pantry` is left off. `pantry` is a Set of lower-case names.
 * - Lines come out in the order their ingredient was first seen.
 * - The plan is not changed, and the lines are the list's own: a caller may
 *   change a line (tick it off, cross out a quantity) without touching the
 *   plan.
 *
 * The loops are written for you. The decisions inside them are yours.
 *
 * @param {object[]} plan
 * @param {Set<string>} pantry
 * @returns {{ name: string, qty: number, unit: string }[]}
 */
export function shoppingList(plan, pantry) {
  const lines = new Map();   // one entry per line of the list. What is the key?
  for (const entry of plan) {
    for (const item of entry.ingredients) {
      // TODO
    }
  }
  return [...lines.values()];
}
