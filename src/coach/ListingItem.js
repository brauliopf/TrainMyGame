import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import CoachCardId from './CoachCardId'
import { months } from '../util/date';

const sessionListingItems = sessions => (
  <ul className="list-group">
    {sessions.map(session => {
      if (!session || !session.agenda) return;
      const { dateString, time, slots } = getSessionParams(session);
      return (
        <li className="list-group-item p-1" key={session._id}>
          <Link className="dropdown-item" to={`/sessions/${session._id}`}>
            <div className="">
              {`${session.title || "Lacrosse Session"}`}
            </div>
            <div className="">{`${dateString}, ${time} – Open slots: ${slots}`}</div>
          </Link>
        </li>
      )
    })}
  </ul>

)

const getSessionParams = session => {
  const date = new Date(session.agenda.start);
  const time = date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true });
  const day = date.getDate();
  const dateString =
    `${months[date.getMonth()]}. ${day}${day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}`;
  // const time_str =
  //   ((time.hours > 12) ? `${time.hours - 12}` : `${time.hours}`)
  //     .concat(`:${time.minutes < 10 && "0"}${time.minutes}${(time.hours > 12) ? "pm" : "am"}`)
  const slots = session.capacity ? session.capacity.max - ((session.participants && session.participants.length) || 0) : "#";
  return { dateString, time, slots }
}

const getCoachAddress = location => {
  if (!location) return;
  return `${location?.complement ? location.complement : ''} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}.`
}

export default function ListingItem(props) {

  const history = useHistory();
  const sessions = props.sessions

  // console.log("LISTING", props.coach.name, props.sessions)
  return (
    <div className="col-lg-4 col-sm-6 my-3" key={props.coach._id} style={{ cursor: 'pointer' }}
      onClick={() => history.push(`/coaches/${props.coach._id}`)}>
      <div className="card h-100">
        <div className="card-body d-flex flex-column justify-content-between">

          <CoachCardId coach={props.coach} detail={{ ratings: true }} />

          <p className="card-text mt-2">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <ul className='list-group'>
            <li className='list-group-item'>Location: {getCoachAddress(props.coach.location)}</li>
            <li className='list-group-item'>Email: {props.coach.email}</li>
            <li className='list-group-item'>Phone: {props.coach.phone}</li>
          </ul>

          {sessions && sessions.length > 0 ? <div className="w-100 text-center mt-3" id="opensessions" onClick={e => { e.stopPropagation(); }}>
            <div className="w-100 text-center mt-3">
              <Link className="btn btn-secondary dropdown-toggle" to="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {sessions.length} Open session{sessions.length > 1 ? "s" : ""}
              </Link>
              <div className="dropdown-menu py-0 border-0" aria-labelledby="dropdownMenuLink">
                {sessionListingItems(sessions)}
              </div>
            </div>
          </div> : <div className="col mt-2"><p>No upcoming sessions scheduled</p></div>}
        </div>
      </div>
    </div >
  )
}