import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import axios from 'axios';
import LocationInput from '../user/LocationInput.js';

export default function CreateSession() {

  const { state, } = useContext(Context);
  const user = state.auth.user || {}
  const [data, setData] = useState({})
  const [location, setLocation] = useState({});
  const getLocation = () => location;

  // Effects
  useEffect(() => {
    setData({
      title: "",
      max_participants: "",
      date: Date,
      start_time: "",
      end_time: "",
      price: ""
    })
  }, [])

  useEffect(() => {
    setLocation(user.location)
  }, [user])

  useEffect(() => {
    setData({ ...data, location: location })
  }, [data, location])

  // Auxiliary
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
          value={data && data[name]}
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
    axios.post("/api/v1/sessions/", data)
  }

  return (
    <div id="create-session">
      <h3>Create a Session</h3>
      <div className="row border py-4 px-2">
        <div className="col-12">

          <form className="mt-2" onSubmit={e => { e.preventDefault(); submitSession(data) }} id="create-session-form">

            <div className="form-row">

              <div className="col-12">
                {formInput("title", "text", "Title", true)}
              </div>
              <div className="w-100 mx-1">
                <LocationInput location={getLocation} setLocation={setLocation} />
              </div>


              <div className="col-12 col-md-4">
                {formInput("date", "date", "Date", true)}
              </div>
              <div className="col-12 col-md-4">
                {priceInput()}
                {/* {formInput("price_player", "money", "Price/Player")} */}
              </div>
              <div className="col-12 col-md-4">
                {formInput("max_articipants", "number", "Max Participants")}
              </div>

            </div>

            <div className="form-row mt-2 d-flex align-items-end">

              <div class="input-group">
                <div class="input-group-prepend d-flex">
                  <span class="input-group-text w-100" id="">Start and End Times (EST)</span>
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
