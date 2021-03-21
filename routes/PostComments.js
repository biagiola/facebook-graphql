const router = require('express').Router();
const mongoPosts = require('../models/postModel')

// get user comment
router.get('/retrieve/:id', (req, res) => {
  console.log('retrieve id:', req.params.id)
  mongoPosts.findById(req.params.id)
    .then( mongoPost => {
      const comments = mongoPost.comments
      comments.sort((b,a) => {
        return a.timestamp - b.timestamp
      }),
      res.json(comments)
    })
    .catch( err => res.status(500).json('Error: ' + err))
})
 
// add comment
router.post('/add/:id', (req, res) => {
  console.log('id', req.params.id)
  console.log('req.body', req.body )
  console.log('req.body.userComment', req.body.userComment )
  const { user, email, avatar, text, timestamp } = req.body.userComment

  mongoPosts.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $push: {
      "comments": {
        user: user,
        email: email,
        avatar: avatar,
        text: text,
        timestamp: timestamp,
      }
    }
  }, (err, mongoPost) => {
      if(err) {
        console.error(err)
        return res.send(500)
      } else {
        mongoPosts.findOne({ _id: req.params.id }).exec((err, data) => {
          const length = data.comments.length 
          //console.log('last', last)
          //const testing = data.comments[last]
          console.log('comment data', data)
          console.log('comment data.comments.length', length)
          console.log('comment data.comments[length-1]', data.comments[length-1])
          //console.log('comment testing', testing)
          res.status(201).send(data.comments[length-1])
        })
      }
  });

  //res.status(201).send(mongoPosts)
})

// delete comment
router.delete('/delete/:id/:commentId/', (req, res) => {
  
  console.log('req.params.id',req.params.id)
  console.log('req.params.commentId',req.params.commentId)

  mongoPosts.findOneAndUpdate({
    _id: req.params.id,
  }, {
    $pull: {
      "comments": { _id: req.params.commentId }
    }
  }, (err, mongoPost) => {
      if(err) {
        console.error(err)
        return res.send(500).send(err)
      } else {
        //console.log('comment deleted', mongoPost.comments)
        res.status(201).send('OK')
      }
  });
})

// update comment 
router.post('/update/:id/:commentId', (req, res) => {
  console.log('req.pamars.id', req.params.id)
  console.log('req.params.commentId', req.params.commentId)
  console.log('req.body.userComment', req.body.userCommentUpdated)
  const { user, email, avatar, text, timestamp } = req.body.userCommentUpdated

  mongoPosts.findOneAndUpdate({
    "_id": req.params.id,
    "comments._id": req.params.commentId
  }, {
    $set: { 
      "comments.$" : {
        _id: req.params.commentId,
        user: user,
        email: email,
        avatar: avatar,
        text: text,
        timestamp: timestamp
      }
    } 
  }, (err, mongoPost) => {
      if(err) {
        console.error(err)
        return res.send(500).send(err)
      } else {
        console.log('comment updated', mongoPost.comments)
        res.status(201).send(mongoPost.comments)
      }
  });
})

module.exports = router;