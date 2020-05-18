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
          <h3 className="">Train My Game</h3>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          </div>
          <div className="mt-2">
            <span className="font-weight-bold">Why do we use it?</span><br></br>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
            </div>
          <img src={img_lacrosse_session} className="my-4 mx-auto d-block rounded" alt="..." />
          <div className="mt-2">
            <span className="font-weight-bold">What else do I need to know?</span><br></br>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col mx-auto my-4 d-flex flex-column align-items-center">

          <div className="card w-75">
            <img src={img_lacrosse_player} className="card-img rounded" alt="..." />

            <div className="card-body">
              <h5 className="card-title">Looking to train?</h5>
              <p className="card-text">Get access to vetted coaches based on location and activity.</p>
              <div>
                {state.auth.isAuthenticated ?
                  <Link to="/coaches" className="btn btn-primary align-items-center">Find coaches near you</Link> :
                  <Link to="#" className="btn btn-primary align-items-center" onClick={() => dispatch({ type: 'MODAL_ON', component: 'authModal' })}>Register today</Link>}
              </div>
            </div>
          </div>

          {(!user || !user.athlete || (user.athlete && user.athlete.type !== "coach")) &&
            <div className="card w-75 mt-4">
              <img src={img_lacrosse_coach} className="card-img-top rounded" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Think you're a qualified coach?</h5>
                <p className="card-text">Come coach us!</p>
                <Link to="/coach/apply" className="btn btn-primary">Apply here</Link>
              </div>
            </div>}

        </div>
      </div>
    </div >
  )
}