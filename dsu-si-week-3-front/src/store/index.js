import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import user from './user.reducer'

import messages from './messages.reducer'

const reducer = combineReducers({
  user,
  messages,
})

const store = configureStore({
  reducer,
})

export default store;