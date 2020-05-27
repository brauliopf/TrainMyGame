import React from 'react';
import { location_state } from '../util/input';

export default function ExperienceInput({ experiences, setExperiences }) {

  const formInput = (index, name, type, label, params) => {
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
          value={(experiences()[index] && experiences()[index][name]) || ""}
          min={params && params.min}
          max={params && params.max}
          onChange={e => updateExperiences({ index, targetName: e.target.name, targetValue: e.target.value })}
          required={params && params.required}
        />
      </div>)
  }

  const updateExperiences = ({ index, targetName, targetValue }) => {
    setExperiences(experiences().map((xp, i) => {
      if (i === index) { // replace value of {e.target.name} parameter
        const reducer = (object, [key, value]) => {
          object[key] = (key === targetName) ? targetValue : value
          return object
        }
        const newXp = Object.entries(xp).reduce(reducer, {});
        return newXp
      }
      else { // repeat xp
        return xp;
      }
    }))
  }

  const changeExperienceType = (target, xps) => {
    const index = target.id.split("_")[1];
    setExperiences(xps.map((xp, i) => {
      return (i === parseInt(index) ? { ...xp, type: target.value } : xp)
    }))
  }

  const ExperienceTypeRadioButton = (experienceType, type, label, index) => {
    return (
      <div className="form-check form-check-inline">
        <input
          className="form-check-input" type="radio"
          name={`xpTypeOptions_${index}`} id={`${type}_${index}`} value={type}
          onClick={e => changeExperienceType(e.target, experiences())}
          defaultChecked={experienceType === type} />
        <label className="form-check-label" htmlFor={`${type}_${index}`} name={`xpTypeOptions_${index}`}>{label}</label>
      </div>
    )
  }

  return (
    <div>
      {experiences().map((experience, index) => (
        <div key={index} className="col-12 p-2 mt-2 border bg-light">
          <div className="xp-type">
            {ExperienceTypeRadioButton(experience.type, "highSchool", "High School", index)}
            {ExperienceTypeRadioButton(experience.type, "college", "College", index)}
            {ExperienceTypeRadioButton(experience.type, "professional", "Professional", index)}
          </div>

          <div className="xp-details">

            {experience.type === "highSchool" &&
              <div className="my-2 complement-highSchool">
                <div className="form-row">
                  <div className="input-group mb-2 col-md-3"> {/* State */}
                    <div className="input-group-prepend">
                      <label className="input-group-text">State</label>
                    </div>
                    <select
                      label="state"
                      type="text"
                      name="state"
                      className='form-control'
                      // onChange={e => props.setLocation({ ...props.location(), [e.target.name]: e.target.value })}
                      onChange={e => updateExperiences({ index, targetName: e.target.name, targetValue: e.target.value })}
                      // value={(props.location() && props.location().state) || ""}
                      value={(experiences()[index] && experiences()[index]["state"]) || ""}
                    >
                      {Object.keys(location_state).map((state, index) => <option key={index}>{state}</option>)}
                    </select>
                  </div>
                  <div className="col-md-5">
                    {formInput(index, "varsity", "number", "# Varsity seasons", { "min": 1, "max": 4 })}
                  </div>
                  <div className="col-md-4">
                    {formInput(index, "class", "number", "Class of #")}
                  </div>
                </div>
              </div>
            }

            {experience.type === "college" &&
              <div className="my-2 complement-college">
                <div className="form-row">
                  <div className="col-12 col-lg-6">
                    {formInput(index, "division", "number", "Division", { "min": 1, "max": 3 })}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "conference", "text", "Conference")}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "varsity", "number", "# Varsity seasons", { "min": 1, "max": 4 })}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "class", "number", "Class of #")}
                  </div>
                </div>
              </div>
            }

            {experience.type === "professional" &&
              < div className="my-2 complement-pro" >
                <div className="form-row">
                  <div className="col-12 col-lg-6">
                    {formInput(index, "team", "text", "Team")}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>))}
    </div>
  )
}
