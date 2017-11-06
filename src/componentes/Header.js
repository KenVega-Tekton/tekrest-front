import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol
    };
  }
  componentWillMount() {
    this.renderMenuIten();
  }

  handleLogOut() {
    sessionStorage.clear();
    this.renderMenuIten();
  }

  renderMenuIten() {
    if (this.state.rol) {
      if (this.state.rol === 'Admin') {
        return (
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/ordenes">Ordenes</Link>
            </li>
            <li>
              <Link to="/usuarios">Usuarios</Link>
            </li>
            <li>
              <Link to="/plato">Agregar Plato</Link>
            </li>
            {this.renderLoginButton(true)}
          </ul>
        );
      }
      if (this.state.rol === 'Chef' || this.state.rol === 'Cajero') {
        return (
          <ul className="nav navbar-nav navbar-right">
            {this.renderLoginButton(true)}
          </ul>
        );
      }
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          {this.renderLoginButton(false)}
        </ul>
      );
    }
  }
  renderLoginButton(session) {
    if (!session) {
      return (
        <li>
          <Link to="/signin">Inicia Sesion</Link>
        </li>
      );
    } else {
      return (
        <li>
          <Link to="/" onClick={this.handleLogOut}>
            Salir
          </Link>
        </li>
      );
    }
  }

  render() {
    return (
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link to="/" className="navbar-brand">
              TekRest
            </Link>
          </div>

          <div className="collapse navbar-collapse" id="navbar-collapse">
            {this.renderMenuIten()}
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
