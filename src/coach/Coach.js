import React, { useState, useEffect } from 'react'
import { useParams } from "react-router";
import MessageInput from '../coach/MessageInput';
import CoachCardId from './CoachCardId'
import SessionDetails from '../session/SessionDetails';
import axios from 'axios';

export default function Coach() {

  const [coach, setCoach] = useState({});
  const [sessions, setSessions] = useState({});
  const [publicProfiles, setPublicProfiles] = useState({}); // { user_id: { name, picture} }
  const { id: coachId } = useParams();

  // Effects
  useEffect(() => {
    loadCoach();
    loadsessions();
  }, [coachId]);

  useEffect(() => {
    if (isEmpty(sessions)) return;
    getPublicProfiles();
  }, [sessions])

  // Auxiliary
  const getPublicProfiles = async () => {
    let otherUsers = sessions.map(s => [s.coach].concat(s.participants)).flat()

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
  const loadCoach = async () => {
    axios.get(`/api/v1/coaches/${coachId}`).then(res => setCoach(res.data.coach))
  }
  const loadsessions = async () => {
    axios.get(`/api/v1/coaches/${coachId}/sessions`).then(res => setSessions(res.data.data))
  }
  const CoachPersonalData = ({ coach }) => {
    if (!coach.athlete) return "";
    return (
      <ul className="list-group my-2">
        {coach.athlete.position && <li className="list-group-item">Position: {coach.athlete.position.join(", ")}</li>}
        {coach.athlete.college && <li className="list-group-item">College: {coach.athlete.college}</li>}
        {coach.athlete.team && <li className="list-group-item">Current Team: {coach.athlete.team}</li>}
        {coach.athlete.experience && <li className="list-group-item">Experience (Playing): {coach.athlete.experience.player || "-"}</li>}
        {coach.athlete.experience && <li className="list-group-item">Experience (Coaching - Male): {coach.athlete.experience.coach_men}</li>}
        {coach.athlete.experience && <li className="list-group-item">Experience (Coaching - Female): {coach.athlete.experience.coach_women}</li>}
      </ul>)
  }

  return (
    <div id='coach'>
      <MessageInput coach={coach} />
      <h3 className="">Bio</h3>

      <div className="row border bg-light py-2 mb-2" id="coach-info">
        <div className="col-12 col-md-6 text-center d-flex flex-column justify-content-between">
          <CoachCardId coach={coach} detail={{ ratings: true, instagram: true }} />
          <CoachPersonalData coach={coach} />
          <div className="row justify-content-center my-2" id="inbox-cta">
            <button type="button" className='btn btn-secondary' data-toggle="modal" data-target="#MessageInput">
              Send Direct Message
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6 pt-2" id="personal">
          <h5>Personal</h5>
          <div className="py-2" id="text-intro">
            {(coach.athlete && coach.athlete.bio) || ""}
          </div>
          {coach.athlete && coach.athlete.video &&
            <div className="embed-responsive embed-responsive-16by9 my-2">
              <iframe width="560" height="315" src={coach.athlete.video.replace("youtu.be/", "www.youtube.com/embed/")} title={`${coach.name} - Video`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          }
        </div>
      </div>

      {!isEmpty(sessions) &&
        <div className="mt-4" id="sessions-info">
          <h4>Upcoming sessions</h4>
          {sessions.length > 0 && sessions.map(session => (
            <SessionDetails session={session} users={publicProfiles} key={session._id} />
          ))}
        </div>}
    </div>
  )
}