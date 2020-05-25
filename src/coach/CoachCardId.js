import React from 'react'
import Ratings from './Ratings';

export default function CoachCardId({ coach, detail }) {
  // { coach, detail: {ratings, instagram} }

  if (!detail) {
    return (
      <div>
        <img className="rounded-circle img-thumbnail" id="profile_picture"
          src={coach.picture} alt={coach.name} style={{ maxWidth: "100px", maxHeight: "100px" }} />
        <div className="h6 mt-2">{coach.name}</div>
      </div>
    )
  } else {
    return (
      <div className="d-flex flex-row justify-content-center">
        <img className="rounded-circle img-thumbnail" id="profile_picture"
          src={coach.picture} alt={coach.name} style={{ maxWidth: "120px", maxHeight: "120px" }} />
        <div className="d-flex flex-column justify-content-between my-2">
          <div className="text-right">
            <h5>{coach.name}</h5>
            {detail && detail.ratings && <Ratings rating={coach.athlete ? coach.athlete.rating : 4} />}
            {detail && detail.instagram && (
              coach.connectedAccounts && coach.connectedAccounts.instagram ?
                <div>
                  <i className="fab fa-instagram mt-1" /> @{coach.connectedAccounts.instagram.username}
                </div> :
                <div><i className="fab fa-instagram mt-1" /> @trainmygame</div>
            )}
          </div>
        </div>
      </div>
    )
  }
}