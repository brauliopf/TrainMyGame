import React, { useContext } from 'react'
import { Context } from '../Contexts';
import { Link, useHistory } from 'react-router-dom';
import CoachCardId from '../coach/CoachCardId'

const getSessionAddress = (location) => {
  if (!location) return;
  return `${location.complement} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}.`
}

export default function SessionDetails({ session, coach, users }) {

  const { state, dispatch } = useContext(Context);
  const history = useHistory();

  const onClickJoin = (session_id) => {
    if (!state.auth.isAuthenticated) dispatch({ type: 'MODAL_ON', component: 'authModal' });
    else {
      history.push(`/sessions/${session_id}/join`)
    }
  }

  return (
    <div key={session._id}>
      {(session && coach) &&
        <div className="row border text-center d-flex justify-content-between p-2 my-2">

          <div className="col-12 col-md-3 my-auto text-center">
            <CoachCardId coach={coach} detail={false} />
          </div>

          <div className="col-12 col-md-4 d-flex flex-column justify-content-center mt-4 my-md-2">
            <div className="mt-2">Location: {getSessionAddress(session.location)}</div>
            <div className="mt-2">Date: {(new Date(session.agenda.start)).toLocaleDateString()}</div>
          </div>
          <div className="col-12 col-md-3 d-flex flex-column justify-content-center">
            <div className="mt-2">Time: {(new Date(session.agenda.start)).toLocaleTimeString()}</div>
            {session.capacity && session.participants &&
              <div>
                <div className="mt-2">Open slots: {
                  (session.capacity.max - session.participants.length > 1) ?
                    `${session.capacity.max - session.participants.length} slots available`
                    : "Last slot available"
                }
                </div>
                <div className="my-2">
                  Current price: <br />
                  <span className="font-weight-bold">
                    US$ {(session.price / 100)
                      .toLocaleString(navigator.language, { minimumFractionDigits: 2 })}{" "}
                  </span>
                </div>
              </div>
            }
          </div>
          {session && session.participants &&
            <div className="col-12 col-md-2 d-flex flex-row flex-md-column justify-content-between align-items-center mt-4 my-md-2">
              {session.participants && <div className="position-relative" style={{ height: "60px", width: "100px", left: "-10px" }}>
                {session.participants.map((p, index) => (
                  index < 3 && <div className="d-flex" key={p._id}>
                    <img className="rounded-circle img-thumbnail position-absolute" alt={p.name} src={p.picture} style={{ maxWidth: "60px", maxHeight: "60px", position: "absolute", left: (25 * index + "px") }} />
                  </div>)
                )}
              </div>}
              {(session.participants && session.participants.map(p => p._id).includes(state.auth.isAuthenticated && state.auth.user._id)) ? <div className="py-2 px-1 text-success">You're in. Get ready!</div> :
                <div>
                  <Link className="btn btn-primary active" to="#" onClick={() => onClickJoin(session._id)}>
                    <i className="fas fa-play" /> Join
                    </Link>
                </div>
              }
            </div>
          }

        </div>
      }
    </div>
  )
}