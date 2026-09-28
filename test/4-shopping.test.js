// Task 4 — one shopping list for the plan, without touching the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import { shoppingList } from '../src/plan.js';

// Plans are built by hand here, so these tests do not depend on Task 3.
function entry(id, ingredients) {
  return { id, title: id, serves: 2, ingredients, steps: [], tags: [] };
}

function week() {
  return [
    entry('pancakes', [
      { name: 'flour', qty: 100, unit: 'g' },
      { name: 'milk', qty: 150, unit: 'ml' },
      { name: 'Salt', qty: 1, unit: 'pinch' },
    ]),
    entry('bread', [
      { name: 'Flour', qty: 500, unit: 'g' },
      { name: 'yeast', qty: 7, unit: 'g' },
      { name: 'salt', qty: 1, unit: 'tsp' },
    ]),
    entry('cocoa', [
      { name: 'milk', qty: 1, unit: 'cup' },
      { name: 'cocoa', qty: 2, unit: 'tbsp' },
    ]),
    entry('pancakes', [
      { name: 'flour', qty: 100, unit: 'g' },
      { name: 'milk', qty: 150, unit: 'ml' },
    ]),
  ];
}

const show = (lines) => JSON.stringify(lines.map((l) => `${l.qty} ${l.unit} ${l.name}`));
const find = (lines, name, unit) => lines.find((l) => l.name.toLowerCase() === name && l.unit === unit);

test('an empty plan gives an empty list', () => {
  const lines = shoppingList([], new Set());
  assert.deepEqual(lines, [], `An empty plan gave ${JSON.stringify(lines)}, expected [].`);
});

test('one ingredient in two meals is one line, totalled', () => {
  const plan = [week()[0], week()[3]];
  const lines = shoppingList(plan, new Set());
  const flour = lines.filter((l) => l.name.toLowerCase() === 'flour');
  assert.equal(flour.length, 1,
    `Flour appears in two meals and the list has ${flour.length} flour lines: ${show(lines)}. ` +
    'The two flour objects are separate objects — what makes two ingredients the same line? ' +
    '(Choosing a collection, "What makes two keys the same")');
  assert.equal(flour[0].qty, 200, `The flour line says ${flour[0].qty}, expected 100 + 100 = 200.`);
});

test("names that differ only in capitals are one line, named as first seen", () => {
  const lines = shoppingList([week()[0], week()[1]], new Set());
  const flour = lines.filter((l) => l.name.toLowerCase() === 'flour');
  assert.equal(flour.length, 1,
    `'flour' and 'Flour' gave ${flour.length} lines: ${show(lines)}. Strings compare every ` +
    'character, capitals included; if they should count as one, that has to be written into the key.');
  assert.equal(flour[0].qty, 600, `The flour line says ${flour[0].qty}, expected 100 + 500 = 600.`);
  assert.equal(flour[0].name, 'flour',
    `The flour line is named ${JSON.stringify(flour[0].name)}; it should keep the name it had where it was first seen, "flour".`);
});

test('the same name in a different unit stays a separate line', () => {
  const lines = shoppingList([week()[0], week()[2]], new Set());
  const ml = find(lines, 'milk', 'ml');
  const cup = find(lines, 'milk', 'cup');
  assert.ok(ml && cup,
    `150 ml of milk and 1 cup of milk gave ${show(lines)}. They cannot be added together, so ` +
    'they are two lines — the key has to tell them apart.');
  assert.equal(ml.qty, 150, `The ml milk line says ${ml.qty}, expected 150.`);
  assert.equal(cup.qty, 1, `The cup milk line says ${cup.qty}, expected 1.`);
});

test('anything in the pantry is left off, whatever its capitals', () => {
  const lines = shoppingList(week(), new Set(['salt', 'yeast']));
  const left = lines.filter((l) => ['salt', 'yeast'].includes(l.name.toLowerCase()));
  assert.equal(left.length, 0,
    `With salt and yeast in the pantry, the list still has ${show(left)}. The pantry holds ` +
    "lower-case names; 'Salt' is in it.");
});

test('the whole week, in the order first seen', () => {
  const lines = shoppingList(week(), new Set(['yeast']));
  assert.deepEqual(lines, [
    { name: 'flour', qty: 700, unit: 'g' },
    { name: 'milk', qty: 300, unit: 'ml' },
    { name: 'Salt', qty: 1, unit: 'pinch' },
    { name: 'salt', qty: 1, unit: 'tsp' },
    { name: 'milk', qty: 1, unit: 'cup' },
    { name: 'cocoa', qty: 2, unit: 'tbsp' },
  ], `The week's list came out as ${show(lines)}.`);
});

test('making the list leaves the plan unchanged', () => {
  const plan = week();
  const before = structuredClone(plan);
  shoppingList(plan, new Set());
  assert.deepEqual(plan, before,
    'After shoppingList, the plan is different. If an ingredient in the plan now holds a total, ' +
    'the list is adding into the plan\'s own ingredient object — a line on the list and an ' +
    'ingredient in the plan are two names for one object (What a function can change).');
});

test('making the list twice gives the same totals', () => {
  const plan = week();
  const first = show(shoppingList(plan, new Set()));
  const second = show(shoppingList(plan, new Set()));
  assert.equal(second, first,
    `The first list was ${first}; the second, from the same plan, was ${second}. Something the ` +
    'first call did stayed behind in the plan.');
});

test('changing a line on the list does not change the plan', () => {
  const plan = [entry('cocoa', [{ name: 'cocoa', qty: 2, unit: 'tbsp' }])];
  const lines = shoppingList(plan, new Set());
  lines[0].qty = 0;   // ticked off
  assert.equal(plan[0].ingredients[0].qty, 2,
    `Ticking off the cocoa line set the plan's cocoa to ${plan[0].ingredients[0].qty}. The line ` +
    "is the plan's own ingredient object, not a line of the list's own.");
});

