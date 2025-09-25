import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/AprobarEventos.css"; // crea este archivo o usa uno existente
import PlanificacionesEventos from "./Admin/PlanificarEventosAdmin";
import { useNavigate } from "react-router-dom";


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
const [mostrarPlanificador, setMostrarPlanificador] = useState(false);
const abrirModal = (motivo: string) => {
  setMotivoActual(motivo || "No especificado");
  setModalAbierto(true);
};
const navigate = useNavigate();
const cerrarModal = () => {
  setModalAbierto(false);
};

  const cargarMisEventos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado.");
        return;
      }

      const res = await axios.get("https://render-hhyo.onrender.com/api/planificacionevento/mis-eventos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMisEventos(res.data);
      console.log(" Eventos recibidos:", res.data);

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
            <th>Evento</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Estado</th>
            <th>Gestionado por</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {misEventos.map((evento) => (
            <tr key={evento.IdPlanificarE}>
              <td>{evento.NombreEvento}</td>
              <td>{new Date(evento.FechaEvento).toLocaleDateString()}</td>
              <td>{evento.LugarDeEvento}</td>
              
<td>
  {evento.gestionEvento?.Aprobar === "Aprobado" ? (
    <span className="estado-aprobado">✅ Aprobado</span>
  ) : evento.gestionEvento?.Aprobar === "Pendiente" ? (
    <span className="estado-pendiente">⏳ Pendiente</span>
  ) : (
    <button
  className="btn-ver-rechazo"
  onClick={() => abrirModal(evento.gestionEvento?.MotivoRechazo || "Motivo no especificado")}
>
  ❌ Rechazado - Ver detalles
</button>
  )}
</td>
<td>
  {evento.gestionEvento?.gestionador
    ? `${evento.gestionEvento.gestionador.Nombre} ${evento.gestionEvento.gestionador.Apellido}`
    : "No asignado"}
</td>


              <td>
                {evento.ImagenEvento ? (
                  <img
                    src={`http://localhost:3001/uploads/${evento.ImagenEvento}`}
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
      {modalAbierto && (
  <div className="modal-overlay">
    <div className="modal-contenido">
      <h3>📌 Motivo del Rechazo</h3>
      <p>{motivoActual}</p>

      <button className="btn2apr" onClick={cerrarModal}>Cerrar</button>
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
