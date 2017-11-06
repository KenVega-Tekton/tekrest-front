import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class CrearUsuario extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      session: session.rol,
      email: '',
      nombre: '',
      password: '',
      rol: 'default',
      formErrors: { email: '', nombre: '', password: '', rol: '' },
      emailValid: false,
      nombreValid: false,
      passwordValid: false,
      rolValid: false,
      formValid: false
    };

    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {}

  handleAuthorization() {
    const rol = this.state.session;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Admin') return this.props.history.push('/dashboard');
    if (rol === 'Chef') return this.props.history.push('/ordenes');
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
    let nombreValid = this.state.nombreValid;
    let rolValid = this.state.rolValid;
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
      case 'nombre':
        nombreValid = value ? true : false;
        fieldValidationErrors.nombre = nombreValid
          ? ''
          : ' Campo Nombre requerido.';
        break;
      case 'rol':
        rolValid = value === 'Admin' || value === 'Cajero' || value === 'Chef';
        fieldValidationErrors.rol = rolValid ? '' : ' Debe elejir un rol.';
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
        passwordValid,
        nombreValid,
        rolValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.nombreValid &&
        this.state.rolValid &&
        this.state.passwordValid
    });
  }
  onSubmit(e) {
    e.preventDefault();

    axios
      .post('/signup', this.state)
      .then(res => {
        alert('Usuario creado con exito!');
        this.props.history.push('/usuarios');
      })
      .catch(err => {
        if (err.response) {
          alert(err.response.mensaje);
        }
        console.log(err);
      });
  }

  render() {
    if (this.state.session !== 'Admin') {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4 col-md-offset-4">
          <form onSubmit={this.onSubmit}>
            {(() => {
              if (this.state.serverError) {
                return (
                  <span className="error">
                    {this.state.serverError.mensaje}
                  </span>
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
              <label htmlFor="nombre" className="control-label">
                Nombre
              </label>
              <input
                value={this.state.nombre}
                onChange={this.onChange}
                type="text"
                name="nombre"
                className="form-control"
              />
              {(() => {
                if (!this.state.nombreValid) {
                  return (
                    <span className="error">
                      {this.state.formErrors.nombre}
                    </span>
                  );
                }
              })()}
            </div>
            <div className="form-group">
              <label htmlFor="rol" className="control-label">
                Rol
              </label>
              <select
                className="form-control"
                name="rol"
                onChange={this.onChange}
                value={this.state.rol}
              >
                <option value="default" disabled>
                  Elije rol de usuario.
                </option>
                <option value="Admin">Admin</option>
                <option value="Cajero">Cajero</option>
                <option value="Chef">Chef</option>
              </select>
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
                    <span className="error">
                      {this.state.formErrors.password}
                    </span>
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
        </div>
      </div>
    );
  }
}

export default CrearUsuario;
