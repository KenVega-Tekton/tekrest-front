import React, { Component } from 'react';

import Caja from './Caja';
import Reporte from './Reporte';

class DashboardPage extends Component {
  constructor() {
    super();

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol
    };
  }

  componentWillMount() {
    this.handleAuthorization();
  }

  handleAuthorization() {
    const { rol } = this.state;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Cajero') return this.props.history.push('/ordenar');
    if (rol === 'Chef') return this.props.history.push('/ordenes');
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Dashboard</h1>
          <div className="row">
            <Caja />
          </div>
          <div className="row">
            <Reporte />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardPage;
