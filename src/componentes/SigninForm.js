import React, { Component } from 'react';

class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Iniciar Sesion</h1>
        <div className="form-group">
          <label htmlFor="email" className="control-label">
            Email
          </label>
          <input
            value={this.state.username}
            onChange={this.onChange}
            type="text"
            name="email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-lg">Entrar</button>
        </div>
      </form>
    );
  }
}
export default SigninForm;
