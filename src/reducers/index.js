import { AUTH_ERROR, MODAL_ON, MODAL_OFF, PAYMENT_AUTHORIZED } from './Actions'
import { LOGIN, REGISTER, LOGOUT, UPDATE_PROFILE_PICTURE, UPDATE_LOCATION, UPDATE_USER } from './Actions'
import $ from 'jquery'
import axios from 'axios';

// application reducer: receives state and action and returns
// the a single global state object
// reducer Y must return state for action taken by reducer X
export default function appReducer(state, action) {

  return {
    auth: authReducer(state.auth, action),
    error: errorReducer(state.error, action),
    layout: layoutReducer(state.layout, action),
    payment: paymentReducer(state.payment, action)
  }
}

function authReducer(state, action) {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      localStorage.setItem("token", action.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.data.token}`;
      localStorage.setItem("user", JSON.stringify(action.data.user));
      return {
        ...state,
        isAuthenticated: true,
        token: action.data.token,
        user: action.data.user
      };
    case LOGOUT:
      axios.defaults.headers.common['Authorization'] = '';
      localStorage.clear();
      return {};
    case UPDATE_PROFILE_PICTURE:
      return {
        ...state,
        user: { ...state.user, picture: action.url }
      }
    case UPDATE_LOCATION:
      return {
        ...state,
        user: { ...state.user, location: action.location }
      }
    case UPDATE_USER:
      const newState = {
        ...state,
        user: { ...state.user, ...action.newData }
      }
      localStorage.setItem("user", JSON.stringify(newState));
      return newState;
    default:
      return state
  }
}
// Reducers

// Each reducer knows how to handle all actions that pertain to it's segment of the state object
// The state object is broken up into a mapping of segments that each have their own reducer

function layoutReducer(state, action) {
  switch (action.type) {
    case MODAL_ON:
      $("#" + action.component).modal("show");
      return true
    case MODAL_OFF:
      $("#" + action.component).modal("hide");
      return false
    default:
      return state
  }
}

// TODO: write a payment reducer that works with the current application
// function paymentReducer(state, action) {
//   switch (action.type) {
//     case PAYMENT_AUTHORIZED:
//       axios.put(`/api/v1/orders/${action.data.order}`, { status: "authorized" })
//       axios.put(`/api/v1/sessions/${action.data.session}`, { new_participant: action.data.user })
//     default:
//       return state;
//   }
// }

function errorReducer(state, action) {
  switch (action.type) {
    case AUTH_ERROR:
      return 'Failed to authenticate'
    default:
      return state
  }
}

// application reducer: receives state and action and returns
// the a single global state object
// reducer Y must return state for action taken by reducer X
export default function appReducer(state, action) {
  return {
    auth: authReducer(state.auth, action),
    error: errorReducer(state.error, action),
    layout: layoutReducer(state.layout, action),
    //payment: paymentReducer(state.payment, action),
    //alerts: alertReducer(state.alerts, action)
  }
}
