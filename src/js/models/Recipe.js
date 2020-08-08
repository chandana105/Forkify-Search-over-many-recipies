// lets now start working on the modle for singlerecipe selected from search results

import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

      // console.log(res);
    } catch (error) {
      console.log(error);
      alert(`Something went wrong :(`);
    }
  }

  calcTime() {
    // Assuming that we need 15 minutes for each 3ingredients
    const numIng = this.ingredients.length;
    // to cal how many 15m inutes eriosd are there
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces' , 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds' ];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    // there can be more units g , kg so lets do destructuring
    const units = [...unitsShort, 'kg', 'g'];
    
    const newIngredients = this.ingredients.map(el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase(); //ingredient is a string
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      })
      // so now current ingredient is with shot unit changed

      // 2) Remove paranthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');


      // 3) Parse ingredients into count, unit and ingredient 

      // console.log(typeof ingredient); //string
      const arrIng = ingredient.split(' ');
      const unitsIndex = arrIng.findIndex(el2 => units.includes(el2));
      // console.log(unitsIndex);

      // so now lets declare final obj with ingredients to declare it outsied if statemtns as let cosnt is blcok sciopped so cant mutate then

      let objIng;

      if (unitsIndex > -1) {
        //There is a unit
        // Ex. 4 1/2 cups, arrCount = [4, 1/2] , --> eval("4+1/2") = 4.5 now t ofigure out nubmer outo thesevaleu her
        // Ex. 4 cups, arrCount = [4]
        const arrCount = arrIng.slice(0, unitsIndex);
        let count;
        if (arrCount.length === 1) {
          // count = arrIng[0]
          count = eval(arrIng[0].replace('-', '+'));

        } else {
          count = eval(arrIng.slice(0, unitsIndex).join('+'));
        }

        objIng = {
          count,
          unit : arrIng[unitsIndex],
          ingredient : arrIng.slice(unitsIndex + 1).join(' ')
          // unitsindexse nhi start krni uske next indexse then joi krdo asstring 
        };

      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit , but 1st element is a number
        
        objIng =  {
          count : parseInt(arrIng[0], 10),
          unit : '',
          ingredient : arrIng.splice(1).join(' ')

        }
      }
      else if (unitsIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng =  {
          count : 1,
          unit : '',
          ingredient
        }
        // if we have tomato sauce : 1 tomato sauce
      }


      // console.log(typeof objIng.count); //number 

      return objIng;
    });
    this.ingredients = newIngredients;
    // console.log(typeof newIngredients); object

  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // this ll not update this.servigns just assign thevalue to newservigns 


    // Ingredients
    this.ingredients.forEach(ing => {
      // ing.count = ing.count * (newServings / this.servings);
      ing.count *= (newServings / this.servings);

    })

    this.servings = newServings;
  }
}

