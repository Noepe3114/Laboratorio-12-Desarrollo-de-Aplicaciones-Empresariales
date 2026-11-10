import StarWarsSearch from './StarWarsSearch';

function App() {
  return (
    <>
      <header className="sw-hero">
        <h1>Star Wars · Archivo Galáctico</h1>
        <p>Busca mientras escribes · filtra por género, ojos, peso y altura</p>
      </header>
      <StarWarsSearch />
    </>
  );
}

export default App;