import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../Contexts'
import classnames from 'classnames'

export default function AlertBox() {

  const { state, dispatch } = useContext(Context);
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (state && state.alerts) setAlerts(state.alerts)
  }, [state])

  return (
    <div className="row">
      {alerts.length > 0 && alerts.map(alert => {
        return (<div className={classnames(`col-12 alert alert-dismissible fade show ${alert.type}`)} role="alert" key={Math.floor(Math.random() * Math.floor(1000)) + 1}>
          <strong>{alert.call || ""} </strong>{alert.text || ""}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>)
      }
      )}
    </div>
  )
}
