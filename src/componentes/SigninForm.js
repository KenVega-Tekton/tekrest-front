import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, withRouter } from 'react-router-dom';

import './App.css';

class SigninForm extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      email: '',
      password: '',
      rol: session.rol,
      emailValid: false,
      passwordValid: false,
      formValid: false,
      formErrors: { email: '', password: '' },
      serverError: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {}

  onSubmit(e) {
    e.preventDefault();
    axios
      .post('http://localhost:5000/signin', {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        sessionStorage.setItem('token', JSON.stringify(res.data));
        this.setState({ rol: true });
        window.location.reload();

        // this.props.history.push('/dashboard');
      })
      .catch(err => {
        if (!err.response) {
          return console.log(err);
        }
        this.setState({ serverError: err.response.data });
      });
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'email':
        if (!value) {
          fieldValidationErrors.email = 'Email incorrecto.';
          emailValid = false;
        }
        if (
          value.match(
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          )
        ) {
          let idx = value.lastIndexOf('@');
          emailValid = idx > -1 && value.slice(idx + 1).indexOf('tekton') > -1;
          if (!emailValid) {
            fieldValidationErrors.email = 'Email no pertenece a la empresa.';
          }
        } else {
          fieldValidationErrors.email = 'Email incorrecto.';
        }
        break;
      case 'password':
        passwordValid = value ? true : false;
        fieldValidationErrors.password = passwordValid
          ? ''
          : ' Campo Contraseña requerido.';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid,
        passwordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid
    });
  }

  render() {
    if (this.state.rol) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <form onSubmit={this.onSubmit}>
        {(() => {
          if (this.state.serverError) {
            return (
              <span className="error">{this.state.serverError.mensaje}</span>
            );
          }
        })()}
        <h1>Iniciar Sesion</h1>
        <div className="form-group">
          <label htmlFor="email" className="control-label">
            Email
          </label>
          <input
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            name="email"
            className="form-control"
          />
          {(() => {
            if (!this.state.emailValid) {
              return (
                <span className="error">{this.state.formErrors.email}</span>
              );
            }
          })()}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="control-label">
            Contraseña
          </label>
          <input
            value={this.state.password}
            onChange={this.onChange}
            type="password"
            name="password"
            className="form-control"
          />
          {(() => {
            if (!this.state.passwordValid) {
              return (
                <span className="error">{this.state.formErrors.password}</span>
              );
            }
          })()}
        </div>
        <div className="form-group">
          <button
            disabled={!this.state.formValid}
            className="btn btn-primary btn-lg"
          >
            Entrar
          </button>
        </div>
      </form>
    );
  }
}
export default withRouter(SigninForm);
