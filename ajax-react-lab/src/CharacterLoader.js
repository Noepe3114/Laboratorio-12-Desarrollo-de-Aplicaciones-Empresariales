import React, { useState } from 'react';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import CharacterCard from './CharacterCard';
function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const loadCharacters = () => {
    setLoading(true);
    setError(false);
    axios
      .get('https://swapi.dev/api/people/')
      .then((response) => {
        setCharacters(response.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="toolbar">
        <h2 className="toolbar__title">Personajes de Star Wars</h2>
        <button className="btn-pill" onClick={loadCharacters} disabled={loading}>
          {loading ? 'Cargando Personajes...' : 'Cargar Personajes'}
        </button>
      </div>
      {error && (
        <div className="estado estado--error">
          No se pudo obtener la información. Inténtalo de nuevo.
        </div>
      )}
      {!error && !loading && characters.length === 0 && (
        <div className="estado">
          Pulsa «Cargar Personajes» para traer los datos desde la API.
        </div>
      )}
      <Row className="g-4">
        {characters.map((character, index) => (
          <CharacterCard key={index} character={character} />
        ))}
      </Row>
    </>
  );
}

export default CharacterLoader;