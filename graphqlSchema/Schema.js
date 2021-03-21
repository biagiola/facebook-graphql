const axios = require('axios')

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLScalarType
} = require('graphql')

// Comment type
const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    user: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
    text: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  })
})

// Post Type
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    _id: { type: GraphQLString },
    user: { type: GraphQLString },
    email: { type: GraphQLString },
    imgName: { type: GraphQLString },
    text: { type: GraphQLString },
    avatar: { type: GraphQLString },
    like: { type: GraphQLBoolean },
    timestamp: { type: GraphQLString },
    comments: { type: GraphQLList(CommentType) }
  })
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return axios
          .get('http://localhost:9000/posts/retrieve')
          .then(res => res.data)
      }
    },
    post: {
      type: PostType,
      args: {
        _id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:9000/posts/retrieve/${args._id}`)
          .then(res => res.data)
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
