import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import { RequestProvider } from 'react-request-hook'
import 'bootstrap';

// Set up axios
const usersAPI = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? process.env.REACT_APP_USERS_API_PROD : process.env.REACT_APP_USERS_API_DEV
})

console.log(process.env.NODE_ENV, baseURL)
ReactDOM.render(
  <RequestProvider value={usersAPI}>
    <App />
  </RequestProvider>,
  document.getElementById('root'));