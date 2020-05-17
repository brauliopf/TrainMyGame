import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Select from 'react-select';
import { positions } from '../util/input';

export default function AuthModal() {

  const initialState = { name: '', email: '', password: '', token: '', gender: '', position: '', experience: '', dob: '', formRegister: true }
  const { dispatch } = useContext(Context);
  const [data, setData] = useState(initialState);
  const [user, setUser] = useState({});
  const options = positions.map(p => ({ value: p, label: p, key: p }));

  // Effect
  useEffect(() => {
    if (user && user.data && !user.error) {
      dispatch({ type: data.formRegister ? 'REGISTER' : 'LOGIN', data: user.data });
      setData(initialState);
      dispatch({ type: 'MODAL_OFF', component: "authModal" });
    }
    if (user && user.error) {
    }
  }, [user])

  // Auxiliary
  const authenticate = data => {
    const reducer = (accumulator, currentValue) => accumulator.concat(currentValue['value']);
    if (data.formRegister) data.position = data.position.reduce(reducer, [])
    axios.post(data.formRegister ? "/api/v1/users" : "/api/v1/users/login", data)
      .then(user => setUser(user))
  }

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
              <form className="mt-4" onSubmit={e => { e.preventDefault(); authenticate(data); }}>
                {data.formRegister &&
                  <div className="">
                    <label htmlFor="name">Name*</label>
                    <input
                      label="Name"
                      type="name"
                      name="name"
                      className='form-control'
                      value={data.name}
                      onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                    />
                  </div>}
                <div className="mt-2">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    name="email"
                    className='form-control'
                    value={data.email}
                    onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="password">Password*</label>
                  <input
                    type="password"
                    name="password"
                    className='form-control'
                    value={data.password}
                    onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                    required
                  />
                </div>

                {data.formRegister &&
                  <div className="row mt-2 d-flex justify-content-between">
                    <div className="col-6">
                      <label htmlFor="experience">Experience*</label>
                      <input
                        type="number"
                        name="experience"
                        className='form-control'
                        value={data.experience}
                        onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
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
                    <div className="col-12 my-2">
                      <label htmlFor="position">Position</label>
                      <Select
                        value={data.position}
                        onChange={option => { setData({ ...data, position: option }) }}
                        options={options}
                        isMulti={true}
                      />
                    </div>
                    <div className="col-12 my-2">
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        className='form-control'
                        value={data.dob}
                        onChange={e => setData({ ...data, [e.target.name]: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                }

                <div className="pt-3 text-center">
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