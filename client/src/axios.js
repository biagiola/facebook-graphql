var axios = require('axios');

var axiosInstance = axios.create({
  //baseURL: 'https://facebookclonedemo.herokuapp.com/',
  baseURL: 'http://localhost:9000/'
  
});

module.exports = axiosInstance;