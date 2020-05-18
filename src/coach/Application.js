import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AWS from 'aws-sdk';
import ProfilePicUpload from '../user/ProfilePicUpload'
import Select from 'react-select';
import { positions } from '../util/input';
import LocationInput from '../user/LocationInput.js';
import ExperiencesInput from './ExperiencesInput';
import { config } from '../util/s3';

AWS.config.update({ region: config.region, accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const isEmpty = obj => {
  return Object.keys(obj).length === 0
}

export default function Application() {

  const { state, dispatch } = useContext(Context);
  const history = useHistory();
  const user = state.auth.user || {}
  const initData = {
    bio: "", college: "", dob: "", email: "", experiences: "",
    gender: "male", location: "", menLacrosse: "", name: "", password: "",
    phone: "", position: "", picture: "", womenLacrosse: ""
  }
  const [applicationPic, setApplicationPic] = useState("")
  const [data, setData] = useState(initData);
  const [location, setLocation] = useState({});
  const getLocation = () => location;
  const [experiences, setExperiences] = useState([]);
  const getExperiences = () => experiences;

  // Auxilliary vars
  const preparePositionsToSelect = positions => {
    if (!Array.isArray((positions))) positions = [positions]
    return positions.map(p => ({ value: p, label: p.toUpperCase(), key: p }))
  }
  const options = preparePositionsToSelect(positions)

  useEffect(() => {
    setData(data => ({ ...data, experiences: experiences }))
  }, [experiences])

  useEffect(() => {
    setData(data => ({ ...data, location: location }))
  }, [location])

  useEffect(() => {
    if (applicationPic !== "") setData(data => ({ ...data, picture: applicationPic }))
  }, [applicationPic])

  useEffect(() => {
    if (Object.entries(user).length === 0) return;
    setData({
      dob: user.athlete && user.athlete.dob.split("T")[0], email: user.email, gender: user.gender,
      name: user.name, picture: user.picture, phone: user.phone, position: user.athlete && user.athlete.position
    });
    setLocation(user.location);
  }, [user])

  // ** Form input
  const formInput = (name, type, label, required) => {
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
          value={data && data[name] || ""}
          onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
          required={required || false}
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
          <label className="input-group-text" id="position">Primary Position</label>
        </div>
        <Select
          value={(data.position && preparePositionsToSelect(data.position)) || ""}
          onChange={option => { setData({ ...data, position: option.value || option.map(p => p.value) }) }}
          options={options}
          isMulti={true}
          className="d-flex col px-0 browser-default"
          styles={customStyle}
          required={true}
        />
      </div>
    )
  }
  const submitApplication = async data => {
    axios.post('/api/v1/users/coach-apply', data)
      .then(res => { // move temporary image to permanent folder
        if (data.picture.search("/temporary/") > 0) {
          const params = {
            ACL: "public-read",
            Bucket: 'train-my-game',
            CopySource: `train-my-game/avatar/temporary/${data.picture.split("temporary/")[1]}`,
            Key: `avatar/${res.data.user._id}`
          };
          s3.copyObject(params, function (err, data) {
            if (err) console.log("Error moving temporary profile picture", err, err.stack);
            else console.log(data)
          })
        }
        return res; // return the same response
      })
      .then(async res => {
        const url = `https://train-my-game.s3.us-east-2.amazonaws.com/avatar/${res.data.user._id}`
        const loginData = { token: res.data.token, user: { ...res.data.user, picture: url } }
        dispatch({ type: 'LOGIN', data: loginData });
        if (data.picture.search("/temporary/") > 0) await axios.put(`/api/v1/users/${res.data.user._id}`, { picture: url });
        history.push('/');
      })
  }

  return (
    <div id="profile">
      <h3>Apply for a Coaching Position</h3>
      <div className="row border p-4">
        <div className="col-12">
          <div className="h4">Bio</div>

          <form className="mt-2" onSubmit={e => { e.preventDefault(); !isEmpty(location) && submitApplication(data) }} id="coach-application-form">
            <div className="row border" id="bio">
              <div className="col-12 col-md-4 col-lg-3 pt-4 d-flex justify-content-center" id="profile-picture">
                <ProfilePicUpload setApplicationPic={setApplicationPic} />
              </div>
              <div className="col-12 col-md-8 col-lg-9 p-4">
                <p>Complete your application. Once a submission is received, it will be reviewed by the T.M.G. Team</p>
                <div className="form-row">
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
                        value={data["email"]}
                        onChange={e => { if (isEmpty(user)) return setData({ ...data, [e.target.name]: e.target.value }); }}
                        required={true}
                        disabled={state.auth && state.auth.isAuthenticated}
                      />
                    </div>
                  </div>
                  {isEmpty(user) &&
                    <div className="col-12 col-lg-5">
                      {formInput("password", "password", "Password")}
                    </div>}
                </div>
                <hr />
                <div className="form-row">
                  <div className="col-12 col-lg-7">
                    {formInput("name", "name", "Name")}
                  </div>
                  <div className="col-12 col-lg-5">
                    {formInput("phone", "tel", "Contact")}
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 col-lg-8">
                    {formInput("dob", "date", "Date of Birth")}
                  </div>
                  <div className="col-12 col-lg-4">
                    {genderInput()}
                  </div>
                </div>
                <hr />
                {/* data = { complement, street, city, state, zipcode } */}
                <LocationInput location={getLocation} setLocation={setLocation} />
              </div>
            </div>
            <div className="h4 mt-2">Playing Experience</div>
            <div className="row border" id="playing-experience">
              <div className="col-12 py-4">{positionInput()}</div>
              <div className="col-12">
                <div>Levels Competed</div>
                {!isEmpty(experiences) &&
                  <ExperiencesInput experiences={getExperiences} setExperiences={setExperiences} />
                }
                <button type="button" className="btn btn-secondary btn-sm my-2" onClick={() => {
                  const initXp = { type: "pro", division: "", conference: "", varsity: "", class: "", team: "" }
                  setExperiences(experiences.concat({ ...initXp }))
                }}>+ add experience</button>
              </div>
            </div>
            <div className="h4 mt-2">Coaching Experience</div>
            <div className="row border pt-2" id="coaching-experience">
              <div className="col-12 col-sm-6">
                {formInput("menLacrosse", "number", "Men Lacrosse")}
              </div>
              <div className="col-12 col-sm-6 pl-sm-0">
                {formInput("womenLacrosse", "number", "Women Lacrosse")}
              </div>
            </div>

            <div className="row pt-3 text-center float-right">
              <input type="submit" value="Submit application" className="btn btn-primary" />
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
