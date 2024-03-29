import React, { useState, useEffect, useContext } from 'react'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Context } from '../Contexts'
import { useParams } from "react-router";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// https://stripe.com/docs/payments/integration-builder
const Checkout = () => {

  const { state, dispatch } = useContext(Context);
  const user = (state.auth.isAuthenticated && state.auth.user) || {}
  const [clientSecret, setClientSecret] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const history = useHistory();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState("");
  const [session, setSession] = useState({});
  const [publicProfiles, setPublicProfiles] = useState({}); // { user_id: { name, picture} }

  // Control vars & UI elements
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState('');

  // Effect
  useEffect(() => {
    if (!state.auth.isAuthenticated || (user._id === session.coach)) history.push("/")
    createPaymentIntent(id);
    isEmpty(session) && loadSession(id);
  }, [id, order])

  useEffect(() => {
    if (isEmpty(session)) return;
    getPublicProfiles();
  }, [session])

  // Auxiliary
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
  const createPaymentIntent = async (id) => {
    axios.post(`/api/v1/sessions/${id}/orders/createPaymentIntent`)
      .then(res => {
        setClientSecret(res.data.clientSecret);
        console.log("Here's the client secret " + res.data.client_secret);
        //setOrder(res.data.order_id);
      })
  }
  const loadSession = async (id) => {
    axios.get(`/api/v1/sessions/${id}`).then(res => setSession(res.data.session));
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
  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: state.auth.user.email,
      payment_method: { // id of an existing PaymentMethod || { new PaymentMethod details }
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed. ${payload.error.message}`);
      setProcessing(false);
    } else if ((payload.paymentIntent && payload.paymentIntent.status === 'succeeded')) {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      dispatch({ type: "PAYMENT_AUTHORIZED", data: { order, session: session._id, user: state.auth.user._id, paymentIntent: payload.paymentIntent.id } });
      setTimeout(function () { history.push(`/sessions/${session._id}`) }, 3000);
    }

  }

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
          <form className="row d-flex flex-column my-4" id="payment-form" onSubmit={handleSubmit}>
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
                <div className="border-0 p-1">
                  <CardElement
                    id="card-element"
                    className=""
                  />
                </div>
              </div>
            </fieldset>

            <div className="col-12 mt-2 d-flex flex-column align-items-end">
              <button
                className="btn-primary w-25 m-2"
                id="submit"
                disabled={processing}
              >Pay</button>
              {error && (
                <div className="card-error bg-light text-danger p-2" role="alert">
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

export default Checkout;