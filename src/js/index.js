import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global State of the app
    -Search object
    -current recipe object
    -Shopping list object
    -Liked recipes
*/
const state = {};

/* 
  Search Controller
*/
const controlSearch = async () => {
  // 1. Get queryfrom view
  const query = searchView.getInput();

  if (query) {
    // 2. New Search objec and add to state
    state.search = new Search(query);

    //3.Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      //4 Search for recipes
      await state.search.getResults();

      //5. Render results on UI
      clearLoader();
      if (state.search) searchView.renderResults(state.search.result);
    } catch (err) {
      alert(`Sth went wrong!`);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/* 
  Recipe Controller
*/

const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace('#', '');
  // console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // in it to pass the loader to get to know whwereto actully disply iesle

    // Highlight the selected search item
    // as this only happens as soon as load a recipe

    if (state.search) searchView.hightlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);

      state.recipe.parseIngredients();

      // Calcute servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert(`Error processign recipe!`);
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/* 
  List Controller
*/

const controlList = () => {
  // Create a list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    // lets ad dthi item to view ui
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  // first toread the id of the item that to delete whcoh is data attrbute
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete , .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // so to check whether it has been deletedlets make allour states window

    // habdle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    if (state.list.items.count > 1) {
      // chanfged in ui by targeting
      const val = parseFloat(e.target.value, 10);
      // console.log(val);

      // (changed i nstate)
      state.list.updateCount(id, val);
    }
  }
});

/* 
  LIKES Controller
*/

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    // User has liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// so each time the pg loads we re to create new lieks object

// Restore liekd recieps on page loads
window.addEventListener('load', () => {
  // start by creating new likes object whcoh wil lbe empy after the pg relaods
  state.likes = new Likes();

  // lets fill it
  // Restore likes
  state.likes.readStorage();

  // Toggle the button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the likes recipes up in the menu
  // Render the exsitring likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add , .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love , .recipe__love *')) {
    // Like controller
    controlLike();
  }
});
