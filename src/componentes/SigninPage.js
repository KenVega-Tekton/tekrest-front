import React, { Component } from 'react';

import SigninForm from './SigninForm';

class SigninPage extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SigninForm />
        </div>
      </div>
    );
  }
}

export default SigninPage;
