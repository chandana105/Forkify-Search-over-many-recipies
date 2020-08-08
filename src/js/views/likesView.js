import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  // now to select the btn to change on use(whcih is the child element) now to change the href attribute
  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#${iconString}`);
  // icons.svg#icon-heart-outlined
};


export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// visibility: visible
// menu done now to render the likes in the menu ie to add like

export const renderLike = (like) => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
          <figure class="likes__fig">
              <img src="${like.img}" alt="${like.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
              <p class="likes__author">${like.author}</p>
          </div>
      </a>
  </li>    
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// to delete like

export const deleteLike = (id) => {
  // lets select the element, selecting based on the href attrbiute but we dont want toslect all anchor links here just the likes link
  const el = document.querySelector(`.likes__link[href="#${id}"]`)
    .parentElement;
  // we want to delete entire li
  if (el) el.parentElement.removeChild(el);
};

