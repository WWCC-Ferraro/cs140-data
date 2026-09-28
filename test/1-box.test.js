// Task 1 — the recipe box keeps its own copy, and lends it safely.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBox, addRecipe, getRecipe } from '../src/recipes.js';

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

/** Runs `change`, and fails with `hint` if it throws. */
function mustAllow(what, change, hint) {
  try {
    change();
  } catch (err) {
    assert.fail(`${what} threw ${err.name}: "${err.message}". ${hint}`);
  }
}

/** Fails with `hint` unless `change` throws a TypeError. */
function mustRefuse(what, change, hint) {
  assert.throws(change, TypeError, `${what} was allowed. ${hint}`);
}

test('getRecipe finds a recipe by its id', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const found = getRecipe(box, 'pancakes');
  assert.ok(found, `getRecipe(box, 'pancakes') gave ${found} after that recipe was added.`);
  assert.equal(found.title, 'Pancakes',
    `getRecipe(box, 'pancakes') gave a recipe titled ${JSON.stringify(found.title)}, expected "Pancakes".`);
  assert.equal(found.ingredients.length, 3,
    `The recipe came back with ${found.ingredients.length} ingredients, expected 3.`);
});

test('getRecipe gives undefined for an id the box does not have', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const found = getRecipe(box, 'waffles');
  assert.equal(found, undefined,
    `getRecipe(box, 'waffles') gave ${JSON.stringify(found)}, but nothing with that id was added.`);
});

test('adding a recipe with an id the box already has replaces it', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const better = pancakes();
  better.title = 'Better pancakes';
  addRecipe(box, better);
  assert.equal(getRecipe(box, 'pancakes').title, 'Better pancakes',
    `After adding a second recipe with id 'pancakes', getRecipe gave the title ` +
    `${JSON.stringify(getRecipe(box, 'pancakes').title)}. One id, one recipe: the newer one wins.`);
});

test('two boxes do not share recipes', () => {
  const mine = createBox();
  const yours = createBox();
  addRecipe(mine, pancakes());
  assert.equal(getRecipe(yours, 'pancakes'), undefined,
    'A recipe added to one box turned up in another. Each call to createBox has to make ' +
    'a box of its own — check whether both boxes are holding one collection that was made once, ' +
    'when the file loaded (What a function can change).');
});

test('changes the author makes after adding do not reach the box', () => {
  const box = createBox();
  const draft = pancakes();
  addRecipe(box, draft);

  draft.title = 'Crêpes';
  assert.equal(getRecipe(box, 'pancakes').title, 'Pancakes',
    "The author renamed their own object after adding it, and the box's recipe was renamed too. " +
    "The box is holding the author's object, not a copy (Copying versus aliasing).");

  draft.ingredients[0].qty = 999;
  draft.steps.push('Burn them');
  const kept = getRecipe(box, 'pancakes');
  assert.equal(kept.ingredients[0].qty, 200,
    `The author changed an ingredient in their own object, and the box's flour went from 200 to ` +
    `${kept.ingredients[0].qty}. The top of the recipe was copied, but what is inside it is still ` +
    `shared — how many levels does your copy go? (One level deep, or all the way)`);
  assert.equal(kept.steps.length, 3,
    `The author added a step to their own object, and the box's recipe now has ` +
    `${kept.steps.length} steps. Its steps array is still the author's array.`);
});

test("adding a recipe leaves the author's object changeable", () => {
  const box = createBox();
  const draft = pancakes();
  addRecipe(box, draft);
  const hint =
    "addRecipe froze something the author still holds. A function that freezes its argument has " +
    "changed the caller's data as surely as one that edits it (What a function can change). " +
    'Freeze only what the box alone holds.';
  mustAllow("Renaming the author's own object", () => { draft.title = 'Crêpes'; }, hint);
  mustAllow("Changing an ingredient in the author's own object",
    () => { draft.ingredients[0].qty = 250; }, hint);
  mustAllow("Adding a step to the author's own object", () => { draft.steps.push('Serve'); }, hint);
});

test('a recipe from the box refuses changes at every level', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const lent = getRecipe(box, 'pancakes');
  mustRefuse('Renaming a recipe from the box', () => { lent.title = 'Mine now'; },
    'The recipe the box keeps must not be changeable by anyone it is lent to (Making data unchangeable).');
  mustRefuse("Changing an ingredient's qty in a recipe from the box",
    () => { lent.ingredients[0].qty = 1; },
    'The top level refuses changes, but the levels inside it do not. What does Object.freeze ' +
    'promise about the objects inside the one you freeze?');
  mustRefuse('Adding an ingredient to a recipe from the box',
    () => { lent.ingredients.push({ name: 'sugar', qty: 1, unit: 'tbsp' }); },
    'The ingredients array itself is still changeable. Every level has to be frozen.');
  mustRefuse('Adding a step to a recipe from the box', () => { lent.steps.push('Eat'); },
    'The steps array is still changeable. Every level has to be frozen.');
});

test('getRecipe lends the same recipe every time, not a copy', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  const first = getRecipe(box, 'pancakes');
  const second = getRecipe(box, 'pancakes');
  assert.ok(first === second,
    'Two calls to getRecipe for one id gave two different objects. The recipe the box keeps ' +
    'cannot change, so lending that one object is safe, and a copy on every read is work for ' +
    'nothing (Making data unchangeable, "If nothing can change, sharing is free").');
});
