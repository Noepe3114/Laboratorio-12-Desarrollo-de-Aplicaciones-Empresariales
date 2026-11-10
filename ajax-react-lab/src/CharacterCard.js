import React from 'react';
import { Col, Card } from 'react-bootstrap';

function CharacterCard({ character }) {
  const iniciales = character.name
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0))
    .join('');

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <Card className="character-card h-100">
        <Card.Body>
          <div className="avatar">{iniciales}</div>
          <Card.Title>{character.name}</Card.Title>
          <Card.Text>
            <strong>Género:</strong> {character.gender}
          </Card.Text>
          <Card.Text>
            <strong>Año de nacimiento:</strong> {character.birth_year}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default CharacterCard;