import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from './SearchFilters'
import ListingItem from './ListingItem'
import axios from 'axios';

export default function Search() {

  const [filters, setFilters] = useState({});
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState({});

  // Effects
  useEffect(() => {
    axios.get(`/api/v1/coaches${filterQuerify(filters)}`).then(res => setCoaches(res.data.coaches))
    axios.get(`/api/v1/sessions${filterQuerify(filters)}`).then(res => { setSessions(res.data.sessions) })
  }, [filters]);

  // Auxiliar
  const filterQuerify = (filters) => {
    return Object.keys(filters).reduce((final, filterItem) => {
      if (filters[filterItem] && filters[filterItem].length) {
        final = final + filterItem + "=" + filters[filterItem].join() + "&"
      }
      return final
    }, "?")
  };

  const removeFilter = (e) => {
    console.log("removerFilter", e.target)
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
                filter[1].map(f => <div className="border p-2 mr-1 btn btn-light" id={f} key={f} name={filter[0]} onClick={(e) => removeFilter(e)}>{f} <i className="fas fa-times" id={f} name={filter[0]} /></div>)
            })}
          </div>

        </div>}

      <div className="row d-flex justify-content-around" id="listing">
        {coaches.length ? coaches.map(coach => <ListingItem coach={coach} sessions={sessions[coach._id] || {}} />) :
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