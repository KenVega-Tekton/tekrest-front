import React, { Component } from 'react';
import axios from 'axios';

class OrdenarPage extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol,
      platos: [],
      cliente: '',
      tipoPago: 'default',
      montoTotal: 0,
      pedido: [],
      formErrors: { cliente: '', tipoPago: '', pedido: '' },
      clienteValid: false,
      tipoPagoValid: false,
      pedidoValid: false,
      formValid: false
    };

    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.handleAuthorization();
    axios
      .get('/api/platos')
      .then(results => {
        this.setState({ platos: results.data });
      })
      .catch(error => console.log(error));
  }

  handleAuthorization() {
    const { rol } = this.state;
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
    let clienteValid = this.state.clienteValid;
    let tipoPagoValid = this.state.tipoPagoValid;
    let pedidoValid = this.state.pedidoValid;

    switch (fieldName) {
      case 'cliente':
        clienteValid = value ? true : false;
        fieldValidationErrors.cliente = clienteValid
          ? ''
          : ' Campo Cliente requerido.';
        break;
      case 'tipoPago':
        tipoPagoValid = value === 'Efectivo' || value === 'Tarjeta';
        fieldValidationErrors.tipoPago = tipoPagoValid
          ? ''
          : ' Debe elejir tipo de pago.';
        break;
      case 'pedido':
        pedidoValid = value.length > -1;
        fieldValidationErrors.pedido = pedidoValid
          ? ''
          : ' Debe agregar un plato al pedido.';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        clienteValid,
        tipoPagoValid,
        pedidoValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.clienteValid &&
        this.state.tipoPagoValid &&
        this.state.pedidoValid
    });
  }
  onSubmit(e) {
    e.preventDefault();

    axios
      .post('/api/ordenes', this.state)
      .then(res => {
        alert('Pedido generado con exito!');
        this.props.history.push('/dashboard');
      })
      .catch(err => console.log(err));
  }

  añadirPedido(plato) {
    let pedido = this.state.pedido;
    let montoTotal = this.state.montoTotal;
    pedido.push(plato);
    montoTotal += parseInt(plato.monto, 10);
    this.setState({ pedido, montoTotal }, () => {
      this.validateField('pedido', this.state.pedido);
    });
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

  renderPedido() {
    if (this.state.pedido) {
      return (
        <table className="table">
          <caption>Selecciona un plato para añadir al pedido.</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Plato</th>
              <th>Descripcion</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {this.state.pedido.map((item, id) => (
              <tr key={id}>
                <td>{id + 1}</td>
                <td>{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>.s/ {item.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
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
              <div className="col-md-8">{this.renderMontoTotal()}</div>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="cliente" className="control-label">
                  Cliente
                </label>
                <input
                  value={this.state.cliente}
                  onChange={this.onChange}
                  type="text"
                  name="cliente"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipoPago" className="control-label">
                  Tipo de Pago
                </label>
                <select
                  className="form-control"
                  name="tipoPago"
                  id="sel1"
                  onChange={this.onChange}
                  value={this.state.tipoPago}
                >
                  <option value="default" disabled>
                    Elije forma de pago
                  </option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
              {this.renderPedido()}
            </div>
            <div className="col-md-4">
              <div className="list-group">
                <h4>Platos</h4>
                {this.state.platos.map((plato, id) => (
                  <button
                    key={id}
                    onClick={() => this.añadirPedido(plato)}
                    type="button"
                    className="list-group-item"
                  >
                    {plato.nombre} (.s/ {plato.monto})
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default OrdenarPage;
