const cors = require('cors') 
const bodyParser = require('body-parser') 
const http = require('http')
const Grid = require('gridfs-stream') 
const mongoose = require('mongoose') 
const express = require('express') 

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();
app.use(cors())
const server = http.createServer(app);
var io = require('socket.io').listen(server);

const PORT = process.env.PORT || 9000

// socket io
io.on('connection', (socket) => {
  /* add an user */
  socket.on('join', ({name, email, avatar, room}, callback) => {
    console.log('join', email, room)
    // add a new user
    const { error, user } = addUser({ id: socket.id, name, email, avatar, room })
    
    console.log('error', error)
    if(error) return callback(error);

    console.log(user)

    // add that user to the room
    socket.join(room);
  
    // users online
    console.log('users in room(room)', getUsersInRoom(room))
    io.to(room).emit('roomData', { usersAvaible: getUsersInRoom(room) });
    
    callback()
  })

  /* add new message */
  socket.on('sendMessage', ({message, destinyEmail}, callback) => {
    console.log('message, destinyEmail ', message, destinyEmail)
    
    const user = getUser(socket.id);
    
    io.to('facebookapp').emit('dataFromSocket', { user: user, text: message, destinyEmail });
    callback()
  })
  
  /* disconnect the socket */
  socket.on('cerrar', () => {
    console.log('cerrar')
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    }
  })
  
})

// cors settings
const whitelist = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:9000', 
  'http://localhost:9002',
  'https://facebook2021.herokuapp.com',
  'http://192.168.100.52:19000'
]
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")

      callback(new Error('Not allowed by CORS'))
    }
  }
}
//app.use(cors(corsOptions))
//app.use(cors())

const { graphqlHTTP } = require('express-graphql')
const schema = require('./graphqlSchema/Schema')

Grid.mongo = mongoose.mongo

// middlewares
//app.use(bodyParser.json())
//app.use(express.static('client'))
app.use(express.json()) // recieve json data from axios

// graph ql middleware
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

// static files for react app
const path = require('path')
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  /* app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  }); */
}

mongoose.set('useFindAndModify', false)

// db confi
//const mongoURI = 'mongodb+srv://biagiola:holaquetal123@cluster0.7y2eu.mongodb.net/facebookclone?retryWrites=true&w=majority'
const mongoURI = 'mongodb+srv://biagiolaNew:holaquetal123@cluster0.tscwa.mongodb.net/facebookclone?retryWrites=true&w=majority'
//const mongoURI = process.env.MONGODB_URL
mongoose.connect(mongoURI, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10, 
  bufferMaxEntries: 0,
  connectTimeoutMS: 30000, 
  socketTimeoutMS: 65000,
  keepAlive: true,
  ssl: true
  //reconnectTries: 10
}) 

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
  console.log('DB server Connected')

  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images') 
})

// Routes
const PostRouter = require('./routes/Posts');
const PostCommentRouter = require('./routes/PostComments');
//const ChatRouter = require('./routes/ChatComments');
app.use('/posts', PostRouter);
app.use('/comments', PostCommentRouter);
//app.use('/chat', PostCommentRouter);



// listen
server.listen(PORT, () => console.log(`listening on localhost:${PORT}`))