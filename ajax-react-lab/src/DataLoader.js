import React, { useState } from 'react';
function DataLoader() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    // Simulamos una petición Ajax con un retraso de 2 segundos
    setTimeout(() => {
      const newData = ['Elemento 1', 'Elemento 2', 'Elemento 3'];
      setData(newData);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <div className="toolbar">
        <h2 className="toolbar__title">Mi Página con React y Ajax</h2>
        <button className="btn-pill" onClick={fetchData} disabled={loading}>
          {loading ? 'Cargando...' : 'Cargar Datos'}
        </button>
      </div>

      {loading ? (
        <div className="estado">
          <span className="spinner" />
          Cargando datos...
        </div>
      ) : data.length > 0 ? (
        <ul className="lista">
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="estado">No hay datos disponibles.</div>
      )}
    </>
  );
}

export default DataLoader;