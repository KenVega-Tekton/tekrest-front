import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import './App.css';

class Reporte extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      rol: session.rol,
      data: false,
      ventas: false
    };
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  componentWillMount() {
    this.requestCaja();
  }

  requestCaja() {
    axios
      .get('/api/ordenes')
      .then(res => {
        this.setState({ data: res.data });
        return axios.get('/api/ventas');
      })
      .then(res => {
        this.setState({ ventas: res.data[0] });
      })
      .catch(err => console.log(err));
  }

  renderReporte() {
    if (this.state.ventas) {
      return (
        <table className="table">
          <caption>
            <strong>{this.state.ventas.totalOrdenes}</strong> Ordenes
            Realizadas. - Monto Total
            <strong> .S/{this.state.ventas.montoTotal}.</strong> - Platos
            ordenados <strong>{this.state.ventas.totalPlatos}</strong>
          </caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Platos</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Pago</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((item, id) => {
              return (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{item.cliente}</td>
                  <td>{item.pedido.length}</td>
                  <td>
                    {moment(item.ordenCreada).format('DD/MM/YY @ h:mm:ss a')}
                  </td>
                  <td>{item.montoTotal}</td>
                  <td>{item.tipoPago}</td>
                  <td>{item.estado}</td>
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
        <div className="col-sm-12">CHART</div>
        <div className="col-sm-12 gridEfectivo">{this.renderReporte()}</div>
      </div>
    );
  }
}

export default Reporte;
