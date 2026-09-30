# Recipe box and meal plan

You are building two small modules. A **recipe box** keeps recipes and lends them
out. A **meal plan** takes recipes from the box, resizes them, lets the planner
edit them, and adds up a shopping list.

Every part of it hands data to another part. The box lends a recipe to the plan.
The plan resizes it, and the planner changes it. The shopping list adds it up.
At each hand-off you decide the same things: **copy or share, how deep, what to
freeze, and which collection holds it.** Get one wrong and nothing throws. A
value just changes somewhere nobody wrote to it. That is what this module is
about.

## Getting started

1. Open **your repository**. It is made for you: private, and named for this
   homework, the term and your username — `<term>-cs140-data-<you>`. On
   [this homework's page](https://wwcc.dev/#/lesson/data-assignment), type your GitHub
   username and click **Open my Codespace**. On your own computer, clone it
   with GitHub Desktop (**Code**, then **Open with GitHub Desktop**) and check
   that `node --version` prints 22 or later. Start Here's *How a homework works*
   walks through both.
2. Run the tests:

   ```bash
   npm test
   ```

   They all fail at first, except a few that pass because an empty answer happens
   to satisfy them. To run one task's tests only, name the file:

   ```bash
   node --test test/1-box.test.js
   ```

The tests also run on every push; the **Actions** tab on your repository shows
the result. Each failing test says what it expected, what came back, and which
lesson to look at. It does not say what to write.

## What is in the repository

| File | What it is |
|---|---|
| `src/recipes.js` | The recipe box. Tasks 1 and 2. |
| `src/plan.js` | The meal plan. Tasks 3 and 4. |
| `src/freeze.js` | `deepFreeze`, written for you. Read it before Task 1. |
| `test/` | The tests, one file per task. Read them: they are part of the spec. |
| `review/favourites.js` | A teammate's code, for the review. |
| `REVIEW.md` | Where your review goes. |

Each function in `src/` has a comment saying exactly what it must do. Read it
before you start the function.

A recipe looks like this:

```js
{
  id: 'pancakes',
  title: 'Pancakes',
  serves: 4,
  ingredients: [
    { name: 'flour', qty: 200, unit: 'g' },
    { name: 'milk',  qty: 300, unit: 'ml' },
    { name: 'egg',   qty: 2,   unit: '' },
  ],
  steps: ['Whisk everything', 'Rest ten minutes', 'Fry'],
  tags: ['breakfast', 'vegetarian'],
}
```

Count the levels. A recipe is an object. Inside it, `ingredients` is an array,
and inside that each ingredient is an object again. Most of this assignment is
deciding which of those levels someone will change.

## Using an AI assistant

`AGENTS.md` in this repository tells AI coding assistants how this course wants
them to help: as a tutor who explains errors, asks questions and gives hints,
not by writing your answers. Most assistants read it automatically. It is in
the open, so read it too. It says what good AI help looks like.

## The tasks

Do them in order. Each one has its own test file.

### Task 1 — Keep what you are given, and lend it safely

In `src/recipes.js`, write `createBox`, `addRecipe` and `getRecipe`.

The box must hold on to a recipe that nobody else can change: not the author,
who may go on editing their own object, and not anyone the box lends it to.
But adding a recipe must not freeze anything the author still holds.

- Choose what the box keeps its recipes in. You will justify it in question 3.
- `getRecipe` lends out the recipe the box keeps — the same object every time.
- Tests: `test/1-box.test.js`.

### Task 2 — Resize without changing

In `src/recipes.js`, finish `scaleRecipe`. It returns a recipe for a different
number of people. The loop is written for you; what goes inside it is yours.

The recipe you are given may be frozen, so you cannot change it — and you must
not, even when it is not frozen. Build a new recipe. Copy only the parts that
change, and share the rest. If nothing changes, hand back the original.

- Tests: `test/2-scale.test.js`.

### Task 3 — The planner's own copy

In `src/plan.js`, write `createPlan` and `planMeal`.

A plan entry is a resized recipe that the planner is free to edit: swap milk for
oat milk, add blueberries, change a quantity. None of that may reach the box,
the recipe passed in, or another entry. Plan the same recipe for Monday and
Friday, and the two must still be independent.

- Use your `scaleRecipe`. Then look at what it can hand back, and decide what
  `planMeal` has to do before the planner edits it.
- There is more than one correct depth here. Question 2 asks what you chose.
- Tests: `test/3-plan.test.js`.

### Task 4 — The shopping list

In `src/plan.js`, finish `shoppingList`. It adds up every ingredient across the
plan into one line each, and leaves off what is already in the pantry.

The hard part is deciding when two ingredients are **the same line**. They come
from different entries, so they are always different objects. `'Flour'` and
`'flour'` are one line. `300 ml milk` and `1 cup milk` are two.

And the plan must come out of this exactly as it went in. A caller may tick off
a line on the list without changing the plan.

- The `Map` and the loops are given. The key, and what you store under it, are
  yours.
- Tests: `test/4-shopping.test.js`.

## The review

`review/favourites.js` is a teammate's first go at letting users keep favourite
recipes. They tried it with one user and it worked. It has **three problems**,
each one of this module's.

Write your review in `REVIEW.md`. For each problem:

- **the lines** where it is;
- **what goes wrong**, in a sentence or two;
- **an input that shows it** — a few lines of code that call the teammate's
  functions, and what they give;
- **the fix**.

Then use the debugger on one of the problems — the one where a value changes on
a line that never names it. Pause inside the teammate's code, add a Watch that
shows two names are one object, and step until the value changes. Record where
you paused, what you watched, and the line where it changed. *Meet the debugger*
has the steps; in a Codespace, use the JavaScript Debug Terminal.

`REVIEW.md` is read by a person. The tests do not check it.

## Your answers

Write two or three sentences for each, here, in this file.

1. **Lending without copying.** `getRecipe` hands out the object the box keeps.
   In *What a function can change*, handing out a module's own object was the
   bug. Why is it safe here? And what does the box pay for that safety, and
   when?

   *Your answer:*

2. **How deep `planMeal` copies.** Which levels of an entry did you copy, and
   why those? Name one part of an entry that could safely be shared with the
   box instead. Would it still be safe if the recipe passed in was not frozen?

   *Your answer:*

3. **Which collection.** The box, the plan and the pantry each use a different
   collection. For each, say which one and the question it answers. For the
   shopping list, say what makes two ingredients the same line — and what the
   list would do if the key were the ingredient object itself.

   *Your answer:*

## Done means

- `npm test` passes every test.
- `REVIEW.md` has all three problems and what the debugger showed.
- The three answers above are written.
