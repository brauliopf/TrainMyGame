import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';

const getLocationAddress = (location) => {
  if (!location) return;
  return <div>{location.complement} {location.street}. {location.zipcode}. {location.city}, {location.state}.</div>;
}

const handleResponse = (id, response) => {
  const data = { applicationDecision: response }
  console.log(id, data)
  axios.put(`/api/v1/users/${id}/coachApplication`, data)
}

export default function Admin() {

  const { state, } = useContext(Context);
  const user = state.auth.user || {}
  const [applicants, setApplicants] = useState([])
  const history = useHistory();

  useEffect(() => {
    if (!user || user.role !== "admin") history.push('/')
  }, [user])

  useEffect(() => {
    if (Object.entries(user).length > 0) axios.get("/api/v1/users/coach-applicants").then(res => setApplicants(res.data))
  }, [user])

  return (
    <div>
      <nav class="navbar navbar-light bg-secondary border">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <Link class="nav-link" href="#" id="coach-application">Coach Applications</Link>
          </li>
        </ul>
      </nav>

      <div className="row">
        <div className="col-12">
          <ul className="list-group">
            {applicants.length > 0 && applicants.map((a, index) => {
              return (
                <li className={classnames("list-group-item", { "text-secondary": false })} key={index}>
                  <div className="row d-flex justify-content-between">
                    <div className="col-3">
                      <Link to={`/coaches/${a._id}`}>{a.name}</Link>
                    </div>
                    <div className="col-6">{getLocationAddress(a.location)}</div>
                    <div className="col-2 d-flex flex-column text-right">
                      <button className="btn btn-sm btn-primary" id={a._id} onClick={e => handleResponse(e.target.id, true)}>Approve</button>
                      <button className="btn btn-sm btn-secondary mt-1" id={a._id} onClick={e => handleResponse(e.target.id, false)}>Reject</button>
                    </div>
                  </div>
                </li>)
            })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
