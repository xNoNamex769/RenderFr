import React, { useEffect, useState, useRef } from "react";
import avatar from "../DashBoard/img/avatar.png";
import ludicaImg from "./img/baile.webp";
import ludicaImg2 from "./img/futbol.jpg";
import ludicaImg3 from "./img/gim.jpeg";
import ludicaImg4 from "./img/musica.jpg";
import EventoImg from "./img/charla.avif";
import EventoImg2 from "./img/cacao.avif";
import EventoImg3 from "./img/charla.avif";
import EventoImg4 from "./img/feriaempe.png";
import logo from "./img/image.png";
import { FaUserGraduate, FaBook, FaIdBadge, FaClock, FaPhone, FaEnvelope } from "react-icons/fa";

import "./styles/UserView.css";
import axios from "axios";

export default function UserViewAp({ setContenidoActual }) {
  const fetched = useRef(false);
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

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.IdUsuario;

        const usuarioGuardado = sessionStorage.getItem("usuario");
        if (usuarioGuardado) {
          const usuarioCache = JSON.parse(usuarioGuardado);
          if (usuarioCache.IdUsuario === id) {
            setUsuario(usuarioCache);
            return;
          } else {
            sessionStorage.removeItem("usuario");
          }
        }

        const res = await axios.get(`https://render-hhyo.onrender.com/api/usuario/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuario(res.data);
        sessionStorage.setItem("usuario", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error cargando usuario:", err);
      }
    };

    fetchUsuario();
  }, []);

  return (
    <section className="UserContenedor">
      {!usuario ? (
        <p>Cargando datos...</p>
      ) : (
        <div className="UserCuadro UserInfo">
          <div className="UserProfileCard">
            <img src={avatar} alt="Avatar" className="UserProfileAvatar" />
            <div className="UserProfileName">{usuario.Nombre} {usuario.Apellido}</div>
            <ul className="UserProfileList">
              <li><FaUserGraduate /> <b>Rol:</b> {usuario?.rol?.NombreRol || "Sin rol"}</li>
              <li><FaPhone /> <b>Teléfono:</b> {usuario.Telefono}</li>
              <li><FaEnvelope /> <b>Correo:</b> {usuario.Correo}</li>
            </ul>
            <img src={logo} className="UserProfileLogo" alt="Logo SENA" />
            <button className="UserProfileBtn" >
              Gestiona, Diviértete en la plataforma más innovadora
            </button>
          </div>
        </div>
      )}

      {/* Agrupa aquí */}
      <div className="UserMainContent">
        <div className="UserCuadro UserLudicas">
          <h3 className="UserTitulo">Lúdicas</h3>
          <div className="UserTarjetas">
            <div className="UserTarjeta" onClick={() => abrirModal("Baile Caucano", (
              <>
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p><br />
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p><br />
                <p>📍 Lugar: Coliseo, CTPI</p><br />
                <p>🎯 Tipo: Recreativa</p>
              </>
            ))}>
              <img src={ludicaImg} alt="Baile" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Baile Caucano</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Fútbol Recreativo", (
              <>
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                <p>📍 Lugar: Cancha múltiple</p>
                <p>🎯 Tipo: Recreativa</p>
              </>
            ))}>
              <img src={ludicaImg2} alt="Fútbol" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Fútbol Recreativo</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Gimnasio Sena", (
              <>
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 8:00 AM - 12:00 PM</p>
                <p>📍 Lugar: Gimnasio</p>
                <p>🎯 Tipo: Recreativa</p>
              </>
            ))}>
              <img src={ludicaImg3} alt="Gimnasio" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Gimnasio Sena</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Música y Artes", (
              <>
                <p>📅 ¡INSCRIPCIONES ABIERTAS!</p>
                <p>🕒 Hora: 2:00 PM - 5:00 PM</p>
                <p>📍 Lugar: Capilla </p>
                <p>🎯 Tipo: Cultural</p>
              </>
            ))}>
              <img src={ludicaImg4} alt="Música" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Música y Artes</div>
            </div>
          </div>
        </div>

        <div className="UserCuadro UserEventos">
          <h3 className="UserTitulo">Eventos Semanales!</h3>
          <div className="UserTarjetas">
            <div className="UserTarjeta" onClick={() => abrirModal("Charla Motivacional", (
              <>
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 11:30 AM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
              </>
            ))}>
              <img src={EventoImg} alt="Charla" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Charla Motivacional</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Feria Del Cacao 🍫", (
              <>
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 3:00 PM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
              </>
            ))}>
              <img src={EventoImg2} alt="Cacao" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Feria Del Cacao</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Academia", (
              <>
                <p>📅 Fecha: 20 de junio 2025</p>
                <p>🕒 Hora: 10:00 AM - 3:00 PM</p>
                <p>📍 Lugar: Sala múltiple</p>
                <p>🎯 Tipo: Formativa</p>
              </>
            ))}>
              <img src={EventoImg3} alt="Academia" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Academia</div>
            </div>

            <div className="UserTarjeta" onClick={() => abrirModal("Feria del Emprendimiento", (
              <>
                <p>📅 Fecha: 25 de junio 2025</p>
                <p>🕒 Hora: 7:00 AM - 5:00 PM</p>
                <p>📍 Lugar: Ambiente de Software</p>
                <p>🎯 Tipo: Competencia</p>
              </>
            ))}>
              <img src={EventoImg4} alt="Emprendimiento" className="UserTarjetaImg" />
              <div className="UserTarjetaTexto">Feria del Emprendimiento</div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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
