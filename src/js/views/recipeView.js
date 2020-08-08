import { elements } from './base';
import { Fraction } from 'fractional';

export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};

// we now want 4.5 to 4/5 in recipe ingredients
// 0.33333333333
// 1.3333333333333333
const formatCount = (count) => {
  if (count) {
    const newCount = Math.round(count * 10000) / 10000;
    // count = 2.5 ---> 5/2 ---> 2 1/2 , first we ll seperate the integer part fro mdeciaml part in 2.5
    // count = 0.5 --> 1/2
    // pehle jo count aarha tha  ie number count uskoo string mein conert kiya phir string ko . se split kiy thne ab strigns hogye unpe map lgake int bnaya,now if int not 0 ie 2.5 we dotn want it to rep5/2 we want 2 1/2 ie int part vohi rha just dec part ko fraction mein krna hai
    const [int, dec] = newCount
      .toString()
      .split('.')
      .map((el) => parseInt(el, 10));

    if (!dec) return newCount;

    if (int === 0) {
      const fr = new Fraction(newCount);
      // based on newCount it ll create ne w fraction and fro mtherewe can read numerator and denomitor
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      const fr = new Fraction(newCount - int); //2.5 - 2 = 0.5 // 1.3333 - 1 = .3333
      return `${int} ${fr.numerator}/${fr.denominator}`; // 1 3333/10000
    }
  }
  // for some cases we dont have newCount so
  return '?';
};

const createIngredients = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
  const markup = `
  <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
          <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-stopwatch"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            recipe.time
          }</span>
          <span class="recipe__info-text"> minutes</span>
      </div>
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-man"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            recipe.servings
          }</span>
          <span class="recipe__info-text"> servings</span>
          <div class="recipe__info-buttons">
              <button class="btn-tiny btn-decrease">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-minus"></use>
                  </svg>
              </button>
              <button class="btn-tiny btn-increase">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-plus"></use>
                  </svg>
              </button>
          </div>
      </div>
      <button class="recipe__love">
          <svg class="header__likes">
              <use href="img/icons.svg#icon-heart${
                isLiked ? '' : '-outlined'
              }"></use>
          </svg>
      </button>
    </div>
    <div class="recipe__ingredients">
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map((el) => createIngredients(el)).join('')} 
      </ul>
      
      <button class="btn-small recipe__btn recipe__btn--add">
          <svg class="search__icon">
              <use href="img/icons.svg#icon-shopping-cart"></use>
          </svg>
          <span>Add to shopping list</span>
      </button>
    </div>
    <div class="recipe__directions">
      <h2 class="heading-2">How to cook it</h2>
      <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__by">${
            recipe.author
          }</span>. Please check out directions at their website.
      </p>
      <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
          <span>Directions</span>
          <svg class="search__icon">
              <use href="img/icons.svg#icon-triangle-right"></use>
          </svg>
      </a>
</div>
 `;
  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = (recipe) => {
  // Update Servings
  // since it is not thereon pg load so selectign liek this
  document.querySelector('.recipe__info-data--people').textContent =
    recipe.servings;

  // Update ingredients
  // to selct all the ingredients counts
  const countElements = document.querySelectorAll('.recipe__count');
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
