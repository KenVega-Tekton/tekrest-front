import React, { Component } from 'react';
import axios from 'axios';

class Plato extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol,
      nombre: '',
      descripcion: '',
      monto: 0,
      formErrors: { nombre: '', descripcion: '', monto: '' },
      nombreValid: false,
      descripcionValid: false,
      montoValid: false,
      formValid: false
    };

    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nombreValid = this.state.nombreValid;
    let descripcionValid = this.state.descripcionValid;
    let montoValid = this.state.montoValid;

    switch (fieldName) {
      case 'nombre':
        nombreValid = value ? true : false;
        fieldValidationErrors.nombre = nombreValid
          ? ''
          : ' Campo Nombre requerido.';
        break;
      case 'descripcion':
        descripcionValid = value ? true : false;
        fieldValidationErrors.descripcion = descripcionValid
          ? ''
          : ' Campo Descripcion requerido.';
        break;
      case 'monto':
        montoValid = value.length > 0;
        fieldValidationErrors.monto = montoValid
          ? ''
          : ' Campo Monto requerido.';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        nombreValid,
        descripcionValid,
        montoValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.nombreValid &&
        this.state.descripcionValid &&
        this.state.montoValid
    });
  }
  onSubmit(e) {
    e.preventDefault();

    axios
      .post('/api/platos', this.state)
      .then(res => {
        alert('Plato añadido con exito!');
        this.props.history.push('/dashboard');
      })
      .catch(err => console.log(err));
  }

  renderMontoTotal() {
    if (this.state.montoTotal) {
      return (
        <p className="text-right">
          Monto a Pagar <strong>.S/ {this.state.montoTotal}</strong>
        </p>
      );
    } else {
      return (
        <p className="text-right">
          Monto a Pagar <strong>.S/ 0</strong>
        </p>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <button
                  disabled={!this.state.formValid}
                  type="submit"
                  className="btn btn-primary btn-md"
                >
                  Realizar Orden
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 col-md-offset-4">
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
              </div>
              <div className="form-group">
                <label htmlFor="descripcion" className="control-label">
                  Descripcion
                </label>
                <input
                  value={this.state.descripcion}
                  onChange={this.onChange}
                  type="text"
                  name="descripcion"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="monto" className="control-label">
                  monto
                </label>
                <input
                  value={this.state.monto}
                  onChange={this.onChange}
                  type="number"
                  name="monto"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Plato;
