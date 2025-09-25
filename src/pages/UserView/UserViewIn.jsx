import React, { useEffect, useState } from "react";
import ludicaImg from "./img/baile.webp";
import ludicaImg2 from "./img/futbol.jpg";
import ludicaImg3 from "./img/gim.jpeg";
import ludicaImg4 from "./img/musica.jpg";
import EventoImg from "./img/charla.avif";
import EventoImg2 from "./img/cacao.avif";
import EventoImg3 from "./img/charla.avif";
import EventoImg4 from "./img/feriaempe.png";
import logo from "./img/image.png";
import { FaUserTie, FaMapMarkerAlt, FaUserShield, FaPhoneAlt, FaPhone, FaEnvelope } from "react-icons/fa";

import "./styles/UserView.css";
import axios from "axios";

export default function InstructorView({ setContenidoActual, actualizarPerfil }) {
  const [usuario, setUsuario] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalContenido, setModalContenido] = useState({ titulo: "", contenido: null });

  const abrirModal = (titulo, contenido) => {
    setModalContenido({ titulo, contenido });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModalContenido({ titulo: "", contenido: null });
  };

  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.IdUsuario;

      const res = await axios.get(`https://render-hhyo.onrender.com/api/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuario(res.data);
    } catch (err) {
      console.error("Error cargando instructor:", err);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, [actualizarPerfil]);

  return (
    <section className="UserContenedor">
      {!usuario ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="UserCuadro UserInfo">
          <div className="UserProfileCard">
            {usuario.perfilInstructor?.imagen && (
              <img
                src={
                  usuario.perfilInstructor.imagen.startsWith("data:image")
                    ? usuario.perfilInstructor.imagen
                    : `http://localhost:3001${usuario.perfilInstructor.imagen}`
                }
                alt="Foto del instructor"
                className="UserProfileAvatar"
              />
            )}
            <div className="UserProfileName">{usuario.Nombre} {usuario.Apellido}</div>
            <ul className="UserProfileList">
              <li><FaUserTie /> <b>Profesión:</b> {usuario.perfilInstructor?.profesion || "No asignada"}</li>
              <li><FaMapMarkerAlt /> <b>Ubicación:</b> {usuario.perfilInstructor?.ubicacion || "No asignada"}</li>
              <li><FaUserShield /> <b>Rol:</b> {usuario?.rol?.NombreRol || "Sin rol"}</li>
              <li><FaPhone /> <b>Teléfono:</b> {usuario.Telefono || "No aplica"}</li>
              <li><FaEnvelope /> <b>Correo:</b> {usuario.Correo}</li>
            </ul>
            <img src={logo} className="UserProfileLogo" alt="Logo" />
            <button className="UserProfileBtn" >
              Editar perfil
            </button>
          </div>
        </div>
      )}

      <div className="UserMainContent">
        <div className="UserCuadro UserLudicas">
          <h3 className="UserTitulo">Lúdicas</h3>
          <div className="UserTarjetas">
            {[
              {
                titulo: "Baile Caucano",
                img: ludicaImg,
                hora: "8:00 AM - 12:00 PM",
                lugar: "Donde se baila :P",
                tipo: "Recreativa",
                desc: "Baile Baile Baile Baile Baile Baile.",
              },
              {
                titulo: "Fútbol Recreativo",
                img: ludicaImg2,
                hora: "8:00 AM - 12:00 PM",
                lugar: "Cancha múltiple",
                tipo: "Recreativa",
                desc: "Futbol Futbol Futbol Futbol Futbol Futbol.",
              },
              {
                titulo: "Gimnasio Sena",
                img: ludicaImg3,
                hora: "8:00 AM - 12:00 PM",
                lugar: "Sabrá Dios 👌",
                tipo: "Recreativa",
                desc: "GimBro GimBro GimBro GimBro GimBro.",
              },
              {
                titulo: "Música y Artes",
                img: ludicaImg4,
                hora: "2:00 PM - 5:00 PM",
                lugar: "No se",
                tipo: "Cultural",
                desc: "Music Music Music Music Music Music.",
              },
            ].map((ludica, i) => (
              <div
                key={i}
                className="UserTarjeta"
                onClick={() => abrirModal(ludica.titulo, (
                  <>
                    <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                    <p>🕒 Hora: {ludica.hora}</p>
                    <p>📍 Lugar: {ludica.lugar}</p>
                    <p>🎯 Tipo: {ludica.tipo}</p>
                    <p>{ludica.desc}</p>
                  </>
                ))}
              >
                <img src={ludica.img} alt={ludica.titulo} className="UserTarjetaImg" />
                <div className="UserTarjetaTexto">{ludica.titulo}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="UserCuadro UserEventos">
          <h3 className="UserTitulo">Eventos Semanales!</h3>
          <div className="UserTarjetas">
            {[
              {
                titulo: "Charla Motivacional",
                img: EventoImg,
                fecha: "20 de junio 2025",
                hora: "10:00 AM - 11:30 AM",
                lugar: "Sala múltiple",
                tipo: "Formativa",
                desc: "Este hombre fue el que descubrió la vacuna contra el Covid-19... (historia motivacional).",
              },
              {
                titulo: "Feria Del Cacao 🍫",
                img: EventoImg2,
                fecha: "20 de junio 2025",
                hora: "10:00 AM - 3:00 PM",
                lugar: "Sala múltiple",
                tipo: "Formativa",
                desc: "Exposición de proyectos por aprendices de diferentes programas.",
              },
              {
                titulo: "Academia",
                img: EventoImg3,
                fecha: "20 de junio 2025",
                hora: "10:00 AM - 3:00 PM",
                lugar: "Sala múltiple",
                tipo: "Formativa",
                desc: "Exposición de proyectos por aprendices de diferentes programas.",
              },
              {
                titulo: "Feria del Emprendimiento",
                img: EventoImg4,
                fecha: "25 de junio 2025",
                hora: "7:00 AM - 5:00 PM",
                lugar: "Ambiente de Software",
                tipo: "Competencia",
                desc: "Desarrollo de apps en tiempo récord por equipos SENA.",
              },
            ].map((evento, i) => (
              <div
                key={i}
                className="UserTarjeta"
                onClick={() => abrirModal(evento.titulo, (
                  <>
                    <p>📅 Fecha: {evento.fecha}</p>
                    <p>🕒 Hora: {evento.hora}</p>
                    <p>📍 Lugar: {evento.lugar}</p>
                    <p>🎯 Tipo: {evento.tipo}</p>
                    <p>{evento.desc}</p>
                  </>
                ))}
              >
                <img src={evento.img} alt={evento.titulo} className="UserTarjetaImg" />
                <div className="UserTarjetaTexto">{evento.titulo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="UserModalOverlay" onClick={cerrarModal}>
          <div className="UserModalContenido" onClick={(e) => e.stopPropagation()}>
            <button className="UserModalCerrar" onClick={cerrarModal}>✖</button>
            <h3>{modalContenido.titulo}</h3>
            <div>{modalContenido.contenido}</div>
          </div>
        </div>
      )}
    </section>
  );
}
