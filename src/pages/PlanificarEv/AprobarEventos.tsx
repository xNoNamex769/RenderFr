import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/AprobarEventos.css";
import { useNavigate } from "react-router-dom";

// Interfaces
interface Usuario {
  Nombre: string;
  Apellido: string;
  Correo: string;
}

interface GestionEvento {
  Aprobar: string;
  MotivoRechazo?: string;
  gestionador?: Usuario;
}

interface Evento {
  IdPlanificarE: number;
  NombreEvento: string;
  FechaEvento: string;
  LugarDeEvento: string;
  ImagenEvento?: string;
  gestionEvento: GestionEvento;
  usuario: Usuario;
}

const MisEventos: React.FC = () => {
  const [misEventos, setMisEventos] = useState<Evento[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [motivoActual, setMotivoActual] = useState("");
  const navigate = useNavigate();

  // 🔹 Abrir modal
  const abrirModal = (motivo: string) => {
    setMotivoActual(motivo || "No especificado");
    setModalAbierto(true);
  };

  // 🔹 Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
  };

  // 🔹 Cargar eventos del usuario
  const cargarMisEventos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado.");
        return;
      }

      const res = await axios.get(
        "https://render-hhyo.onrender.com/api/planificacionevento/mis-eventos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMisEventos(res.data);
      console.log("✅ Eventos recibidos:", res.data);
    } catch (error) {
      console.error("❌ Error al cargar mis eventos", error);
    }
  };

  useEffect(() => {
    cargarMisEventos();
  }, []);

  return (
    <div className="mis-eventos-container">
      <h2 className="mis-eventos-title">📋 Mis eventos planificados</h2>

      <table className="mis-eventos-tabla">
        <thead>
          <tr>
            <th className="th-text">Evento</th>
            <th className="th-text">Fecha</th>
            <th className="th-text">Lugar</th>
            <th className="th-text">Gestionado por</th>
            <th className="th-text">Estado</th>
            <th className="th-text">Imagen</th>
          </tr>
        </thead>
        <tbody>
          {misEventos.map((evento) => (
            <tr key={evento.IdPlanificarE}>
              <td>{evento.NombreEvento}</td>
              <td>{new Date(evento.FechaEvento).toLocaleDateString()}</td>
              <td>{evento.LugarDeEvento}</td>

              {/* Estado del evento */}
              <td>
                {evento.gestionEvento?.Aprobar === "Aprobado" ? (
                  <span className="estado-aprobado">✅ Aprobado</span>
                ) : evento.gestionEvento?.Aprobar === "Pendiente" ? (
                  <span className="estado-pendiente">⏳ Pendiente</span>
                ) : (
                  <button
                    className="btn-ver-rechazo"
                    onClick={() =>
                      abrirModal(
                        evento.gestionEvento?.MotivoRechazo ||
                          "Motivo no especificado"
                      )
                    }
                  >
                    ❌ Rechazado - Ver detalles
                  </button>
                )}
              </td>

              {/* Gestionador */}
              <td>
                {evento.gestionEvento?.gestionador
                  ? `${evento.gestionEvento.gestionador.Nombre} ${evento.gestionEvento.gestionador.Apellido}`
                  : "No asignado"}
              </td>

              {/* Imagen */}
              <td>
                {evento.ImagenEvento ? (
                  <img
                    src={
                      evento.ImagenEvento.startsWith("http")
                        ? evento.ImagenEvento // ✅ Cloudinary o URL externa
                        : `https://render-hhyo.onrender.com/uploads/${evento.ImagenEvento}` // ✅ Render backend
                    }
                    alt="Evento"
                    className="miniatura-img"
                  />
                ) : (
                  "Sin imagen"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de rechazo */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>📌 Motivo del Rechazo</h3>
            <p>{motivoActual}</p>

            <button className="btn2apr" onClick={cerrarModal}>
              Cerrar
            </button>
            <button className="btn1apr" onClick={() => navigate("/planevento")}>
              Planificar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisEventos;
