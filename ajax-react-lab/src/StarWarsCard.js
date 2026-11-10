import { useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';

const GENDERS = {
  male: ['Masculino', 'primary'],
  female: ['Femenino', 'danger'],
  'n/a': ['N/A (droide)', 'secondary'],
  hermaphrodite: ['Hermafrodita', 'warning'],
  none: ['Sin género', 'secondary'],
};

const GUIDE_IMG =
  'https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/characters';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="100%" height="100%" fill="#0b0d14"/>
      <circle cx="150" cy="120" r="70" fill="none" stroke="#ffe81f" stroke-width="4"/>
      <circle cx="150" cy="120" r="8" fill="#ffe81f"/>
      <text x="50%" y="245" fill="#ffe81f" font-size="20" text-anchor="middle" font-family="Arial" font-weight="bold">HOLOGRAMA NO DISPONIBLE</text>
    </svg>`
  );

function StarWarsCard({ character, image }) {
  const { id, name, gender, birth_year, height, mass, eye_color, hair_color } = character;
  const [genderLabel, genderColor] = GENDERS[gender] || [gender, 'secondary'];

  const sources = [image, `${GUIDE_IMG}/${id}.jpg`, PLACEHOLDER].filter(Boolean);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [image]);

  const nextSource = () => setStep((s) => Math.min(s + 1, sources.length - 1));

  const handleError = () => nextSource();

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth === 300 && naturalHeight === 171) nextSource();
  };

  return (
    <Card className="sw-card h-100">
      <div className="sw-img">
        <img
          src={sources[Math.min(step, sources.length - 1)]}
          alt={name}
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>

      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Badge bg={genderColor} className="mb-2">{genderLabel}</Badge>

        <ul className="sw-data">
          <li>Nacimiento: <b>{birth_year}</b></li>
          <li>Altura: <b>{height !== null ? `${height} cm` : 'desconocida'}</b></li>
          <li>Peso: <b>{mass !== null ? `${mass} kg` : 'desconocido'}</b></li>
          <li>Ojos: <b>{eye_color}</b></li>
          <li>Cabello: <b>{hair_color}</b></li>
        </ul>
      </Card.Body>
    </Card>
  );
}

export default StarWarsCard;