import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Usuarios extends Component {
  constructor(props) {
    super(props);

    let session = sessionStorage.getItem('token')
      ? JSON.parse(sessionStorage.getItem('token'))
      : { rol: false };

    this.state = {
      usuarios: [],
      rol: session.rol
    };
    this.fetchUsuarios = this.fetchUsuarios.bind(this);
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
  }

  fetchUsuarios() {
    axios
      .get('/api/usuarios')
      .then(results => {
        this.setState({ usuarios: results.data });
      })
      .catch(error => console.log(error));
  }

  componentWillMount() {
    this.fetchUsuarios();
    this.handleAuthorization();
  }

  handleAuthorization() {
    const { rol } = this.state;
    if (!rol) return this.props.history.push('/signin');
    if (rol === 'Cajero') return <Redirect to="/ordenar" />;
    if (rol === 'Chef') return <Redirect to="/ordenes" />;
  }

  renderUsuarios() {
    if (this.state.usuarios) {
      return (
        <table className="table">
          <caption />
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {this.state.usuarios.map((item, id) => {
              return (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{item.nombre}</td>
                  <td>{item.email}</td>
                  <td>{item.rol}</td>
                  <td>
                    <Link
                      to={`/usuario/${item._id}`}
                      className="btn btn-default btn-md pull-right"
                    >
                      <i className="fa fa-eye" aria-hidden="true" />
                    </Link>
                  </td>
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
      <div className="container">
        <h1>Usuarios</h1>
        <button
          onClick={this.fetchUsuarios}
          className="btn btn-default btn-md pull-right"
        >
          <i className="fa fa-refresh" aria-hidden="true" />
        </button>
        <Link to="/registro" className="btn btn-default btn-md pull-right">
          <i className="fa fa-plus" aria-hidden="true" />
        </Link>
        {this.renderUsuarios()}
      </div>
    );
  }
}

export default Usuarios;
