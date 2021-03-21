const router = require('express').Router();
const mongoPosts = require('../models/postModel')
const mongoose = require('mongoose') 

const path = require('path') 
const Grid = require('gridfs-stream') 
const multer = require('multer') 
const GridFsStorage = require('multer-gridfs-storage') 

//const mongoURI = 'mongodb+srv://biagiola:holaquetal123@cluster0.7y2eu.mongodb.net/facebookclone?retryWrites=true&w=majority'
const mongoURI = 'mongodb+srv://biagiolaNew:holaquetal123@cluster0.tscwa.mongodb.net/facebookclone?retryWrites=true&w=majority'
//const mongoURI = process.env.MONGODB_URL
const conn = mongoose.createConnection(mongoURI, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10, 
  bufferMaxEntries: 0,
  connectTimeoutMS: 40000, 
  socketTimeoutMS: 75000,
  keepAlive: true,
})

// image storage
let gfs
conn.once('open', () => {
  console.log('DB Connected')

  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images') 
}) 

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}${path.extname(file.originalname)}`
      const fileInfo = {
        filename: filename,
        bucketName: 'images'
      }
      resolve(fileInfo)
    })
  }
})
const upload = multer({storage})

// get all the posts
router.get('/retrieve', (req, res) => {
  mongoPosts.find()
    .then( data => {
      data.sort((b,a) => {
        return a.timestamp - b.timestamp
      }),
      console.log('posts data[0].comments', data[0].comments)
      res.status(200).send(data)
      //res.json(data)
    })
    .catch( err => res.status(500).json('Error: ' + err))
})

// get single post
router.get('/retrieve/:id', (req, res) => {
  mongoPosts.findById(req.params.id)
    .then( data => {
      res.status(200).send(data)
      //res.json(data)
    })
    .catch( err => res.status(500).json('Error: ' + err))
})

// upload post's image
router.post('/upload/image', upload.single('file'), (req, res) => {
  console.log('catch up')
  console.log('req.file',req.file)
  res.status(201).send(req.file)
})

// add post
router.post('/upload/post', (req, res) => {
  const dbPost = req.body
  console.log('post/add dbPost', dbPost)
  mongoPosts.create(dbPost, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      console.log('add post data:', data)
      res.status(201).send(data._id)
    }
  })
})

// get single image
router.get('/retrieve/image/single', (req, res) => {
  gfs.files.findOne({ filename: req.query.name }, (err, file) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (!file || file.length === 0) {
        res.status(400).json({ err: 'file not found' })
      } else {
        const readstream = gfs.createReadStream(file.filename)
        readstream.pipe(res)
      }
    }
  })
})

// delete post
router.delete('/delete/:id', (req, res) => {
  console.log(req.params.id)
  mongoPosts.findByIdAndDelete(req.params.id)
    .then( () => res.json({'value': true, 'id': req.params.id})) 
    .catch( err => res.status(400).json('Error: ', err))
})

// update post
router.post('/update/:id', (req, res) => {
  console.log('update', req.params.id)
  console.log('req.body', req.body)

  const { user, email, imgName, text, avatar, like, timestamp } = req.body.postUpdated
  mongoPosts.findById( req.params.id )
    .then( mongoPost => {
      mongoPost.user = user
      mongoPost.email = email
      mongoPost.imgName = imgName
      mongoPost.text = text
      mongoPost.avatar = avatar
      mongoPost.like = like
      //mongoPost.timestamp = timestamp

      mongoPost.save()
        .then( () => res.json('Article updated!'))
        .catch( err => res.status(400).json( 'Error: ' + err))
    })
    .catch( err => res.status(400).json('Error: ' + err) ) 
})

module.exports = router;