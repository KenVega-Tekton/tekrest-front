import React, { Component } from 'react';

import SigninForm from './SigninForm';

class SigninPage extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-4 col-sm-offset-2 col-md-offset-4">
            <SigninForm />
          </div>
        </div>
      </div>
    );
  }
}

export default SigninPage;
