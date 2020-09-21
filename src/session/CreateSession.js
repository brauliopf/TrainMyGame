import React, {useState, useEffect, useContext} from 'react';
import { Context } from '../Contexts'
import axios from 'axios';
import LocationInput from '../user/LocationInput.js';
import { useHistory } from 'react-router-dom';
import { useParams } from "react-router";
import $ from 'jquery'

export default function CreateSession() {

  const { state, } = useContext(Context);
  const history = useHistory();
  const user = state.auth.user || {}
  const initState = { title: "", max_participants: "", date: Date, start_time: "", end_time: "", price: "" }
  const [data, setData] = useState(initState)
  const [location, setLocation] = useState({});
  const getLocation = () => location;
  const { id: sessionId } = useParams();

  // Effects
  useEffect(() => {
    setLocation(user.location)
  }, [user])

  useEffect(() => {
    setData({ ...data, location: location })
  }, [location])

  useEffect(() => {
    if (sessionId) {
      axios.get(`/api/v1/sessions/${sessionId}`).then(
        (res) => {
          setData(res.data);
          setFormFields(res.data);
        }
      )
    }
  }, [])

  // Auxiliary
  const setFormFields = (data) => {
    console.log(data)
    $('input[name="title"]').val(data.session.title);
    $('input[name="notes"]').val(data.session.notes);
    $('input[name="price"]').val(data.session.price);
    $('input[name="max_participants"]').val(data.session.capacity?.max);

    // put date in format for input field
    const dateArray = data.session.agenda?.date.split("-");
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2].substr(0, dateArray[2].indexOf('T'));
    const sessionDate = `${year}-${month}-${day}`;
    $('input[name="date"]').val(sessionDate);

    // put start and end times into format for input field
    const startDate = data.session.agenda?.start;
    const startTimeArray = startDate.substr(startDate.indexOf('T') + 1).split(":");
    const startHour = startTimeArray[0];
    const startMin = startTimeArray[1];
    const startTime = `${startHour}:${startMin}`;
    $('input[name="start_time"]').val(startTime);

    const endDate = data.session.agenda?.end;
    const endTimeArray = endDate.substr(endDate.indexOf('T') + 1).split(":");
    const endHour = endTimeArray[0];
    const endMin = endTimeArray[1];
    const endTime = `${endHour}:${endMin}`;
    $('input[name="end_time"]').val(endTime);
  }

  const setSingleFormField = (fieldName, data) => {
    $(`input[name=${fieldName}`).val(data);
  }

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
          value={(data && data[name])}
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
    setData({...data, price: data.price})
    if (sessionId) {
      axios.patch("/api/v1/sessions/edit", data)
        .then(res => history.push(`/sessions/${res.data.session._id}`))
    } else {
      axios.post("/api/v1/sessions/", data)
        .then(res => history.push(`/sessions/${res.data.session._id}`))
    }
  }

  return (
      <div id="create-session">
        {
          data &&
          <div>
            <h3>{!sessionId ? 'Create a Session' : 'Edit Session'}</h3>
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

                    {!sessionId &&
                    <div className="w-100 mx-1">
                      <LocationInput location={getLocation} setLocation={setLocation} />
                    </div>
                    }


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

                  <div className="form-row mt-2 d-flex align-items-end" style={{paddingLeft: '5px', paddingRight: '5px'}}>

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
          </div>
        }
      </div >
  )
}
