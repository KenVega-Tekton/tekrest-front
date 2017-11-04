import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="jumbotron">
      <div className="container">
        <h1>Hola, mundo!</h1>
        <p>
          Esta es una aplicacion para restaurantes, ha sido realizada como
          prueba tecnica para obtar por el puesto de JavaScript Developer, en
          Tekton Labs.
        </p>
        <p>
          <Link className="btn btn-primary btn-lg" to="#" role="button">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
