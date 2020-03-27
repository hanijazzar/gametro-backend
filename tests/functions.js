const axios = require('axios');

const functions = {
  add: (num1, num2) => num1 + num2, // equivalent to {return num1 + num2}, removing {} means adding return
  fetchGame: destId => {
    return axios
      .get(`http://localhost:5000/api/games/${destId}`)
      .then(
        res => res.data // {} needs return. if no {} then as if there is a return in arrow functions
      )
      .catch(err => 'error');
  }
};

module.exports = functions;
