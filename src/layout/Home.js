import React, { useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import { s3Config } from '../util/s3';
import { isMobile } from "react-device-detect";

// https://getbootstrap.com/docs/4.0/layout/grid/
// https://getbootstrap.com/docs/4.0/utilities/spacing/ –– {property}{sides}-{breakpoint}-{size}
export default function Home() {

  const img_lacrosse_coach = `${s3Config.bucketURL}/app/content/lacrosse_coach.jpg`;
  const img_lacrosse_player = `${s3Config.bucketURL}/app/content/lacrosse_player.jpg`;
  const img_lacrosse_session = `${s3Config.bucketURL}/app/content/lacrosse_session.jpg`;

  const { state, dispatch } = useContext(Context);
  const user = state.auth.isAuthenticated ? state.auth.user : false

  const styles = {
    mobileAlignText: {
      textAlign: 'center'
    }
  }

  return (
    <div id='home'>

      <div className="row">

        {/* LEFT COLUMN */}
        <div className="col-12 col-md-6 my-2" id="institutional" style={isMobile ? styles.mobileAlignText : {}}>
          <img style={{width: '100%', height: 'auto'}} src={img_lacrosse_session} className="my-4 mx-auto d-block rounded" alt="..." />
          <div style={{paddingLeft: '1.25em', paddingRight: '1.25em'}}>
            <span className="font-weight-bold">What is TrainMyGame?</span><br></br>
              TrainMyGame is an online platform for connecting athletes to elite coaches. Click 'find coaches' to go to the search page and find sessions!
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={`col-12 col-md-6 mx-auto my-2 flex-column ${ isMobile ? "align-items-center" : "align-items-left" }`}>

          <div className="card-body" style={isMobile ? styles.mobileAlignText : {}}>
            <h5 className="card-title">Looking to train?</h5>
            <p className="card-text">Get access to high quality, pre-vetted coaches based on their location and existing training sessions.</p>
            <div>
              {state.auth.isAuthenticated ?
                <Link to="/coaches" className="btn btn-primary align-items-center">Find coaches near you</Link> :
                <Link to="#" className="btn btn-primary align-items-center" onClick={() => dispatch({ type: 'MODAL_ON', component: 'authModal' })}>Register today</Link>}
            </div>
          </div>

          {(!user || !user.athlete || (user.athlete && user.athlete.type !== "coach")) &&
            <div className={"card-body"} style={isMobile ? styles.mobileAlignText : {}}>
              <h5 className="card-title">Think you're a qualified coach?</h5>
              <p className="card-text">Email us at <b>trainmygame3@gmail.com</b></p>
              <Link to="/coach/apply" className="btn btn-primary">Apply here</Link>
            </div>
            }

            <div>
              <a href="https://connect.stripe.com/express/oauth/authorize?client_id=ca_HrehXouvjTAHHG1gRAGdZKuEfCUZO23z&state=test_state_token_12398127&suggested_capabilities[]=transfers&stripe_user[email]=user@example.com"></a>
            </div>

        </div>
      </div>
    </div >
  )
}