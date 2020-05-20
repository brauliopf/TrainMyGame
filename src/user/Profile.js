import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import AWS from 'aws-sdk'
import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import Select from 'react-select';
import { positions } from '../util/input';
import LocationInput from './LocationInput.js';
import CoachCardId from '../coach/CoachCardId';
import { s3Config } from '../util/s3';

AWS.config.update({ region: s3Config.region, accessKeyId: s3Config.accessKeyId, secretAccessKey: s3Config.secretAccessKey });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export default function Profile() {

  // State vars
  const history = useHistory();
  const { state, } = useContext(Context);
  const user = state.auth.user || ""
  const [data, setData] = useState({});
  const [sessions, setSessions] = useState([]);
  const [others, setOthers] = useState({}); // { user_id: { name, picture} }
  const [location, setLocation] = useState({});
  const getLocation = () => location;

  // Auxilliary vars
  const preparePositionsToSelect = positions => positions.map(p => ({ value: p, label: p.toUpperCase(), key: p }));
  const options = preparePositionsToSelect(positions)


  // Effects
  useEffect(() => {
    if (!state.auth.user); //history.push("/")
    else {
      loadSessions(user)

      // set control vars for form input
      const { name, phone, picture } = state.auth.user
      const { position, college, team, gender, dob, video, bio } = state.auth.user.athlete || {}
      const { men: xp_men, women: xp_women } = (state.auth.user.athlete && state.auth.user.athlete.experienceTime) || {}
      const { complement, street, city, state: stt, zipcode, geo } = state.auth.user.location || {}
      setLocation({ complement, street, city, state: stt, zipcode, geo });
      setData({ location, name, phone, position, gender, dob: dob ? dob.split("T")[0] : undefined, video, college, team, xp_men, xp_women, picture, bio });
    }
  }, [user, history])

  // Get profile info from other users (picture and id)
  useEffect(() => {
    if (!sessions || isEmpty(sessions)) return;
    const others = sessions.map(s => s.participants.concat(s.coach)).flat()
    axios.post(`api/v1/users/public-profiles`, { users: others }).then(res => setOthers(res.data))
  }, [sessions])

  useEffect(() => {
    data.location = location
  }, [location])

  // Auxiliary
  // ** Form input
  const formInput = (name, type, label) => {
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <label className="input-group-text" id={name}>{label}</label>
        </div>
        <input
          label={label}
          type={type}
          name={name}
          className='form-control'
          value={(data && data[name]) || ""}
          onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
        />
      </div>)
  }
  const genderInput = () => {
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <label className="input-group-text" id="gender">Gender</label>
        </div>
        <select
          className="browser-default custom-select"
          value={data.gender}
          name="gender"
          onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
          required
          id="select-gender"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>)
  }
  const positionInput = () => {
    // https://react-select.com/styles
    const customStyle = {
      option: (provided, state) => ({ ...provided }),
      control: (provided, state) => ({ ...provided, width: "100%" })
    }
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <label className="input-group-text" id="position">Position</label>
        </div>
        <Select
          value={(data.position && preparePositionsToSelect(data.position)) || ""}
          onChange={option => { setData({ ...data, position: option.map(p => p.value) }) }}
          options={options}
          isMulti={true}
          className="d-flex col px-0 browser-default"
          styles={customStyle}
        />
      </div>
    )
  }

  // ** HTTP requests
  const loadSessions = async user => {
    if (user.athlete && user.athlete.type === "coach") {
      axios.get(`/api/v1/coaches/${user._id}/sessions`).then(res => { setSessions(res.data.data) })
    }
    else {
      axios.get(`/api/v1/orders`).then(res => { setSessions(res.data.map(o => o.session)) })
    }
  }
  const isEmpty = obj => {
    return Object.keys(obj).length === 0
  }
  const uploadFile = (file) => { // upload file to s3
    const uploadParams = {
      ACL: "public-read",
      Bucket: s3Config.bucketName,
      Key: `avatar/${user._id}`,
      Body: file
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error - picture upload: ", err);
      } else {
        const newUrl = `${s3Config.bucketURL}/${data.key}`;
        updateProfile({ picture: newUrl });
      }
    })
  }
  const updateProfile = async dt => {
    axios.put(`/api/v1/users/${state.auth.user._id}`, dt)
      .then(res => { setData({ ...data, picture: '' }); return res; })
      .then(res => setData({ ...data, picture: res.data.user.picture }))
  }

  // ** UI components
  const getLocationAddress = (location) => {
    if (!location) return;
    return `${location.complement} ${location.street}, ${location.city}, ${location.state} ${location.zipcode}.`
  }
  const getUpcomingSessions = (user, sessions) => {
    if (user.athlete && user.athlete.type === "coach") {
      return (
        isEmpty(sessions) && others ?
          <div className="w-100 border text-secondary text-center  p-4">
            You don't have upcoming sessions. <Link to="/session/new">Create a session</Link> now at a location close to you.
          </div> :
          !isEmpty(others) && sessions.map(s => getSessionSummary(s, others)))
    }
    else return (
      isEmpty(sessions) && others ?
        <div className="w-100 border text-secondary text-center p-4">You don't have upcoming sessions. Come <Link to="/coaches">find a coach</Link> with us.</div> :
        <div className="" id="upcoming_sessions">
          {!isEmpty(others) && sessions.map(s => getSessionSummary(s, others))}
        </div>)
  }
  const getSessionSummary = (session, others) => {
    const coach = others[session.coach]

    return (
      <div className="col-12" key={session._id}>
        {(session && others && session.agenda) &&
          <div className="row border bg-light">

            <div className="col-12 col-md-2 mt-2 text-center">
              <CoachCardId coach={coach} detail={false} />
            </div>

            <div className="col-12 col-md-5 d-flex flex-column justify-content-center mt-2">
              <div className="mt-2">Location: {getLocationAddress(session.location)}</div>
              <div className="mt-2">Date: {(new Date(session.agenda.start)).toLocaleDateString()}</div>
            </div>
            <div className="col-12 col-md-3 d-flex flex-column justify-content-center">
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

            <div className="col-12 col-md-2 d-flex flex-row flex-md-column justify-content-between align-items-center h-100 mt-4 my-md-2" style={{ height: "60px" }}>
              <div className="position-relative" style={{ height: "60px", width: "100px", left: "-10px" }}>
                {session.participants.length > 0 && session.participants.map((p, index) => {
                  return (
                    index < 3 && <div className="d-flex" key={p}>
                      <img className="rounded-circle img-thumbnail position-absolute" alt={p.name} id={others[p._id]} src={others[p._id].picture} style={{ maxWidth: "60px", maxHeight: "60px", position: "absolute", left: (25 * index + "px") }} />
                    </div>)
                }
                )}
              </div>
              <div className="my-2">
                Current price: <br />
                <span className="font-weight-bold">
                  US$ {(session.price / 100)
                    .toLocaleString(navigator.language, { minimumFractionDigits: 0 })}{" "}
                </span>
              </div>
            </div>

          </div>
        }
      </div>
    )
  }

  // console.log("profile", data)
  return (
    <div id="profile">
      <h3>Profile</h3>
      <div className="row border">
        <div className="col-12 col-md-4 col-lg-3 pt-4 d-flex flex-column justify-content-start text-center">
          <div className="d-flex flex-column mx-auto my-4" id="profile-picture">
            <img
              className="img-thumbnail" src={data.picture && data.picture} alt={user.name || "avatar"}
              style={{ maxHeight: "180px", maxWidth: "180px" }}
            />
            <Link className="mt-1" style={{ "fontSize": "14px" }} to="#" onClick={() => $("#imageUpload").click()}><i className="fas fa-file-upload"></i> Submit Profile Head Shot </Link>
            <input id="imageUpload" style={{ display: "none" }} type="file" onChange={e => uploadFile(e.target.files[0])} />

          </div>

          {user.athlete && user.athlete.type === "coach" &&
            <div className="d-flex flex-column justify-content-between">
              <p className="h6 text-left">Media</p>
              {user.athlete && user.athlete.video &&
                <div className="embed-responsive embed-responsive-16by9 my-2">
                  <iframe width="560" height="315" src={user.athlete.video} title={`${user.name} - Video`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              }
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <label className="input-group-text" id="video_url" form="#user-profile">URL</label>
                </div>
                <input
                  label="Video"
                  type="url"
                  name="video"
                  className='form-control'
                  value={(data && data.video) || ""}
                  onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                />
              </div>
            </div>}
        </div>

        <div className="col my-md-2 py-3 position-relative" id="bio">
          <p className="h6 text-left">Personal</p>
          <form className="mt-2" onSubmit={e => { e.preventDefault(); updateProfile(data) }} id="user-profile">
            <div className="row">
              <div className="col-12">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <label className="input-group-text" id="email">Email</label>
                  </div>
                  <input
                    label="Email"
                    type="text"
                    name="email"
                    className='form-control'
                    disabled
                    value={user.email || ""}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-7">
                {formInput("name", "name", "Name")}
              </div>
              <div className="col-12 col-lg-5 pl-lg-0">
                {formInput("phone", "tel", "Contact")}
              </div>
            </div>
            {/* data = { complement, street, city, state, zipcode } */}
            <LocationInput location={getLocation} setLocation={setLocation} />
            <div className="row">
              <div className="col-12 col-lg-7">
                {formInput("dob", "date", "Date of Birth")}
              </div>
              <div className="col-12 col-lg-5 pl-lg-0">
                {genderInput()}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-7">
                {positionInput()}
              </div>
              <div className="col-12 col-lg-5 pl-lg-0">
                {formInput("college", "name", "College")}
              </div>
              <div className="col-12">
                {formInput("team", "name", "Team")}
              </div>
            </div>
            {user.athlete && user.athlete.type === "coach" &&
              <div className="row">
                <div className="col-4 text-left mt-2">Experience (years):</div>
                <div className="col-8 d-flex flex-column flex-md-row">
                  <div className="">
                    {formInput("xp_men", "number", "Men Lac.")}
                  </div>
                  <div className="pl-0 pl-md-4">
                    {formInput("xp_women", "number", "Women Lac.")}
                  </div>
                </div>
              </div>}
            <div className="py-2">
              <label className="input-group-text" id="bio">Bio</label>
              <textarea
                label="Bio"
                type="text"
                name="bio"
                className='form-control'
                value={data["bio"] === undefined ? "I <3 Lacrosse!" : data["bio"]}
                onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                rows="4"
              />
            </div>

            <div className="pt-3 text-center float-right">
              <input type="submit" value="Update profile" className="btn btn-primary" />
            </div>
          </form>

        </div>
      </div>

      <div className="row my-4">
        <div className="col-12 d-flex justify-content-between">
          <h4>Upcoming sessions</h4>
          {user.athlete && user.athlete.type === "coach" &&
            <Link to="/sessions/new" className="btn btn-primary my-2 my-md-0">Create a session</Link>
          }
        </div>
        <div className="col-12">
          <div className="row">
            {getUpcomingSessions(user, sessions)}
          </div>
        </div>
      </div>
    </div>
  )
}