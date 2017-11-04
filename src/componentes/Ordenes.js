import React from 'react';
import { Link } from 'react-router-dom';

const Ordenes = () => {
  return (
    <div className="container">
      <h1>Hola desde ordenes</h1>
      <Link to="/" className="btn btn-primary btn-sm">
        Back
      </Link>
    </div>
  );
};

export default Ordenes;
