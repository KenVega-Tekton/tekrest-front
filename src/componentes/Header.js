import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">
              TekRest
            </a>
          </div>

          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/signin">Inicia Sesion</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
