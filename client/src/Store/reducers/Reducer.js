export const initialState = {
  user: null,
  deletePostId: null,
  handleLikePost: { id: null, show: false},
  openEditPostBox: { id: null, show: false, text: null }
}

export const actionTypes = {
  SET_USER: 'SET_USER',
  DELETE_POST: 'DELETE_POST',
  OPEN_EDIT_POST_BOX: 'OPEN_EDIT_POST_BOX'
}

// if there is and user's value in the storage
const data = JSON.parse(localStorage.getItem('user'))

//console.log('data', data)
//console.log('initialState.user', initialState.user)

if (data) {
  //console.log('reducer data user', data)
  initialState.user = data
}

const reducer = (state, action) => {
  /* console.log('const reducer action', action)
  console.log('const reducer state', state) */

  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      }

    case actionTypes.DELETE_POST:
      return {
        ...state,
        deletePostId: action.deletePostId
      }

    case actionTypes.OPEN_EDIT_POST_BOX:
      return {
        ...state,
        openEditPostBox: {
          id: action.openEditPostBox.id,
          show: !state.openEditPostBox.show,
          text: action.openEditPostBox.text
        }
      }

    default:
      return state
  }
}

export default reducer