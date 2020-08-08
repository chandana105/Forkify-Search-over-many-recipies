import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      // instead of returning the data , it is stred insideresult property inside objectsowe have bothsearch and results stred in the object
      this.result = res.data.recipes;
      // console.log(this.result); //this log would be of 5th step in index.js
    } catch (error) {
      alert(error);
    }
  }
}

