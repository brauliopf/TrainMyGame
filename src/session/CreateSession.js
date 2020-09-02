import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import axios from 'axios';
import LocationInput from '../user/LocationInput.js';
import { useHistory } from 'react-router-dom';

export default function CreateSession() {

  const { state, } = useContext(Context);
  const history = useHistory();
  const user = state.auth.user || {}
  const initState = { title: "", max_participants: "", date: Date, start_time: "", end_time: "", price: "" }
  const [data, setData] = useState(initState)
  const [location, setLocation] = useState({});
  const getLocation = () => location;

  // Effects
  useEffect(() => {
    setLocation(user.location)
  }, [user])

  useEffect(() => {
    setData({ ...data, location: location })
  }, [location])

  // Auxiliary
  const formInput = (name, type, label, required = false, placeholder = "") => {
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <label className="input-group-text" id={name}>{label}</label>
        </div>
        <input
          label={label}
          type={type}
          name={name}
          placeholder={placeholder}
          className='form-control'
          value={(data && data[name]) || ""}
          onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
          required={required || false}
        />
      </div>)
  }
  const priceInput = () => {
    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <label className="input-group-text" id="price_player">Price/Player ($)</label>
        </div>
        <input
          label="Price/Player ($)"
          type="number"
          name="price"
          className='form-control'
          value={data && data.price}
          onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
          required={true}
        />
      </div>)
  }
  const submitSession = data => {
    setData({ ...data, price: data.price })
    axios.post("/api/v1/sessions/", data)
      .then(res => history.push(`/sessions/${res.data.session._id}`))
  }

  return (
    <div id="create-session">
      <h3>Create a Session</h3>
      <div className="row border py-4 px-2">
        <div className="col-12">

          <form className="mt-2" onSubmit={e => { e.preventDefault(); submitSession(data) }} id="create-session-form">

            <div className="form-row">

              <div className="col-12">
                {formInput("title", "text", "Title", true, '(For example: "Shooting and Agility Training")')}
              </div>
              <div className="col-12">
                {formInput("notes", "text", "Notes", true, '(Such as: "Helmet and gloves required.")')}
              </div>
              <div className="w-100 mx-1">
                <LocationInput location={getLocation} setLocation={setLocation} />
              </div>


              <div className="col-12 col-md-4">
                {formInput("date", "date", "Date", true)}
              </div>
              <div className="col-12 col-md-4">
                {priceInput()}
              </div>
              <div className="col-12 col-md-4">
                {formInput("max_participants", "number", "Max Participants")}
              </div>

            </div>

            <div className="form-row mt-2 d-flex align-items-end">

              <div className="input-group">
                <div className="input-group-prepend d-flex">
                  <span className="input-group-text w-100" id="">Start and End Times (EST)</span>
                </div>
                <div className="d-flex w-100">
                  <input
                    label="start_time"
                    type="time"
                    name="start_time"
                    className='form-control'
                    value={data && data.start_time}
                    onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                    required />
                  <input
                    label="end_time"
                    type="time"
                    name="end_time"
                    className='form-control'
                    value={data && data.end_time}
                    onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                    required />
                </div>
              </div>
              <div className="col-12 mt-4 pr-0 text-right">
                <input type="submit" value="Create session" className="btn btn-primary" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >
  )
}
