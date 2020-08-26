import React, { useState, useEffect, useContext } from 'react'
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Context } from '../Contexts'
import { useParams } from "react-router";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Checkout = () => {

  // TODO: fix location issue - may be a problem with original Google API code located outside of this file
  // if a user goes to create a session and you wait multiple seconds, an error message will appear in the Address bar.

  const { state, dispatch } = useContext(Context);
  const user = (state.auth.isAuthenticated && state.auth.user) || {}
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [session, setSession] = useState(null);
  const [publicProfiles, setPublicProfiles] = useState({}); // { user_id: { name, picture} }
  const [cardReady, setCardReady] = useState(false);
  const [sessionLoadedOnce, setSessionLoadedOnce] = useState(false);

  // Control vars & UI elements
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Effect
  useEffect(() => {
    !sessionLoadedOnce && loadSession(id);
  }, [session])

  useEffect(() => {
    if (sessionNotLoaded()) {
      return;
    }
    getPublicProfiles();
  }, [session])

  // create the card element, insert it into the form and ensure that it has the proper
  // coach's stripe account id.
  useEffect(() => {
    if (stripe && elements) {
      if (sessionNotLoaded()) {
        return;
      }
      if (cardReady) {
        return;
      }

      // Custom styling can be passed to options when creating an Element.
      const style = {
        base: {
          // Add your base input styles here. For example:
          fontSize: '16px',
          color: '#32325d',
        },
      };

      // Create an instance of the card Element.
      const card = elements.create('card', {style: style});
      card.mount('#card-element');

      setCardReady(true);

      let _session = session;

      const form = document.getElementById('payment-form');
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        stripe.createToken(card).then(function(result) {
          if (result.error) {
            // Inform the customer that there was an error.
            setError(result.error.message)
          } else {
            // Send the token to your server.
            stripeTokenHandler(result.token, _session);
          }
        })
      });
    }
  }, [stripe, elements, session, cardReady])

  // Auxiliary
  function sessionNotLoaded() {
    return !session;
  }
  const getPublicProfiles = async () => {
    let otherUsers = [session.coach].concat(session.participants).flat()

    // filter out repeated ids
    let filteredUsers = []
    filteredUsers = [...new Set(otherUsers)].filter((item, index) => item !== undefined);
    if (filteredUsers === []) {
      filteredUsers = otherUsers.filter((item, index) => (item !== undefined) && (otherUsers.indexOf(item) === index));
    }

    axios.get(`api/v1/users/public-profile?users=${filteredUsers.toString()}`).then(res => setPublicProfiles(res.data))
    return;
  }
  const isEmpty = obj => {
    return obj.length === 0 || Object.entries(obj).length === 0
  }

  const loadSession = async (id) => {
    await axios.get(`/api/v1/sessions/${id}`).then(res => setSession(res.data.session))
      .then(res => setSessionLoadedOnce(true));
  }
  const getSessionAddress = (location) => {
    if (!location) return;
    return `${location.complement} ${location.street}. ${location.zipcode}. ${location.city}, ${location.state}.`
  }
  const getCheckoutSummary = () => {
    return (
      <div className="col-12" id="checkout-summary">
        {(!isEmpty(session) && !isEmpty(publicProfiles) && !isEmpty(session.agenda)) &&
          <div className="row m-2 border" id="purchase-summary">
            <div className="col-12 col-lg-2 d-flex flex-column justify-content-center align-items-center text-center mt-2" id="coach-info">
              <img src={publicProfiles[session.coach].picture} alt={publicProfiles[session.coach].name} className="img-thumbnail rounded-circle" style={{ maxHeight: "100px", maxWidth: "100px" }} />
              <div className="font-weight-bold">
                <span>{publicProfiles[session.coach].name}</span>
              </div>
            </div>
            <div className="col-12 col-lg-5 d-flex flex-column justify-content-center mt-4 my-md-2">
              <div className="mt-2">Location: {getSessionAddress(session.location)}</div>
              <div className="mt-2">Date: {(new Date(session.agenda.start)).toLocaleDateString()}</div>
            </div>
            <div className="col-12 col-lg-3 d-flex flex-column justify-content-center">
              <div className="mt-2">Time: {(new Date(session.agenda.start)).toLocaleTimeString()}</div>
              {session.capacity && session.participants &&
                <div className="mt-2">Open slots: {
                  (session.capacity.max - session.participants.length > 1) ?
                    `${session.capacity.max - session.participants.length} slots available`
                    : "Last slot available"
                }
                </div>
              }
            </div>
            <div className="col-12 col-lg-2 d-flex flex-row flex-lg-column justify-content-center my-4">
              {session.participants &&
                <div className="position-relative" style={{ height: "60px", width: "100px", left: "-10px" }}>
                  {session.participants.map((p, index) => (index < 3 &&
                    <div className="d-flex" key={p}>
                      <img className="rounded-circle img-thumbnail position-absolute" alt={publicProfiles[p].name} src={publicProfiles[p].picture} style={{ maxWidth: "60px", maxHeight: "60px", position: "absolute", left: (25 * index + "px") }} />
                    </div>)
                  )}
                </div>}
              <div className="my-2 w-100 d-flex flex-column text-right">
                Current price:
                <span className="font-weight-bold">
                  US$ {(session.price / 100)
                    .toLocaleString(navigator.language, { minimumFractionDigits: 2 })}{" "}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
  const stripeTokenHandler = async function(token, session) {
    const recipientStripeId =
      await axios.get(`api/v1/coaches/${session.coach}`).then(res => res.data.coach.stripeId);

    axios({
      method: 'post',
      url: `/api/v1/stripe/charge/${recipientStripeId}`,
      data: `email=${user.email}&stripeToken=${token.id}&amount=${session.price}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(
      res => setProcessing(false)
    );

    setProcessing(true);
  }

  if (sessionNotLoaded()) {
    return <h2>Loading...</h2>
  } else {
    return (
      <div id="checkout">
        <div className="row">
          <div className="col-12">
            <p className="h3">Confirm payment</p>
          </div>
          <div className="col-12 border">
            <div className="row">
              {getCheckoutSummary()}
            </div>
            <form className="row d-flex flex-column my-4" id="payment-form">
              <fieldset className="col-12 col-md-6">
                <div className="mx-2 border-bottom">
                  <label htmlFor="name" className="">Name</label>
                  <input
                    className="w-100 border-0"
                    id="name"
                    type="text"
                    placeholder="Name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="m-2 border-bottom">
                  <label htmlFor="phone" className="">Phone</label>
                  <input
                    className="w-100 border-0"
                    id="phone"
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="m-2 border-bottom">
                  <label htmlFor="card" className="">Credit Card</label>
                  <div className="border-0 p-1" id="card-element">
                  </div>
                </div>
              </fieldset>

              <div className="col-12 mt-2 d-flex flex-column align-items-end">
                <button
                  className="btn-primary w-25 m-2"
                  id="submit"
                  disabled={!stripe || processing}
                >Pay</button>
                {error && (
                  <div id='card-errors' className="card-error bg-light text-danger p-2" role="alert">
                    {error}
                  </div>
                )}
              </div>

              <div className="col-12 mt-2 text-center bg-light">
                {succeeded && (
                  <div className="text-success p-2" role="alert">
                    <span className="font-weight-bold">Thank you for your payment.</span>
                    <br />Way to go! Get ready for your training session.
                  </div>
                )}
              </div>

            </form>
          </div>
        </div >

      </div>
    )
  }
}

export default Checkout;