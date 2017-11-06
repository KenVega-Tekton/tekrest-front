import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

class Ordenes extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      ordenes: [],
      rol: session.rol
    };
    this.fetchOrdenes = this.fetchOrdenes.bind(this);
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  fetchOrdenes() {
    axios
      .get('/api/ordenes')
      .then(results => {
        this.setState({ ordenes: results.data });
      })
      .catch(error => console.log(error));
  }

  componentWillMount() {
    this.fetchOrdenes();
    this.handleAuthorization();
  }

  handleAuthorization() {
    const { rol } = this.state;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Cajero') return <Redirect to="/ordenar" />;
  }

  renderOrdenes() {
    if (this.state.ordenes) {
      return (
        <table className="table">
          <caption />
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Platos</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {this.state.ordenes.map((item, id) => {
              if (item.estado !== 'Terminado') {
                return (
                  <tr key={id}>
                    <td>{id + 1}</td>
                    <td>{item.cliente}</td>
                    <td>{item.pedido.length}</td>
                    <td>
                      {moment(item.ordenCreada).format('DD/MM/YY @ h:mm:ss a')}
                    </td>
                    <td>{item.estado}</td>
                    <td>
                      <Link
                        to={`/orden/${item._id}`}
                        className="btn btn-default btn-md pull-right"
                      >
                        <i className="fa fa-eye" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              }
              return <tr key={id} />;
            })}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <h1>Ordenes</h1>
        <button
          onClick={this.fetchOrdenes}
          className="btn btn-default btn-md pull-right"
        >
          <i className="fa fa-refresh" aria-hidden="true" />
        </button>
        {this.renderOrdenes()}
      </div>
    );
  }
}

export default Ordenes;
