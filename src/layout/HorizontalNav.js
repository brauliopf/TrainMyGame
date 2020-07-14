import React, { useContext } from 'react';
import { Context } from '../Contexts'
import { Link } from 'react-router-dom';
import $ from 'jquery'
import { s3Config } from '../util/s3';
// import img_logo from '../resources/logo.png';
import Radium from 'radium';
import style from '../styles/Home__Style.js';

const HorizontalNav = (props) => {

  // load creative
  const img_logo = `${s3Config.bucketURL}/app/layout/logo.jpg`;
  const { state, dispatch } = useContext(Context);

  console.log(s3Config.bucketURL);

  const getUserName = () => {
    let name = state.auth.user.name
    name = name.split(' ').length > 1 ? state.auth.user.name.split(' ')[0] + ' ' + state.auth.user.name.split(' ')[1][0] + '.'
      : name
    return name
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top" >

      <div className="container">

        {/* Logo */}
        <Link to="/" className="navbar-brand text-ligth  text-uppercase" onClick={() => $("#navBarNav").collapse('hide')}>
          <img src={img_logo} style={style.logo} alt="..." />
        </Link>

        {/* Sandwich button */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navBarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu items */}
        <div className="collapse navbar-collapse justify-content-end" id="navBarNav">
          <ul className="navbar-nav" data-toggle="collapse" data-target="#navBarNav">
            <li className="nav-item">
              <Link to="/coaches" className="nav-link">
                <i className="fas fa-search" /> Find coaches
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                <i className="fas fa-cat" /> About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/faq" className="nav-link">
                <i className="fas fa-question" /> FAQ
              </Link>
            </li>

            {state.auth.isAuthenticated &&
              <li className="nav-item">
                <Link to="/inbox" className="nav-link">
                  <i className="fas fa-inbox" /> Inbox
              </Link>
              </li>}

            {state.auth.isAuthenticated ?
              <li className="nav-item dropdown bg-dark">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#" id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onMouseOver={() => $("#navbarDropdown").css("color", "rgba(255,255,255,.75)")}
                  onMouseOut={() => $("#navbarDropdown").css("color", "rgba(255,255,255,.5)")}>
                  <span><i className="fas fa-heart" /> {getUserName()}</span>
                </Link>
                <div className="dropdown-menu text-light bg-dark border-0" aria-labelledby="navbarDropdown">
                  {state.auth.user.role === "admin" &&
                    <div>
                      <Link
                        to="/admin"
                        className="nav-link dropdown-item"
                        id="admin-dropdown-item"
                        onMouseOver={() => $("#admin-dropdown-item").css("color", "rgba(255,255,255,.75)")}
                        onMouseOut={() => $("#admin-dropdown-item").css("color", "rgba(255,255,255,.5)")}
                        style={{ color: "rgba(255,255,255,.5)", backgroundColor: "transparent" }}>
                        <i className="fas fa-user-cog" /> Admin</Link>
                      <div className="dropdown-divider"></div>
                    </div>}
                  <Link
                    to="/profile"
                    className="nav-link dropdown-item"
                    id="profile-dropdown-item"
                    onMouseOver={() => $("#profile-dropdown-item").css("color", "rgba(255,255,255,.75)")}
                    onMouseOut={() => $("#profile-dropdown-item").css("color", "rgba(255,255,255,.5)")}
                    style={{ color: "rgba(255,255,255,.5)", backgroundColor: "transparent" }}>
                    <i className="fas fa-address-card" /> Profile</Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="#"
                    className="nav-link dropdown-item"
                    id="signout-dropdown-item"
                    onMouseOver={() => $("#signout-dropdown-item").css("color", "rgba(255,255,255,.75)")}
                    onMouseOut={() => $("#signout-dropdown-item").css("color", "rgba(255,255,255,.5)")}
                    onClick={() => { dispatch({ type: "LOGOUT" }); }}
                    style={{ color: "rgba(255,255,255,.5)", backgroundColor: "transparent" }}>
                    <i className="fas fa-door-open" /> Sign-out</Link>
                </div>
              </li> :
              <li className="nav-item" data-toggle="collapse" data-target="#navBarNav">
                <div className="input-group-append">
                  <button type="button" className="btn nav-link mt-0" onClick={() => dispatch({ type: 'MODAL_ON', component: 'authModal' })} >
                    <i className="fas fa-address-card" /> Sign-in
              </button>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav >
  );
}

export default Radium(HorizontalNav);