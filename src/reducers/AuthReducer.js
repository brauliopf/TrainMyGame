import axios from 'axios';
import { LOGIN, REGISTER, LOGOUT, UPDATE_PROFILE_PICTURE, UPDATE_LOCATION } from './Actions'

export default (state, action) => {
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

    default:
      return state
  }
}