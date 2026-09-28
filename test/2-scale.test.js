// Task 2 — scaling makes a new recipe, copying only what changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBox, addRecipe, getRecipe, scaleRecipe } from '../src/recipes.js';

function pancakes() {
  return {
    id: 'pancakes',
    title: 'Pancakes',
    serves: 4,
    ingredients: [
      { name: 'flour', qty: 200, unit: 'g' },
      { name: 'milk', qty: 300, unit: 'ml' },
      { name: 'egg', qty: 2, unit: '' },
    ],
    steps: ['Whisk everything', 'Rest ten minutes', 'Fry'],
    tags: ['breakfast', 'vegetarian'],
  };
}

const qtys = (recipe) => recipe.ingredients.map((item) => item.qty);

test('scaling up multiplies every quantity', () => {
  const bigger = scaleRecipe(pancakes(), 8);
  assert.deepEqual(qtys(bigger), [400, 600, 4],
    `Scaling a recipe for 4 to serve 8 gave quantities ${JSON.stringify(qtys(bigger))}, ` +
    'expected every one doubled: [400, 600, 4].');
});

test('scaling down divides every quantity', () => {
  const smaller = scaleRecipe(pancakes(), 2);
  assert.deepEqual(qtys(smaller), [100, 150, 1],
    `Scaling a recipe for 4 to serve 2 gave quantities ${JSON.stringify(qtys(smaller))}, ` +
    'expected every one halved: [100, 150, 1].');
});

test('the scaled recipe says how many it serves, and keeps everything else', () => {
  const scaled = scaleRecipe(pancakes(), 6);
  assert.equal(scaled.serves, 6, `The scaled recipe says it serves ${scaled.serves}, expected 6.`);
  assert.equal(scaled.id, 'pancakes', `The scaled recipe's id is ${JSON.stringify(scaled.id)}, expected "pancakes".`);
  assert.equal(scaled.title, 'Pancakes', `The scaled recipe's title is ${JSON.stringify(scaled.title)}, expected "Pancakes".`);
  assert.deepEqual(scaled.ingredients.map((i) => i.name), ['flour', 'milk', 'egg'],
    'The scaled recipe lost or renamed an ingredient.');
  assert.deepEqual(scaled.ingredients.map((i) => i.unit), ['g', 'ml', ''],
    'The scaled recipe lost or changed a unit.');
});

test('scaling leaves a recipe you built yourself unchanged', () => {
  const mine = pancakes();
  scaleRecipe(mine, 8);
  assert.equal(mine.serves, 4,
    `The recipe passed in now says it serves ${mine.serves}. scaleRecipe changed the caller's ` +
    'recipe instead of building a new one (What a function can change).');
  assert.deepEqual(qtys(mine), [200, 300, 2],
    `The recipe passed in now has quantities ${JSON.stringify(qtys(mine))}, expected [200, 300, 2] ` +
    "as before. Nothing threw — the caller's ingredient objects were changed in place. A new " +
    'recipe needs new ingredient objects, not the old ones with their qty changed.');
});

test('scaling a frozen recipe from the box works', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const lent = getRecipe(box, 'pancakes');
  let scaled;
  try {
    scaled = scaleRecipe(lent, 8);
  } catch (err) {
    assert.fail(
      `scaleRecipe threw ${err.name}: "${err.message}" on a recipe from the box. That recipe is ` +
      'frozen, so any line that writes to it — or to an ingredient inside it — is refused. ' +
      'Build new values; do not change the ones you were given (Making data unchangeable).');
  }
  assert.deepEqual(qtys(scaled), [400, 600, 4],
    `Scaling the box's recipe to 8 gave ${JSON.stringify(qtys(scaled))}, expected [400, 600, 4].`);
});

test('the scaled recipe has its own ingredients', () => {
  const original = pancakes();
  const scaled = scaleRecipe(original, 8);
  assert.ok(scaled !== original, 'scaleRecipe returned the very recipe it was given, though the servings changed.');
  assert.ok(scaled.ingredients !== original.ingredients,
    'The scaled recipe holds the same ingredients array as the original. The ingredients are ' +
    'what changes, so they need an array of their own.');
  assert.ok(scaled.ingredients[0] !== original.ingredients[0],
    'The scaled recipe holds the same ingredient objects as the original — so its quantities ' +
    'are the original\'s quantities. Each changed ingredient needs to be a new object.');
});

test('the scaled recipe shares what did not change', () => {
  const original = pancakes();
  const scaled = scaleRecipe(original, 8);
  assert.ok(scaled.steps === original.steps && scaled.tags === original.tags,
    'The scaled recipe has its own copy of steps or tags, which scaling never changes. Copy the ' +
    'levels on the path to the change, and share the rest (Making data unchangeable, "Producing ' +
    'new values instead of changing old ones").');
});

test('scaling to the servings it already has returns the same recipe', () => {
  const original = pancakes();
  assert.ok(scaleRecipe(original, 4) === original,
    'Scaling a recipe for 4 to serve 4 changes nothing, and scaleRecipe still built a new ' +
    'object. When nothing is different, hand back the original — then `===` alone tells a ' +
    'caller whether anything changed.');
});
