// src/CharacterList.js
import React, { Component } from 'react';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import CharacterCard from './CharacterCard';

class CharacterList extends Component {
  state = {
    characters: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    axios
      .get('https://swapi.dev/api/people/')
      .then((response) => {
        this.setState({ characters: response.data.results, loading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false, error: true });
      });
  }

  render() {
    const { characters, loading, error } = this.state;

    return (
      <>
        <div className="toolbar">
          <h2 className="toolbar__title">Personajes de Star Wars</h2>
          <span className="toolbar__meta">{characters.length} personajes</span>
        </div>

        {loading && (
          <div className="estado">
            <span className="spinner" />
            Cargando personajes...
          </div>
        )}

        {error && (
          <div className="estado estado--error">
            No se pudo obtener la información. Revisa tu conexión e inténtalo de nuevo.
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
}

export default CharacterList;