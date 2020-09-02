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
  const [publicProfiles, setPublicProfiles] = useState({}); // { user_id: { name, picture} }
  const [maxDiscountTier, setMaxDiscountTier] = useState({}) // { qty, price }
  const { id } = useParams();
  const history = useHistory();

  // Effect
  useEffect(() => {
    loadSession(id);
  }, [id])

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

  const isEmpty = (obj = {}) => {
    return obj.length === 0 || Object.entries(obj).length === 0
  }

  const loadSession = async id => {
    axios.get(`/api/v1/sessions/${id}`).then(res => setSession(res.data.session));
  }

  const getSessionAddress = (location) => {
    // location: { complement ,street, city, zipcode, geo: {lat, lon} }
    if (!location) return;
    return <div>{location.complement} {location.street}. {location.zipcode}. {location.city}, {location.state}.</div>;
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
          {((session?.coach === user._id) || (session.participants && session.participants.includes(user._id))) ? <div className="py-2 px-1 text-success">You're in. Get ready!</div> :
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
                    <li className="list-group-item">Base price: ${session.price / 100}</li>
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

                {
                  session.notes &&
                  <div className="col mt-4 mt-md-0" id="session-notes">
                    <div className="bg-light p-3 border">
                      <div className="h6">Notes:</div>
                      <div className="my-2 p-2 w-100">{session?.notes}</div>
                    </div>
                  </div>
                }

              </div>
            </div>

          </section >}

        {!isEmpty(publicProfiles) &&
          <section className="border p-4 mt-2 w-100" id="coach-info">
            <div className="container">
              <strong>Coach</strong><hr />

              <div className="row d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-lg-between">
                <CoachCardId coach={publicProfiles[session.coach]} detail={{ ratings: true, instagram: true }} />

                <div className="col-12 col-md-8 mt-2">
                  <div className="bg-light p-3 border" id="bio-info">
                    <div className="h6">Bio info:</div>
                    {(publicProfiles[session.coach].athlete && publicProfiles[session.coach].athlete.bio) || ""}
                  </div>
                </div>
              </div>
            </div>
          </section>}

        {!isEmpty(session.participants) &&
          <section className="border p-4 mt-2 w-100" id="participants-info">

            <div className="container">
              <strong>Participants</strong><hr />

              <div className="row" id="session-info">
                {!isEmpty(publicProfiles) && session.participants.map((p, idx) => (
                  <div className="col-12 col-md-6 d-flex d-row mt-2" key={idx}>
                    <img className="rounded-circle img-thumbnail" alt={publicProfiles[p].name} src={publicProfiles[p].picture} style={{ maxWidth: "120px", maxHeight: "120px" }} />
                    <div className="row d-flex flex-column my-auto ml-2 h-100">
                      <div className="col">
                        <span className="d-block">{publicProfiles[p].name}</span>
                        <span>{publicProfiles[p].college}</span>
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