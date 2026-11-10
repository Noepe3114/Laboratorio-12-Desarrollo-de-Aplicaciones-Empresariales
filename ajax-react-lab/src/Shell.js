import React from 'react';

function Shell({ titulo, descripcion, children }) {
  return (
    <div className="App">
      <header className="topbar">
        <nav className="topbar__links">
          <a href="https://swapi.dev/documentation" target="_blank" rel="noreferrer">
            Documentación
          </a>
          <a href="https://swapi.dev/api/people/" target="_blank" rel="noreferrer">
            Personajes
          </a>
          <a href="https://swapi.dev/about" target="_blank" rel="noreferrer">
            Acerca de
          </a>
        </nav>

        <span className="topbar__brand">holocrón</span>

        <div className="topbar__actions">
          <a
            className="topbar__login"
            href="https://swapi.dev/api/people/1/"
            target="_blank"
            rel="noreferrer"
          >
            Ver JSON
          </a>
          <a
            className="btn-pill"
            href="https://swapi.dev/"
            target="_blank"
            rel="noreferrer"
          >
            Abrir API
          </a>
        </div>
      </header>

      <section className="hero">
        <span className="hero__eyebrow">API pública SWAPI</span>
        <h1 className="hero__title">{titulo}</h1>
        <p className="hero__text">{descripcion}</p>
      </section>

      <main className="content">{children}</main>
    </div>
  );
}

export default Shell;