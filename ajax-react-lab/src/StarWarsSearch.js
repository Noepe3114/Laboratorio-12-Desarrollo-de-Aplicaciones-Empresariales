import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import StarWarsCard from './StarWarsCard';
import './StarWars.css';
const IMAGE_API = 'https://akabab.github.io/starwars-api/api/all.json';
const normalize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const toNumber = (v) => {
  const n = parseFloat(String(v).replace(',', ''));
  return Number.isNaN(n) ? null : n;
};
const MASS = {
  '': { label: 'Cualquier peso', test: () => true },
  light: { label: 'Ligero (menos de 60 kg)', test: (v) => v !== null && v < 60 },
  medium: { label: 'Medio (60 – 90 kg)', test: (v) => v !== null && v >= 60 && v <= 90 },
  heavy: { label: 'Pesado (más de 90 kg)', test: (v) => v !== null && v > 90 },
};
const HEIGHT = {
  '': { label: 'Cualquier altura', test: () => true },
  low: { label: 'Bajo (menos de 150 cm)', test: (v) => v !== null && v < 150 },
  medium: { label: 'Medio (150 – 185 cm)', test: (v) => v !== null && v >= 150 && v <= 185 },
  tall: { label: 'Alto (más de 185 cm)', test: (v) => v !== null && v > 185 },
};

const GENDER_OPTIONS = [
  ['', 'Todos los géneros'],
  ['male', 'Masculino'],
  ['female', 'Femenino'],
  ['n/a', 'N/A (droides)'],
  ['hermaphrodite', 'Hermafrodita'],
  ['none', 'Sin género'],
];

const EYE_OPTIONS = ['blue', 'brown', 'yellow', 'black', 'orange', 'red', 'hazel', 'gold'];

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

async function fetchCharacters(search, signal) {
  let url = 'https://swapi.dev/api/people/';
  let params = { search };
  const all = [];

  while (url) {
    const { data } = await axios.get(url, { params, signal });

    data.results.forEach((p) => {
      all.push({
        id: p.url.split('/').filter(Boolean).pop(),
        name: p.name,
        gender: p.gender,
        birth_year: p.birth_year,
        height: toNumber(p.height),
        mass: toNumber(p.mass),
        eye_color: p.eye_color,
        hair_color: p.hair_color,
      });
    });

    url = data.next ? data.next.replace('http://', 'https://') : null;
    params = undefined;
  }
  return all;
}

function StarWarsSearch() {
  const [characters, setCharacters] = useState([]);
  const [images, setImages] = useState({});
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('');
  const [eyes, setEyes] = useState('');
  const [mass, setMass] = useState('');
  const [height, setHeight] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const debouncedQuery = useDebounce(query.trim());

  useEffect(() => {
    axios
      .get(IMAGE_API)
      .then(({ data }) => {
        const map = {};
        data.forEach((p) => {
          map[normalize(p.name)] = p.image;
        });
        setImages(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetchCharacters(debouncedQuery, controller.signal)
      .then((list) => {
        setCharacters(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  const visible = characters
    .filter((c) => !gender || c.gender === gender)
    .filter((c) => !eyes || c.eye_color.includes(eyes))
    .filter((c) => MASS[mass].test(c.mass))
    .filter((c) => HEIGHT[height].test(c.height))
    .sort((a, b) =>
      order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const clearFilters = () => {
    setQuery('');
    setGender('');
    setEyes('');
    setMass('');
    setHeight('');
    setOrder('asc');
  };

  return (
    <Container className="sw-container py-4">
      <Form className="sw-filters" onSubmit={(e) => e.preventDefault()}>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Control
              size="lg"
              type="search"
              placeholder="Busca un personaje (luke, leia, vader...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>

          <Col xs={6} lg={3}>
            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
              {GENDER_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} lg={3}>
            <Form.Select value={eyes} onChange={(e) => setEyes(e.target.value)}>
              <option value="">Todos los ojos</option>
              {EYE_OPTIONS.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} lg={3}>
            <Form.Select value={mass} onChange={(e) => setMass(e.target.value)}>
              {Object.entries(MASS).map(([key, m]) => (
                <option key={key} value={key}>{m.label}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} lg={3}>
            <Form.Select value={height} onChange={(e) => setHeight(e.target.value)}>
              {Object.entries(HEIGHT).map(([key, h]) => (
                <option key={key} value={key}>{h.label}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-warning"
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            >
              Orden: {order === 'asc' ? 'A → Z' : 'Z → A'}
            </Button>
            <Button variant="outline-light" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </Col>
        </Row>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          No se pudo conectar con swapi.dev. Intenta de nuevo en unos segundos.
        </Alert>
      )}

      <p className="sw-summary">
        {loading && <Spinner animation="border" size="sm" className="me-2" />}
        Mostrando <b>{visible.length}</b> de <b>{characters.length}</b> personajes
      </p>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {visible.map((c) => (
          <Col key={c.id}>
            <StarWarsCard character={c} image={images[normalize(c.name)]} />
          </Col>
        ))}
      </Row>

      {!loading && !error && visible.length === 0 && (
        <div className="sw-empty">
          <div></div>
          No se encontraron personajes en esta galaxia.
        </div>
      )}
    </Container>
  );
}
export default StarWarsSearch;