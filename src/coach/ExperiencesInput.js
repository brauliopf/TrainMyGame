import React from 'react'

export default function ExperienceInput({ experiences, setExperiences }) {

  const formInput = (index, name, type, label, required) => {
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
          onChange={e => {
            setExperiences(experiences().map((xp, i) => {
              if (i === index) { // replace value of {e.target.name} parameter
                const reducer = (object, [key, value]) => {
                  object[key] = (key === e.target.name) ? e.target.value : value
                  return object
                }
                const newXp = Object.entries(xp).reduce(reducer, {});
                return newXp
              }
              else { // repeat xp
                return xp;
              }
            }))
          }}
          required={required || false}
        />
      </div>)
  }

  const changeExperienceType = (target, xps) => {
    const index = target.id.split("_")[1];
    setExperiences(xps.map((xp, i) => {
      return (i === parseInt(index) ? { ...xp, type: target.value } : xp)
    }))
  }

  return (
    <div>
      {experiences().map((experience, index) => (
        <div key={index} className="col-12 p-2 mt-2 border bg-light">
          <div className="xp-type">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input" type="radio"
                name={`xpTypeOptions_${index}`} id={`highSchool_${index}`} value="highSchool"
                onClick={e => changeExperienceType(e.target, experiences())}
                defaultChecked={experience.type === "highSchool"} />
              <label className="form-check-label" htmlFor={`highSchool_${index}`} name={`xpTypeOptions_${index}`}>High School</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input" type="radio"
                name={`xpTypeOptions_${index}`} id={`college_${index}`} value="college"
                onClick={e => changeExperienceType(e.target, experiences())}
                defaultChecked={experience.type === "college"} />
              <label className="form-check-label" htmlFor={`college_${index}`} name={`xpTypeOptions_${index}`}>College</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input" type="radio"
                name={`xpTypeOptions_${index}`} id={`pro_${index}`} value="pro"
                onClick={e => changeExperienceType(e.target, experiences())}
                defaultChecked={experience.type === "pro"} />
              <label className="form-check-label" htmlFor={`pro_${index}`} name={`xpTypeOptions_${index}`}>Professional</label>
            </div>
          </div>
          <div className="xp-details">
            {["college", "highSchool"].includes(experience.type) ?
              <div className="my-2 complement-college-hs">
                <div className="form-row">
                  <div className="col-12 col-lg-6">
                    {formInput(index, "division", "text", "Division")}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "conference", "text", "Conference")}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "varsity", "number", "# Varsity seasons")}
                  </div>
                  <div className="col-12 col-lg-6">
                    {formInput(index, "class", "number", "Class of #")}
                  </div>
                </div>
              </div>
              :
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
