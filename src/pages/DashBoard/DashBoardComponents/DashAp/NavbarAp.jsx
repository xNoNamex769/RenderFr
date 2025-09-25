import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import avatar from "../img/avatar.png";
import "./GlassIcons/style/Notificaciones.css";
import { io } from "socket.io-client";
import Rotar from "../RotatingText/Rotar";
import {
  getNotificacionesPorUsuario,
  confirmarNotificacion,
} from "../../../../services/notificacionService";
import sindesenaLogo from "../../../../../public/img/sindesena.webp";

export default function Navbar({ toggleMenu, setContenidoActual, cerrarSesion }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [animarCampana, setAnimarCampana] = useState(false);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const [noticiasSindesena, setNoticiasSindesena] = useState([]);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const sonidoAlerta = useRef(new Audio("/audio/notificacion.mp3"));

  const idUsuario = JSON.parse(localStorage.getItem("usuario"))?.IdUsuario;

  const toggleDropdown = () => setMostrarMenu((prev) => !prev);
  const irAPerfil = () => {
    setContenidoActual("perfil");
    setMostrarMenu(false);
  };
  const irConfig = () => {
    setContenidoActual("config");
    setMostrarMenu(false);
  };

  const confirmar = async (id) => {
    await confirmarNotificacion(id);
    cargarNotificaciones();
  };

  const cargarNotificaciones = async () => {
    if (!idUsuario) return;
    try {
      const data = await getNotificacionesPorUsuario(idUsuario);
      setNotificaciones(data);
      const nuevasNoLeidas = data.filter((n) => !n.Confirmado).length;

      if (nuevasNoLeidas > cantidadNoLeidas) {
        sonidoAlerta.current.play().catch((e) =>
          console.warn("No se pudo reproducir el sonido:", e)
        );
        setAnimarCampana(true);
        setTimeout(() => setAnimarCampana(false), 500);
      }

      setCantidadNoLeidas(nuevasNoLeidas);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  const obtenerNoticiasSindesena = async () => {
    try {
      const res = await fetch("https://render-hhyo.onrender.com/api/actividad/noticias");
      const data = await res.json();
      const soloSindesena = data.filter((n) => n.TipoLudica === "Noticia");
      setNoticiasSindesena(soloSindesena);

      if (soloSindesena.length > 0) {
        setMostrarBanner(true);
      }
    } catch (err) {
      console.error("Error al traer noticias Sindesena:", err);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Conectado al socket:", socket.id);
    });

    socket.on("nuevaNotificacion", () => {
      sonidoAlerta.current.play().catch((e) =>
        console.warn("No se pudo reproducir el sonido:", e)
      );
      setAnimarCampana(true);
      setTimeout(() => setAnimarCampana(false), 500);
      cargarNotificaciones();
    });

    return () => {
      socket.off("nuevaNotificacion");
    };
  }, []);

  useEffect(() => {
    cargarNotificaciones();
    obtenerNoticiasSindesena();
  }, []);

  // ⏱️ Ocultar banner automáticamente luego de 10 segundos
  useEffect(() => {
    if (mostrarBanner) {
      const timer = setTimeout(() => {
        setMostrarBanner(false);
      }, 10000); // 10 segundos
      return () => clearTimeout(timer);
    }
  }, [mostrarBanner]);

  return (
    <>
      {/* 🟩 Banner de noticia de Sindesena con cierre automático y botón ✖ */}
      {noticiasSindesena.length > 0 && mostrarBanner && (
        <>
          <div className="logo-sindesena-wrapper">
            <img src={sindesenaLogo} alt="Sindesena" className="logo-sindesena" />
          </div>

          <div className="banner-sindesena">
            <span role="img" aria-label="noticia">📰</span>
            <strong> Sindesena informa:</strong> {noticiasSindesena[0].NombreActi}
            <button
              onClick={() => setContenidoActual("noticias")}
              className="ver-mas-noti"
            >
              Ver más
            </button>
            <button
              onClick={() => setMostrarBanner(false)}
              className="btn-cerrar-banner"
              title="Cerrar banner"
            >
              ✖
            </button>
          </div>
        </>
      )}

      <header className="encabezadodash">
        
        <Rotar />

        <nav className="accionesdash">
          <div className="relative">
            <button
              className={`iconodash relative ${animarCampana ? "animar-campana" : ""}`}
              onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
            >
              <FaBell />
              {cantidadNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cantidadNoLeidas}
                </span>
              )}
            </button>

            {mostrarNotificaciones && (
              <div className="dropdown-notificaciones">
                <div className="noti-header">
                  <h3>🔔 Notificaciones</h3>
                  <button
                    className="btn-cerrar-noti"
                    onClick={() => setMostrarNotificaciones(false)}
                  >
                    ✖
                  </button>
                </div>

                {notificaciones.length === 0 ? (
                  <p>No hay notificaciones.</p>
                ) : (
                  <ul>
                    {notificaciones.map((n) => (
                      <li
                        key={n.IdNotificacion}
                        className={`notificacion-item ${n.Confirmado ? "notificacion-confirmada" : ""}`}
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        onClick={() => {
                          if (n.RutaDestino) {
                            let rutaLimpia = n.RutaDestino.replace(/^\//, "").toLowerCase();
                            if (rutaLimpia === "usuario/constancia") {
                              rutaLimpia = "constanciacr";
                            }
                            setContenidoActual(rutaLimpia);
                          }
                        }}
                      >
                        {n.imagenUrl && (
                          <img
                            src={n.imagenUrl}
                            alt="Elemento"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              marginRight: 10,
                              borderRadius: 6,
                            }}
                          />
                        )}
                        <div>
                          <strong>{n.Titulo}</strong>
                          <p>{n.Mensaje}</p>
                          <p className="fecha">
                            {new Date(n.FechaDeEnvio).toLocaleDateString()}
                          </p>
                          {!n.Confirmado && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmar(n.IdNotificacion);
                              }}
                            >
                              Confirmar ✅
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <section className="usuariodash" style={{ position: "relative" }}>
            <img src={avatar} alt="Usuariodash" className="avatardash" />
            <span
              className="nombredash"
              style={{ cursor: "pointer" }}
            >
              Aprendiz
            </span>

            {mostrarMenu && (
              <div className="menudesplegabledash">
                <ul>
                  <li onClick={irAPerfil}>Perfil</li>
                  <li onClick={irConfig}>Configuración</li>
                  <li onClick={cerrarSesion}>Cerrar sesión</li>
                </ul>
              </div>
            )}
          </section>
        </nav>
      </header>
    </>
  );
}
