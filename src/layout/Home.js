import React, { useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import { s3Config } from '../util/s3';

// https://getbootstrap.com/docs/4.0/layout/grid/
// https://getbootstrap.com/docs/4.0/utilities/spacing/ –– {property}{sides}-{breakpoint}-{size}
export default function Home() {

  const img_lacrosse_coach = `${s3Config.bucketURL}/app/content/lacrosse_coach.jpg`;
  const img_lacrosse_player = `${s3Config.bucketURL}/app/content/lacrosse_player.jpg`;
  const img_lacrosse_session = `${s3Config.bucketURL}/app/content/lacrosse_session.jpg`;

  const { state, dispatch } = useContext(Context);
  const user = state.auth.isAuthenticated ? state.auth.user : false

  return (
    <div id='home'>

      <div className="row">

        {/* LEFT COLUMN */}
        <div className="col-12 col-md-6 mx-auto px-4" id="institutional">
          <img style={{width: '520px'}} src={img_lacrosse_session} className="my-4 mx-auto d-block rounded" alt="..." />
          <div className="mt-2">
            <span className="font-weight-bold">What is TrainMyGame?</span><br></br>
              TrainMyGame is an online platform for connecting athletes to elite coaches. Go to the search page to view available coaches and their sessions.
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col mx-auto my-4 d-flex flex-column align-items-left">

          <div style={{display: 'contents'}} className="card-body">
            <h5 className="card-title">Looking to train?</h5>
            <p className="card-text">Get access to vetted coaches based on location and activity.</p>
            <div>
              {state.auth.isAuthenticated ?
                <Link to="/coaches" className="btn btn-primary align-items-center">Find coaches near you</Link> :
                <Link to="#" className="btn btn-primary align-items-center" onClick={() => dispatch({ type: 'MODAL_ON', component: 'authModal' })}>Register today</Link>}
            </div>
          </div>

          {(!user || !user.athlete || (user.athlete && user.athlete.type !== "coach")) &&
            <div style={{display: 'contents'}}>
              <div style={{marginTop: '30px'}} >
                <h5 className="card-title">Think you're a qualified coach?</h5>
                <p className="card-text">Email us at <b>trainmygame3@gmail.com</b></p>
                {/*<Link to="/coach/apply" className="btn btn-primary">Apply here</Link>*/}
              </div>
            </div>
            }

        </div>
      </div>
    </div >
  )
}