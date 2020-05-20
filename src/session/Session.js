import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts';
import { useParams } from "react-router";
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import GroupChat from './GroupChat';
import CoachCardId from '../coach/CoachCardId'

const Session = () => {

  const { state, dispatch } = useContext(Context);
  const user = (state.auth.isAuthenticated && state.auth.user) || {}
  const [session, setSession] = useState({});
  const [coach, setCoach] = useState({});
  const [maxDiscountTier, setMaxDiscountTier] = useState({}) // { qty, price }
  const { id } = useParams();
  const history = useHistory();

  // Effect
  useEffect(() => {
    if (session._id) return;
    loadSession(id);
  }, [session, id])

  useEffect(() => {
    if (session._id) setCoach(session.coach)
    if (session.discountTier) getMaxDiscountTier(session.discountTier)
  }, [session])

  // Auxiliary
  const isEmpty = obj => Object.keys(obj).length === 0

  const loadSession = async id => {
    axios.get(`/api/v1/sessions/${id}`).then(res => setSession(res.data.session));
  }

  const getSessionAddress = (location) => {
    // location: { complement ,street, city, zipcode, geo: {lat, lon} }
    if (!location) return;
    return <div>{location.complement} {location.street}. {location.zipcode}. {location.city}, {location.state}.</div>;
  }

  const getMaxDiscountTier = (discountTier) => {
    const minPrice = Math.min(...Object.values(discountTier))
    const maxDiscountTier = Object.entries(discountTier).filter(e => e[1] === minPrice)
    setMaxDiscountTier({ qty: maxDiscountTier[0][0], price: maxDiscountTier[0][1] });
  }

  const onClickJoin = () => {
    if (!state.auth.isAuthenticated) dispatch({ type: 'MODAL_ON', component: 'authModal' });
    else {
      history.push(`/sessions/${id}/join`)
    }
  }

  return (
    <div id="session">
      <div className="row">
        <div className="col-12 d-flex justify-content-between">
          <p className="h3">{session.title}</p>
          {((session.coach && session.coach._id === user._id) || (session.participants && session.participants.map(p => p._id).includes(state.auth.isAuthenticated && state.auth.user._id))) ? <div className="py-2 px-1 text-success">You're in. Get ready!</div> :
            <Link className="btn btn-primary active" to="#" onClick={() => onClickJoin()}>
              <i className="fas fa-play" /> Join
            </Link>
          }
        </div>

        {session &&
          <section className="border p-4 mt-2 w-100" id="session-info">
            <div className="container">
              <strong>Session Info</strong><hr />

              <div className="row">
                <div className="col-12 col-md-6">
                  <ul className="list-group list-group-flush" id="session-info">
                    <li className="list-group-item">Location: {getSessionAddress(session.location)}</li>
                    <li className="list-group-item">Base price: ${session.price}</li>
                    {session.discountTier &&
                      <li className="list-group-item">
                        Discounted price: up to ${maxDiscountTier.price / 100} if more than {maxDiscountTier.qty} players purchase.
                      </li>
                    }
                    {session.agenda &&
                      <li className="list-group-item">Time: {
                        `${(new Date(session.agenda.start)).toLocaleDateString()}:
                        ${(new Date(session.agenda.start)).toLocaleTimeString()}`
                      }
                      </li>}
                    {session.capacity && session.participants &&
                      <li className="list-group-item">Open slots: {
                        (session.capacity.max - session.participants.length > 1) ?
                          <span>{session.capacity.max - session.participants.length} slots available</span> :
                          <span>Last slot available</span>
                      }
                      </li>}
                  </ul>
                </div>
                <div className="col mt-4 mt-md-0" id="coach-bio">
                  <div className="bg-light p-3 border" id="session-notes">
                    <div className="h6">Notes:</div>
                    {session.notes && session.notes.map(note => <div className="my-2 p-2 w-100">{note}</div>)}
                  </div>
                </div>
              </div>
            </div>

          </section >}

        {coach.athlete &&
          <section className="border p-4 mt-2 w-100" id="coach-info">
            <div className="container">
              <strong>Coach</strong><hr />

              <div className="row d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-lg-between">
                <CoachCardId coach={coach} detail={{ ratings: true, instagram: true }} />

                <div className="col-12 col-md-8 mt-2">
                  <div className="bg-light p-3 border" id="bio-info">
                    <div className="h6">Bio info:</div>
                    {coach.athlete.bio}
                  </div>
                </div>
              </div>
            </div>
          </section>}

        {session.participants &&
          <section className="border p-4 mt-2 w-100" id="participants-info">

            <div className="container">
              <strong>Participants</strong><hr />

              <div className="row" id="session-info">
                {session.participants.map(p => (
                  <div className="col-12 col-md-6 d-flex d-row mt-2" key={p._id}>
                    <img className="rounded-circle img-thumbnail" alt={p.name} src={p.picture} style={{ maxWidth: "120px", maxHeight: "120px" }} />
                    <div className="row d-flex flex-column my-auto ml-2 h-100">
                      <div className="col">
                        <span className="d-block">{p.name}</span>
                        <span>{p.college || "College"}</span>
                      </div>
                    </div>
                  </div>)
                )}
              </div>

            </div>
          </section>
        }

        {!isEmpty(session) && <GroupChat chat={session.chat} />}

      </div >
    </div >
  )
}

export default Session