import { FaBell, FaBars } from "react-icons/fa";

import React, { useState } from "react";
import avatar from "../img/avatar.png";


import Rotar from "../RotatingText/Rotar"


export default function Navbar({ toggleMenu, setContenidoActual }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleDropdown = () => {
    setMostrarMenu((prev) => !prev);
  };

  const irAPerfil = () => {
    setContenidoActual("perfil");
    setMostrarMenu(false); 
  };

  const irConfig = () => {
    setContenidoActual("config");
    setMostrarMenu(false); 
  };

  return (
    <header className="encabezadodash">
      
<div className="rotar-container">
        <Rotar />
      </div>

      <nav className="accionesdash">
        <button className="iconodash">
          <FaBell />
        </button>

        <section className="usuariodash" style={{ position: "relative" }}>
          <img src={avatar} alt="Usuariodash" className="avatardash" />
          <span
            className="nombredash"
            style={{ cursor: "pointer" }}
          >
            Administrador
          </span>

          {mostrarMenu && (
            <div className="menudesplegabledash">
              <ul>
                <li onClick={irAPerfil}>Perfil</li>
                <li onClick={irConfig}>Configuración</li>
                <li>Cerrar sesión</li>
              </ul>
            </div>
          )}
        </section>
      </nav>
    </header>
  );
}
