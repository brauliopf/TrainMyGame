import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import SearchFilter from './SearchFilters'
import ListingItem from './ListingItem'
import axios from 'axios';
import getDistance from 'geolib/es/getDistance';

export default function Search() {

  const { state, } = useContext(Context);
  const user = state.auth.user || ""
  const [filters, setFilters] = useState({});
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState({});

  // Effects
  useEffect(() => {
    axios.get(`/api/v1/coaches${filterQuerify(filters)}`).then(res => setCoaches(res.data.coaches))
    axios.get(`/api/v1/sessions${filterQuerify(filters)}`).then(res => {
      let querySessions = res.data.sessions;
      if (!filters.distanceRange || filters.distanceRange.length === 0) setSessions(querySessions)
      else {
        populateSessionDistance(querySessions).then((populated) => {
          console.log("querySessions", populated)
          setSessions(populated)
        })
      }
    })
  }, [filters]);

  // Auxiliar
  const populateSessionDistance = async querySessions => {
    if (!user || (user.location && !user.location.geo)) return querySessions;

    let populatedSessions = querySessions
    const reducer = (allSessions, coachSessions) => { // coachSessions = { coach_id: [{session}] }
      if (!allSessions[`${coachSessions[0]}`]) allSessions[`${coachSessions[0]}`] = [];
      const populatedCoachSessions = coachSessions[1].map(session => {
        session.distance = calculateDistance(session.location.geo);
        const withinRange = session.distance <= parseInt(filters.distanceRange[0]) * 1000
        return withinRange ? session : undefined;
      }).filter((obj) => obj); // required to "clean" array from null objects
      allSessions[`${coachSessions[0]}`] = allSessions[`${coachSessions[0]}`].concat(populatedCoachSessions)
      return allSessions;
    }
    populatedSessions = await Object.entries(querySessions).reduce(reducer, {});
    console.log("populateSessionDistance", filters, populatedSessions)

    return populatedSessions;

  }

  const calculateDistance = ({ lat, lng }) => {
    const userLocation = { lat: user.location.geo.lat, lng: user.location.geo.lng }
    const d = getDistance({ latitude: lat, longitude: lng }, { latitude: userLocation.lat, longitude: userLocation.lng })
    return d;
  }

  const filterQuerify = (filters) => {
    return Object.keys(filters).reduce((final, filterItem) => {
      if (filters[filterItem] && filters[filterItem].length) {
        final = final + filterItem + "=" + filters[filterItem].join() + "&"
      }
      return final
    }, "?")
  };

  const removeFilter = (e) => {
    let newFilters = {}
    const value = e.target.getAttribute("id")
    const type = e.target.getAttribute("name")
    newFilters[type] = filters[type] && filters[type].filter(f => f !== value)
    setFilters({ ...filters, ...newFilters })
  }

  const hasActiveFilter = () => {
    const reducer = (status, filter) => status && (filter === undefined || filter.length === 0);
    return !Object.values(filters).reduce(reducer, true);
  }

  // console.log("search", filters)
  return (
    <div id='search'>
      <SearchFilter setFilters={setFilters} filters={filters} />

      <div className="row">
        <div className="col-12 d-flex justify-content-between">
          <p className="h3">Coaches</p>
          <div className="my-auto" type="button" data-toggle="modal" data-target="#coachFilterModal">
            <i className="fas fa-sliders-h" /> Filters
        </div>
        </div>
      </div>

      {hasActiveFilter() &&
        <div className="row">
          <div className="col mx-auto" id="activeFilters">
            {Object.entries(filters).map(filter => {
              return (filter[1] === undefined || filter[1].length === 0) ? "" :
                filter[1].map(f => {
                  let label = ""
                  switch (filter[0]) {
                    case "distanceRange": label = `< ${f}km`; break;
                    case "dateFrom": label = `from: ${f}`; break;
                    case "dateTo": label = `to: ${f}`; break;
                    case "gender": label = (f === "female" ? "Women's Lacrosse" : "Men's Lacrosse"); break;
                    default: label = f
                  }
                  return (
                    <div className="border p-2 mr-1 btn btn-light" id={f} key={f} name={filter[0]} onClick={(e) => removeFilter(e)}>
                      {label} <i className="fas fa-times" id={f} name={filter[0]} />
                    </div>)
                })
            })}
          </div>

        </div>}

      <div className="row d-flex justify-content-around" id="listing">
        {coaches.length ? coaches.map(coach => <ListingItem coach={coach} sessions={sessions[coach._id] || {}} key={coach._id} />) :
          <div className="col-12"><p className="text-center font-weight-bold text-dark mt-4">No Results Found</p>
            <p className="text-center">None of our coaches match these criteria.
                Try broadening the search criteria and <Link to="#" className="font-weight-bold text-dark" data-toggle="modal" data-target="#coachFilterModal">searching again.</Link>
            </p>
          </div>
        }
      </div >
    </div>
  )
}