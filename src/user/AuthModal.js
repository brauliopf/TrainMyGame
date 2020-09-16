import React, { useState, useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Select from 'react-select';
import { positions } from '../util/input';
import { s3Config } from '../util/s3';
import classnames from 'classnames'
import $ from "jquery";
import styles from '../styles/Global'

export default function AuthModal() {

  const { dispatch } = useContext(Context);
  const [data, setData] = useState({ formRegister: true });
  const [errors, setErrors] = useState({ inputs: [], message: "" })
  const options = positions.map(p => ({ value: p, label: p, key: p }));
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Auxiliary
  const validateConfPassword = () => {
    const getPasswordFieldVal = (inputFieldName) => {
      return $('#registration-form').find(`input[name=${inputFieldName}]`).val()
    }
    if (!(getPasswordFieldVal('password') === getPasswordFieldVal('confirmPassword'))) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }

  const authenticate = (user) => {
    // Set register payload
    if (user.formRegister) {
      const reducer = (accumulator, currentValue) => accumulator.concat(currentValue['value']);
      user = { ...user, picture: getRandomAvatar(), position: user.position.reduce(reducer, []) }
    }

    // Execute register or login
    axios.post(data.formRegister ? "/api/v1/users" : "/api/v1/users/login", user)
      .then(res => {
        if (res && res.data && !res.error) {
          dispatch({ type: data.formRegister ? 'REGISTER' : 'LOGIN', data: res.data });
          setData({});
          dispatch({ type: 'MODAL_OFF', component: "authModal" });
        }
      })
      .catch(err => { handleSubmitError(err); })
  }
  const handleSubmitError = err => {
    // err = {data: {…}, status: ###, statusText: "XXX", headers: {…}, config: {…}, …}
    if (data.formRegister) {
      if (err.response.data.error === "DUPLICATED_EMAIL") {
        return setErrors({ inputs: errors.inputs.concat(["email"]), message: "" })
      }
    }
    else {
      if (err.response.data.error === "USER_NOT_FOUND") {
        setErrors({ inputs: errors.inputs, message: "We could not find an account associated with this email address. Please try again." })
      }
      else if (err.response.data.error === "INVALID_CREDENTIALS") {
        setErrors({ inputs: errors.inputs, message: "We don't recognize this email/password combination, please correct it and try again." })
      }
    }
  }
  const formInput = (name, type, label, required, pattern, invalidFeedback) => {
    return (<div>
      <label htmlFor={name}>{label}{required ? "*" : ""}</label>
      <input
        label={label}
        type={type}
        name={name}
        className={classnames('form-control', { 'is-invalid': errors.inputs && errors.inputs.includes(name) })}
        value={data[name] || ""}
        pattern={pattern || undefined}
        required={required}
        onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
      />
      <div className="invalid-feedback">
        <b>Let's try again. </b>{invalidFeedback ? invalidFeedback : "The value provided is not valid."}
      </div>
    </div>
    )
  }

  const getRandomAvatar = () => `${s3Config.bucketURL}/avatar/default/${`0${Math.floor(Math.random() * Math.floor(4)) + 1}.png`}`;

  return (
    <div className="modal fade" id="authModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div>
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="title">{data.formRegister ? "Register" : "Sign In"}</h4>
              <form className="mt-4" onSubmit={e => { e.preventDefault(); authenticate(data); }} id="registration-form">
                {data.formRegister &&
                  <div className=""> {/* INPUT: name */}
                    {formInput("name", "text", "Name", true, "", "Name must be provided")}
                  </div>}
                <div className="mt-2"> {/* INPUT: email */}
                  {formInput("email", "email", "Email", true, "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$", "This email is already taken. Is that you? Please sign-in.")}
                </div>
                { passwordMismatch && data.formRegister &&
                <p className="col-12" style={styles.tmgInputError}>*Passwords must match.</p>
                }
                <div className="mt-2">
                  {formInput("password", "password", "Password", true, ".{4,}", "Four or more characters")}
                </div>
                {
                  data.formRegister &&
                  <div className="mt-2">
                    <input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      onBlur={e => validateConfPassword()}
                      className={classnames('form-control', { 'is-invalid': errors.inputs && errors.inputs.includes('confirmPassword') })}
                      required={true}
                    />
                  </div>
                }

                {data.formRegister &&
                  <div className="row mt-2 d-flex form-row justify-content-between">
                    <div className="col-6"> {/* INPUT: player experience */}
                      {formInput("experience", "number", "Player Experience", false)}
                    </div>
                    <div className="col-6"> {/* INPUT: gender */}
                      <label htmlFor="gender">Gender*</label>
                      <select
                        className="browser-default custom-select"
                        defaultValue=""
                        name="gender"
                        onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                        required
                      >
                        <option value="" disabled></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="col-12 my-2"> {/* INPUT: position */}
                      <label htmlFor="position">Position</label>
                      <Select
                        value={data.position}
                        onChange={option => { setData({ ...data, position: option }) }}
                        options={options}
                        isMulti={true}
                      />
                    </div>
                    <div className="col-12 my-2"> {/* INPUT: dob */}
                      {formInput("dob", "date", "Date of Birth", true)}
                    </div>
                  </div>
                }

                {errors && errors.message && <div className="text-center mt-3 py-2 border border-danger bg-light text-danger">
                  {errors.message}
                </div>}
                <div className="mt-2 text-center">
                  {data.formRegister ?
                    <input type="submit" value="Create account" className="btn btn-primary" />
                    :
                    <input type="submit" value="Sign-in" className="btn btn-primary" />
                  }
                </div>
              </form>
              <hr />
              <div className="text-center">
                {data.formRegister ?
                  <span className="p-2 mx-2">
                    Already have an account? <Link to="#" className="" onClick={() => setData({ ...data, formRegister: !data.formRegister })}>Sign-in</Link>
                  </span>
                  :
                  <span className="p-2 mx-2">
                    Need an account? <Link to="#" className="" onClick={() => setData({ ...data, formRegister: !data.formRegister })}>Register</Link>
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    </div>

  )
}