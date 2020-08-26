import React, { useContext } from 'react'
import { Context } from '../Contexts';
import { Link, useHistory } from 'react-router-dom';
import CoachCardId from '../coach/CoachCardId';

const getSessionAddress = (location) => {
  if (!location) return;
  return `${location.complement} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}.`
}

export default function SessionDetails(props) {

  const { state, dispatch } = useContext(Context);
  const history = useHistory();
  const { session, users } = props;
  const coach = users[session.coach];


  const onClickJoin = (session_id) => {
    if (!state.auth.isAuthenticated) dispatch({ type: 'MODAL_ON', component: 'authModal' });
    else {
      history.push(`/sessions/${session_id}/join`)
    }
  }

  const getSlotsAvailable = () => {
    let text
    if (!session.participants) text = `${session.capacity.max} slots available`;
    else {
      text = (session.capacity.max - (session.participants && session.participants.length || 0) > 1) ?
        `${session.capacity.max - session.participants.length} slots available`
        : "Last slot available";
    }
    return text;
  }

  console.log(session.participants);

  return (
    <div key={session._id}>
      {(session && coach) &&
        <div className="row border text-center d-flex justify-content-between py-2 my-2">

          <div className="col-12 col-md-3">
            <CoachCardId coach={coach} />
          </div>

          <div className="col-12 col-md-4 d-flex flex-column justify-content-center">
            <div className="mt-2 mt-md-0">Location: {getSessionAddress(session.location)}</div>
            <div className="mt-2 d-flex flex-row justify-content-center">
              Date: {(new Date(session.agenda.start)).toLocaleDateString()}
              ({(new Date(session.agenda.start)).toLocaleTimeString()})
            </div>
          </div>


          <div className="col-12 col-md-3 d-flex flex-column justify-content-center">
            {session.capacity &&
              <div>
                <div className="mt-2">{getSlotsAvailable()}</div>
                <div className="my-2 justify-content-center d-flex flex-row flex-md-column flex-lg-row">
                  <div className="mx-1">Current price:</div>
                  <div className="font-weight-bold">
                    US$ {(session.price / 100)
                      .toLocaleString(navigator.language, { minimumFractionDigits: 0 })}{" "}
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="col-12 col-md-2 d-flex flex-row flex-md-column justify-content-between align-items-center mt-4 my-md-2">

            <div className="position-relative" style={{ height: "60px", width: "100px", left: "-10px" }}>
              {session.participants && session.participants.map((p, index) => (
                index < 3 && <div className="d-flex" key={index}>
                  <img className="rounded-circle img-thumbnail position-absolute" alt={users[p].name} src={users[p].picture} style={{ maxWidth: "60px", maxHeight: "60px", position: "absolute", left: (25 * index + "px") }} />
                </div>)
              )}
            </div>

            {(session.participants && session.participants.map(p => users[p]._id).includes(state.auth.isAuthenticated && state.auth.user._id)) ?
              <div className="py-2 px-1 text-success">You're in. Get ready!</div> :
              <div>
                <Link className="btn btn-primary active" to="#" onClick={() => onClickJoin(session._id)}>
                  <i className="fas fa-play" /> Join
                    </Link>
              </div>
            }
          </div>

        </div>
      }
    </div>
  )
}