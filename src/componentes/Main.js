import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import SigninPage from './SigninPage';
import Ordenes from './Ordenes';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={SigninPage} />
      <Route path="/ordenes" component={Ordenes} />
    </Switch>
  </main>
);

export default Main;
