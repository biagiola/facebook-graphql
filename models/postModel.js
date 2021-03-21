
const mongoose = require('mongoose')

const postModel = mongoose.Schema({
  user: String,
  email: String,
  imgName: String,
  text: String,
  avatar: String,
  like: Boolean,
  timestamp: String,
  comments: [{
    user: String,
    email: String,
    avatar: String,
    text: String,
    timestamp: String
  }]
})

module.exports = mongoose.model('posts', postModel)