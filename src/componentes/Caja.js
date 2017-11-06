import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import './App.css';

class Caja extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol,
      data: false
    };
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  componentWillMount() {
    this.requestCaja();
  }

  requestCaja() {
    axios
      .get('/api/caja')
      .then(res => this.setState({ data: res.data }))
      .catch(err => console.log(err));
  }

  renderEfectivoCard() {
    if (this.state.data) {
      return (
        <div className="card">
          <div className="contenedor">
            <h4>
              <b>Pagos en Efectivo</b>
            </h4>
            <h5>
              Total = <strong>.S/ {this.state.data.caja.efectivo}</strong>
            </h5>
            <h5>
              Ordenes = <strong>{this.state.data.caja.totalOrdenes}</strong>
            </h5>
            <h5>
              Platos = <strong>{this.state.data.caja.totalPlatos}</strong>
            </h5>
          </div>
        </div>
      );
    }
  }

  renderOrdenesEfectivo() {
    if (this.state.data) {
      return (
        <table className="table">
          <caption>Ordenes pagadas en efectivo</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Platos</th>
              <th>Fecha</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.ordenes.map((item, id) => {
              return (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{item.cliente}</td>
                  <td>{item.pedido.length}</td>
                  <td>
                    {moment(item.ordenCreada).format('DD/MM/YY @ h:mm:ss a')}
                  </td>
                  <td>{item.montoTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-4">{this.renderEfectivoCard()}</div>
        <div className="col-sm-8 gridEfectivo">
          {this.renderOrdenesEfectivo()}
        </div>
      </div>
    );
  }
}

export default Caja;
