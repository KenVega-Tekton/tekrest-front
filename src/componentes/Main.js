import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect, withRouter } from 'react-router-dom';

import Home from './Home';
import SigninPage from './SigninPage';
import DashboardPage from './DashboardPage';
import Ordenes from './Ordenes';
import Orden from './Orden';
import Ordenar from './Ordenar';
import Plato from './Plato';
import Usuarios from './Usuarios';
import CrearUsuario from './CrearUsuario';
import Usuario from './Usuario';

class Main extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : false;

    this.state = {
      session
    };
  }
  isAuth() {
    if (!this.state.session) {
      return <Redirect to="/signin" />;
    }
  }

  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/registro" component={CrearUsuario} />
          <Route
            path="/dashboard"
            component={DashboardPage}
            onEnter={this.isAuth()}
          />
          <Route path="/ordenes" component={Ordenes} onEnter={this.isAuth()} />
          <Route path="/orden/:id" component={Orden} onEnter={this.isAuth()} />
          <Route path="/ordenar" component={Ordenar} onEnter={this.isAuth()} />
          <Route path="/plato" component={Plato} onEnter={this.isAuth()} />
          <Route
            path="/usuarios"
            component={Usuarios}
            onEnter={this.isAuth()}
          />
          <Route
            path="/usuario/:id"
            component={Usuario}
            onEnter={this.isAuth()}
          />
        </Switch>
      </main>
    );
  }
}

export default withRouter(Main);
