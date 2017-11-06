import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Usuario extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      email: '',
      nombre: '',
      rol: 'default',
      formErrors: { email: '', nombre: '', rol: '' },
      emailValid: false,
      nombreValid: false,
      rolValid: false,
      formValid: false,
      session: session.rol
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  fetchUsuario() {
    axios
      .get(`/api/usuarios/${this.props.match.params.id}`)
      .then(results => {
        this.setState({
          nombre: results.data.nombre,
          email: results.data.email,
          rol: results.data.rol,
          emailValid: true,
          nombreValid: true,
          rolValid: true,
          formValid: true
        });
      })
      .catch(error => console.log(error));
  }

  componentWillMount() {
    this.fetchUsuario();
  }

  handleAuthorization() {
    const rol = this.state.session;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Cajero') return this.props.history.push('/ordenar');
    if (rol === 'Chef') return this.props.history.push('/ordenes');
  }

  onSubmit(e) {
    e.preventDefault();
    axios
      .put(`/api/usuarios/${this.props.match.params.id}`, {
        rol: this.state.rol,
        email: this.state.email,
        nombre: this.state.nombre
      })
      .then(res => {
        alert(res.data.mensaje);
        this.props.history.push('/usuarios');
      })
      .catch(error => console.log(error));
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
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid,
        nombreValid,
        rolValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid && this.state.nombreValid && this.state.rolValid
    });
  }

  // no hace falta
  renderEditUsuario() {
    let estado = this.state.orden.estado;
    if (this.state.rol === 'Chef') {
      if (estado && estado === 'Comanda') {
        return (
          <button
            onClick={() => this.handlerEstado('En Proceso')}
            className="btn btn-success btn-md pull-right"
          >
            En Proceso
          </button>
        );
      }
      if (estado && estado === 'En Proceso') {
        return (
          <button
            onClick={() => this.handlerEstado('Terminado')}
            className="btn btn-success btn-md pull-right"
          >
            Terminado
          </button>
        );
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <Link to="/usuarios" className="pull-left">
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
          </Link>
          <h1 className="pull-right">{this.state.nombre}</h1>
        </div>
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
                      <span className="error">
                        {this.state.formErrors.email}
                      </span>
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
                <button
                  disabled={!this.state.formValid}
                  className="btn btn-primary btn-md pull-right"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Usuario;
