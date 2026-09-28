// Task 3 — each meal in the plan is the planner's own copy, to edit freely.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBox, addRecipe, getRecipe } from '../src/recipes.js';
import { createPlan, planMeal } from '../src/plan.js';

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

/** A box holding pancakes, and the (frozen) pancakes it lends out. */
function fromBox() {
  const box = createBox();
  addRecipe(box, pancakes());
  return getRecipe(box, 'pancakes');
}

/** Runs `edit`, and fails with `hint` if it throws. */
function mustAllow(what, edit, hint) {
  try {
    edit();
  } catch (err) {
    assert.fail(`${what} threw ${err.name}: "${err.message}". ${hint}`);
  }
}

const FROZEN_HINT =
  'The entry is still holding something frozen that belongs to the box. Find out which level ' +
  'it is, and ask whether your entry has a copy of it or the box\'s own (One level deep, or all ' +
  'the way). If it only fails when the servings match the recipe\'s, re-read what scaleRecipe ' +
  'returns in that case.';

test('planMeal adds the meal to the plan and returns it', () => {
  const plan = createPlan();
  const entry = planMeal(plan, fromBox(), 2);
  assert.equal(plan.length, 1, `After planning one meal the plan has length ${plan.length}, expected 1.`);
  assert.ok(plan[0] === entry, 'planMeal returned one object and put a different one in the plan. Return the entry you added.');
  assert.equal(entry.id, 'pancakes', `The entry's id is ${JSON.stringify(entry.id)}, expected "pancakes".`);
  assert.equal(entry.serves, 2, `The entry serves ${entry.serves}, expected the 2 that were asked for.`);
  assert.deepEqual(entry.ingredients.map((i) => i.qty), [100, 150, 1],
    `The entry for 2 has quantities ${JSON.stringify(entry.ingredients.map((i) => i.qty))}, expected [100, 150, 1].`);
});

test('the plan keeps meals in order, repeats included', () => {
  const box = createBox();
  addRecipe(box, pancakes());
  addRecipe(box, { ...pancakes(), id: 'porridge', title: 'Porridge' });
  const plan = createPlan();
  planMeal(plan, getRecipe(box, 'pancakes'), 4);
  planMeal(plan, getRecipe(box, 'porridge'), 4);
  planMeal(plan, getRecipe(box, 'pancakes'), 4);
  assert.deepEqual(plan.map((e) => e.id), ['pancakes', 'porridge', 'pancakes'],
    `Planning pancakes, porridge, pancakes gave a plan of ${JSON.stringify(plan.map((e) => e.id))}. ` +
    'A plan keeps order and keeps repeats (Choosing a collection).');
});

test('two plans do not share meals', () => {
  const mine = createPlan();
  const yours = createPlan();
  planMeal(mine, fromBox(), 4);
  assert.equal(yours.length, 0,
    'A meal planned in one plan turned up in another. Each call to createPlan must make a plan of its own.');
});

test('an entry can be edited without reaching the box', () => {
  const lent = fromBox();
  const entry = planMeal(createPlan(), lent, 2);
  mustAllow("Renaming an ingredient in an entry", () => { entry.ingredients[1].name = 'oat milk'; }, FROZEN_HINT);
  mustAllow('Adding an ingredient to an entry',
    () => { entry.ingredients.push({ name: 'sugar', qty: 1, unit: 'tbsp' }); }, FROZEN_HINT);
  assert.equal(lent.ingredients[1].name, 'milk', "Editing an entry changed the box's recipe.");
  assert.equal(lent.ingredients.length, 3, "Editing an entry changed the box's recipe.");
});

test("an entry planned at the recipe's own servings can be edited too", () => {
  const lent = fromBox();
  const entry = planMeal(createPlan(), lent, 4);
  mustAllow("Changing an ingredient's qty in an entry planned for 4 (the recipe serves 4)",
    () => { entry.ingredients[0].qty = 250; }, FROZEN_HINT);
  mustAllow('Adding an ingredient to that entry',
    () => { entry.ingredients.push({ name: 'sugar', qty: 1, unit: 'tbsp' }); }, FROZEN_HINT);
  assert.equal(lent.ingredients[0].qty, 200, "Editing an entry changed the box's recipe.");
});

test('two entries from one recipe are independent', () => {
  const lent = fromBox();
  const plan = createPlan();
  const monday = planMeal(plan, lent, 4);
  const friday = planMeal(plan, lent, 4);
  mustAllow("Editing Monday's entry", () => {
    monday.ingredients[1].name = 'oat milk';
    monday.ingredients.push({ name: 'blueberries', qty: 100, unit: 'g' });
  }, FROZEN_HINT);
  assert.equal(friday.ingredients[1].name, 'milk',
    `Renaming Monday's milk renamed Friday's too — Friday now has ${JSON.stringify(friday.ingredients[1].name)}. ` +
    'The two entries share an ingredient object: two names, one object (What a function can change).');
  assert.equal(friday.ingredients.length, 3,
    `Adding an ingredient to Monday gave Friday ${friday.ingredients.length} ingredients too. ` +
    'The two entries share one ingredients array.');
});

test('editing an entry does not change a recipe the caller built', () => {
  const mine = pancakes();
  const entry = planMeal(createPlan(), mine, 4);
  entry.ingredients[0].name = 'spelt flour';
  entry.ingredients.push({ name: 'lemon', qty: 1, unit: '' });
  assert.equal(mine.ingredients[0].name, 'flour',
    `Renaming an ingredient in the entry renamed it in the caller's recipe as well — it is now ` +
    `${JSON.stringify(mine.ingredients[0].name)}. This recipe is not frozen, so nothing threw: ` +
    'the entry and the caller share an ingredient object (What a function can change).');
  assert.equal(mine.ingredients.length, 3,
    `Adding an ingredient to the entry gave the caller's recipe ${mine.ingredients.length} ` +
    'ingredients. The entry and the caller share one ingredients array.');
});
