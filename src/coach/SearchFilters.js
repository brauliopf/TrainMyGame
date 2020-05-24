import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../Contexts'

export default function SearchFilter(props) {

  const { state, } = useContext(Context);
  const user = state.auth.user || ""
  const [text, setText] = useState(props.filters.text || []);
  const [gender, setGender] = useState(props.filters.gender || []);
  const [position, setPosition] = useState(props.filters.position || []);
  const [dateFrom, setDateFrom] = useState(props.filters.dateFrom || []);
  const [dateTo, setDateTo] = useState(props.filters.dateTo || []);
  const [distanceRange, setDistanceRange] = useState(props.filters.distanceRange || []);

  const options = {
    gender: ['male', 'female'],
    position: ['F/O', 'Goalie', 'Mid', 'Att', 'Def', 'LSM/SSDM'],
    distanceRange: [0, 3, 5, 10, 20],
    // open: true / false
  }

  useEffect(() => {
    text !== props.filters.text && setText(props.filters.text || []);
    gender !== props.filters.gender && setGender(props.filters.gender || []);
    position !== props.filters.position && setPosition(props.filters.position || []);
    dateTo !== props.filters.dateTo && setDateTo(props.filters.dateTo || []);
    dateFrom !== props.filters.dateFrom && setDateFrom(props.filters.dateFrom || []);
    distanceRange !== props.filters.distanceRange && setDistanceRange(props.filters.distanceRange || []);
  }, [props.filters])

  const locationRangeInput = () => {
    return (
      <div className="my-2 d-flex flex-row justify-content-between">
        <div className="row">
          <div className="my-auto col-9 font-weight-bold">Distance range (less than)</div>
          <select
            className="col w-100 browser-default custom-select"
            value={distanceRange[0] || ""}
            defaultValue={distanceRange[0]}
            name="distanceRange"
            onChange={e => { e.target.value === "0" ? setDistanceRange([]) : setDistanceRange([e.target.value]) }}
            id="select-range"
            disabled={!(user && user.location)}
          >
            {options.distanceRange.map(range => (
              <option value={range} key={range}>{range === 0 ? "-" : `${range}km`}</option>
            ))}
          </select>
        </div >
      </div>)
  }

  const updateFilters = () => {
    const newFilters = { text, gender, position, dateFrom, dateTo, distanceRange }
    return props.setFilters(newFilters);
  }

  const clearFilters = () => {
    setText([]); setGender([]); setPosition([]);
    setDateFrom([]); setDateTo([]); setDistanceRange([]);
    props.setFilters({})
  }

  return (
    <div className="modal fade" id="coachFilterModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Filters</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="my-2">
              <p><strong>Text (name, city)</strong></p>
              <input
                type="text"
                name="textSearch"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                value={text || ""}
                pattern="[^'\x22]+"
                onChange={e => setText(e.target.value === "" ? [] : [e.target.value])}
              />
            </div>
            <div id="gender">
              <p><strong>Gender</strong></p>
              {options.gender.map(gndr =>
                <div className="checkbox" key={gndr}>
                  <label>
                    <input type="checkbox" name={gndr}
                      checked={gender && gender.includes(gndr) ? true : false}
                      onChange={() => gender && gender.includes(gndr) ?
                        setGender(gender.filter((g) => g !== gndr)) // remove
                        : setGender(gender.concat(gndr))} // add
                    /> {gndr === 'male' ? "Men's Lacrosse" : "Women's Lacrosse"}
                  </label>
                </div>
              )}
            </div>
            <div id="position">
              <p><strong>Position</strong></p>
              {options.position.map(pos =>
                <div className="checkbox" key={pos}>
                  <label>
                    <input type="checkbox" value="" name={pos}
                      checked={position && position.includes(pos) ? true : false}
                      onChange={position && position.includes(pos) ?
                        e => setPosition(position.filter((p) => p !== pos)) // remove
                        : e => setPosition(position.concat(pos))} // add
                    /> {pos}
                  </label>
                </div>
              )}
            </div>

            <div className="distanceRange">
              {locationRangeInput()}
            </div>

            <div id="timeframe">
              <p className="font-weight-bold">Session Date</p>
              <div className="form-row">
                <div className="col-12 col-md-6">
                  <label className="mr-1">From: </label><input type="date" name="dateFrom" value={dateFrom} onChange={e => { if (e.target.value !== "") setDateFrom([e.target.value]) }} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="mr-1">To: </label><input type="date" name="dateTo" value={dateTo} onChange={e => { if (e.target.value !== "") setDateTo([e.target.value]) }} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => updateFilters()}>Save changes</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { clearFilters() }}>Clear filters</button>
          </div>
        </div>
      </div>
    </div >
  )
}