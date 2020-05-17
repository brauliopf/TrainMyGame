// React and Hooks
import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// components
import HorizontalNav from "./layout/HorizontalNav"
import AuthModal from "./user/AuthModal"
import Profile from "./user/Profile";
import Search from "./coach/Search";
import Coach from './coach/Coach';
import Session from './session/Session';
import CreateSession from './session/CreateSession';
import Checkout from "./session/Checkout";
import Inbox from "./inbox/Inbox";
import Application from './coach/Application'
import Admin from "./admin/Admin";
import Home from "./layout/Home";
import About from "./layout/About";
import FAQ from "./layout/FAQ";
import AlertBox from "./layout/AlertBox";

// contexts && reducers
import { Context } from './Contexts'
import appReducer from './reducers'

// Set up axios
axios.defaults.baseURL = process.env.REACT_APP_USERS_API;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.auth_token}`;

// Set up stripe
const stripePromise =
  axios.get("api/v1/stripe/public-key") // { publicKey: XXX }
    .then(res => loadStripe(res.data.publicKey))
    .catch(err => console.log("Error loading Stripe:", { err }));

const App = () => {

  // initialize the global reducer
  const [state, dispatch] = useReducer(appReducer,
    {
      auth: '',
      error: '',
      layout: { modal: { display: false } },
      payment: '',
      alerts: []
    });

  // Side-effects
  useEffect(() => {
    async function authenticate(data) {
      await axios.post(`/api/v1/users/login`, data)
        .then(res => { if (res && res.data && !res.error) dispatch({ type: 'LOGIN', data: res.data }) })
    }
    if (state.auth.isAuthenticated) { return; }
    const token = localStorage.token;
    if (token && token !== "") {
      authenticate({ token: token });
    }
  }, [state]);

  // console.log(state)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <Router>
        <HorizontalNav />
        <AuthModal />
        <div className="mt-5 pt-4"></div>
        <div className="mt-2 container">
          <AlertBox />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/faq" component={FAQ} />
            <Route exact path="/coaches" component={Search} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/coaches/:id" component={Coach} />
            <Route exact path="/sessions/new" component={CreateSession} />
            <Route exact path="/sessions/:id" component={Session} />
            <Route exact path="/inbox" component={Inbox} />
            <Route exact path="/coach/apply" component={Application} />
            <Route exact path="/admin" component={Admin} />
            <Elements stripe={stripePromise}>
              <Route exact path="/sessions/:id/join" component={Checkout} />
            </Elements>
          </Switch>
          <div className="mt-5 row" id="footer"></div>
        </div>
      </Router>
    </Context.Provider >
  );
}

export default App;

// TUTORIALS
// - https://github.com/PacktPublishing/Bootstrap-4---Create-4-Real-World-Projects
