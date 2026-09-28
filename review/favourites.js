// favourites.js — written by a teammate, for review before it joins the app.
//
// Each user keeps a list of favourite recipes. The recipe page calls
// addFavourite with a recipe lent by getRecipe. The plan page calls it with
// a plan entry, and asks isFavourite to decide whether to show a star.
//
// The sidebar shows favourites by title. The profile page shows
// user.prefs.favourites as it is, in the order they were added.
//
// The teammate's note: "Tested with one user and it all works."

const DEFAULT_PREFS = { units: 'metric', favourites: [] };

export function newUser(name) {
  return { name: name, prefs: { ...DEFAULT_PREFS } };
}

// Is this recipe one of the user's favourites?
export function isFavourite(user, recipe) {
  return user.prefs.favourites.includes(recipe);
}

// Marks a recipe as a favourite, once.
export function addFavourite(user, recipe) {
  if (!isFavourite(user, recipe)) {
    user.prefs.favourites.push(recipe);
  }
}

// Favourites by title, for the sidebar.
export function favouritesByTitle(user) {
  return user.prefs.favourites.sort(function (a, b) {
    return a.title < b.title ? -1 : 1;
  });
}
