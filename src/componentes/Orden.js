import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

class Orden extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      orden: {},
      rol: session.rol
    };
    this.handlerEstado = this.handlerEstado.bind(this);
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  fetchOrden() {
    axios
      .get(`/api/ordenes/${this.props.match.params.id}`)
      .then(results => {
        this.setState({ orden: results.data });
      })
      .catch(error => console.log(error));
  }

  componentWillMount() {
    this.fetchOrden();
  }

  handleAuthorization() {
    const { rol } = this.state;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Cajero') return this.props.history.push('/ordenar');
  }

  handlerEstado(estado) {
    axios
      .put(`/api/ordenes/${this.props.match.params.id}`, { estado })
      .then(res => {
        alert(res.data.mensaje);
        this.props.history.push('/ordenes');
      })
      .catch(error => console.log(error));
  }

  renderCambiarEstado() {
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

  renderPlatos() {
    if (this.state.orden.pedido) {
      return (
        <table className="table">
          <caption />
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {this.state.orden.pedido.map((item, id) => (
              <tr key={id}>
                <td>{id + 1}</td>
                <td>{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>{item.monto}</td>
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
          <Link to="/ordenes" className="pull-left">
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true" />
          </Link>
          <h1 className="pull-right">Orden</h1>
        </div>
        <div className="row">
          <h3 className="pull-left">{this.state.orden.cliente}</h3>
          <h3 className="pull-right">
            {moment(this.state.orden.ordenCreada).format(
              'DD/MM/YY @ h:mm:ss a'
            )}&ensp;
            <span className="label label-info">{this.state.orden.estado}</span>
          </h3>
        </div>
        <div className="row">
          {this.renderCambiarEstado()}
          {this.renderPlatos()}
        </div>
      </div>
    );
  }
}

export default Orden;
