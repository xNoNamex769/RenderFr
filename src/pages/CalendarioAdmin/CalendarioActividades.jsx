import React, { useState, useEffect } from 'react';
import './style/Calendario.css';
import fondo4 from './img/fondo4.jpg';
import { FaBell } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const CalendarioAp = () => {
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedNotifications, setClickedNotifications] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [usuarios, setUsuarios] = useState([]);

  // Cambiar de mes
  const irAlMesAnterior = () => {
    const nuevaFecha = new Date(currentDate);
    nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    setCurrentDate(nuevaFecha);
  };

  const irAlMesSiguiente = () => {
    const nuevaFecha = new Date(currentDate);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    setCurrentDate(nuevaFecha);
  };

  // Cargar usuarios + actividades + eventos
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const token = localStorage.getItem("token");

        // Primero usuarios
        const resUsuarios = await axios.get("https://render-hhyo.onrender.com/api/usuario", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(resUsuarios.data);

        // Luego actividades y eventos en paralelo
        const [resActividades, resEventos] = await Promise.all([
          axios.get("https://render-hhyo.onrender.com/api/actividad"),
          axios.get("https://render-hhyo.onrender.com/api/evento/publicos"),
        ]);

        // Map actividades
        const actividades = resActividades.data.map(actividad => {
          const fechaCompleta = new Date(actividad.FechaInicio);
          return {
            id: `a-${actividad.IdActividad}`,
            title: actividad.NombreActi,
            image: actividad.Imagen?.startsWith("http")
              ? actividad.Imagen
              : actividad.Imagen
              ? `http://localhost:3001/uploads/${actividad.Imagen}`
              : fondo4,
            applicant: actividad.Organizador || "SENA",
            location: actividad.Ubicacion,
            fullDate: fechaCompleta,
            date: fechaCompleta.toLocaleDateString('es-ES'),
            time: `${actividad.HoraInicio} - ${actividad.HoraFin}`,
            description: actividad.Descripcion,
            contact: "contacto@sena.edu.co",
            day: fechaCompleta.getDate(),
            asistio: false,
            feedbackDado: false,
            tipo: "actividad"
          };
        });

        // Map eventos
        const eventos = resEventos.data.map(evento => {
          const usuario = resUsuarios.data.find(u => u.IdUsuario === evento.IdUsuario);
          const fechaCompleta = new Date(evento.FechaInicio);
          return {
            id: `e-${evento.IdEvento}`,
            title: evento.NombreEvento,
            image: evento.Imagen?.startsWith("http")
              ? evento.Imagen
              : evento.Imagen
              ? `http://localhost:3001/uploads/${evento.Imagen}`
              : fondo4,
            applicant: usuario ? usuario.NombreCompleto : 'Desconocido',
            location: evento.UbicacionEvento,
            fullDate: fechaCompleta,
            date: fechaCompleta.toLocaleDateString('es-ES'),
            time: `${evento.HoraInicio} - ${evento.HoraFin}`,
            description: evento.DescripcionEvento,
            contact: "contacto@sena.edu.co",
            day: fechaCompleta.getDate(),
            asistio: false,
            feedbackDado: false,
            tipo: "evento"
          };
        });

        // Unir todo
        const todos = [...actividades, ...eventos];
        const mesActual = currentDate.getMonth();
        const añoActual = currentDate.getFullYear();
        const filtrados = todos.filter(
          e => e.fullDate.getMonth() === mesActual && e.fullDate.getFullYear() === añoActual
        );

        setEvents(filtrados);
        setCalendarEvents(filtrados.map(e => ({
          day: e.day,
          title: e.title,
          eventId: e.id
        })));
      } catch (err) {
        console.error("Error al cargar datos completos:", err);
      }
    };

    cargarTodo();
  }, [currentDate]);

  // Notificaciones
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Abrir modal
  const openEventModal = (event) => {
    setSelectedEvent(event);
    setShowInfoModal(true);
    localStorage.setItem("lastSeenActividadId", event.id);
  };

  // Click notificación
  const handleNotificationClick = (eventId) => {
    setClickedNotifications((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  // Confirmar asistencia
  const confirmarAsistencia = async (eventoId) => {
    const idNum = Number(eventoId.toString().replace(/^[ae]-/, ''));
    const IdUsuario = Number(localStorage.getItem("usuarioId"));
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        'https://render-hhyo.onrender.com/api/relusuarioevento/confirmar-asistencia',
        { IdUsuario, IdEvento: idNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Si no asistes tendrás una penalización, tendrás un límite de uso de la plataforma.',
        confirmButtonText: 'Aceptar',
      });

      const nuevosEventos = events.map(ev =>
        ev.id === eventoId ? { ...ev, asistio: true } : ev
      );
      setEvents(nuevosEventos);

      if (selectedEvent && selectedEvent.id === eventoId) {
        setSelectedEvent(prev => ({ ...prev, asistio: true }));
      }
    } catch (err) {
      console.error("Error al confirmar asistencia:", err);
      alert("Error al confirmar asistencia");
    }
  };

  // Renderizar días del calendario
  const renderCalendarDays = () => {
    const days = [];
    const diasEnMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let primerDiaSemana = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    for (let i = 0; i < primerDiaSemana; i++) {
      days.push(<div key={`empty-${i}`} className="cal-dia-vacio"></div>);
    }

    for (let i = 1; i <= diasEnMes; i++) {
      const event = calendarEvents.find((e) => e.day === i);
      const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
      if (event) {
        const fullEvent = events.find((e) => e.id === event.eventId);
        const isClicked = clickedNotifications.includes(fullEvent.id);
        days.push(
          <div key={`day-${i}`} className={`cal-dia cal-evento ${isToday ? 'cal-hoy' : ''}`}>
            <div onClick={() => openEventModal(fullEvent)} className="cal-dia-clickable">
              <span className="cal-dia-numero">{i}</span>
              <span className="cal-nombre-evento">{event.title}</span>
            </div>
            <FaBell
              className={`cal-noti-icon ${isClicked ? 'cal-clicked' : ''}`}
              onClick={() => handleNotificationClick(fullEvent.id)}
              title="Notificación"
            />
          </div>
        );
      } else {
        days.push(
          <div key={i} className="cal-dia">
            <span className="cal-dia-numero">{i}</span>
          </div>
        );
      }
    }

    return days;
  };

  return (
    <div className="cal-admin-container">
      <main className="cal-main-content">
        <header className="cal-app-header">
          <h1 className="cal-app-title">
            Calendario de Actividades y Eventos <span className="cal-sena-text">SENA</span>
          </h1>

          {/* Botón de notificaciones */}
          <button className={`cal-notifications-btn ${showNotifications ? 'cal-active' : ''}`} onClick={toggleNotifications}>
            <i className="cal-bell-icon">🔔</i>
            <span className="cal-notification-badge">{events.length}</span>
          </button>

          {/* Panel de notificaciones */}
          {showNotifications && (
            <div className="cal-notifications-panel">
              <div className="cal-notifications-header">
                <h2>Notificaciones</h2>
                <button className="cal-close-notifications" onClick={toggleNotifications}>&times;</button>
              </div>
              <div className="cal-notifications-list">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="cal-notification-item"
                    onClick={() => {
                      openEventModal(event);
                      setShowNotifications(false);
                    }}
                  >
                    <img src={event.image} alt={event.title} className="cal-notification-img" />
                    <div className="cal-notification-content">
                      <h3>{event.title}</h3>
                      <p>{event.date} - {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Calendario principal */}
        <section className="cal-calendar-section">
          <div className="cal-calendar-container">
            <div className="cal-calendar-controls">
              <button className="cal-month-btn cal-prev-month" onClick={irAlMesAnterior}>◀️</button>
              <h3 className="cal-current-month">
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
              </h3>
              <button className="cal-month-btn cal-next-month" onClick={irAlMesSiguiente}>▶️</button>
            </div>
            <div className="cal-calendar-grid">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="cal-week-day">{day}</div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        </section>
      </main>

      {/* Modal informativo */}
      {showInfoModal && selectedEvent && (
        <div className="cal-modal-overlay">
          <div className="cal-event-modal-container">
            <button className="cal-modal-close" onClick={() => setShowInfoModal(false)}>&times;</button>
            <h2 className="cal-event-modal-title">{selectedEvent.title}</h2>
            <div className="cal-event-modal-content">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="cal-event-modal-image" />
              <div className="cal-event-details">
                <p><strong>Tipo:</strong> {selectedEvent.tipo === "actividad" ? "Actividad" : "Evento"}</p>
                <div className="cal-event-participation">
                  {!selectedEvent.asistio ? (
                    <button className="cal-btn-confirmar" onClick={() => confirmarAsistencia(selectedEvent.id)}>
                      ✔ Asistiré
                    </button>
                  ) : (
                    <span className="cal-asistencia-confirmada">✅ Pre Asistencia confirmada</span>
                  )}

                  {!selectedEvent.feedbackDado && selectedEvent.asistio && (
                    <button className="cal-btn-feedback" onClick={() => setShowFeedback(true)}>
                      💬 Dar feedback
                    </button>
                  )}
                </div>
                <p><strong>Fecha:</strong> {selectedEvent.date}</p>
                <p><strong>Lugar:</strong> {selectedEvent.location}</p>
                <p><strong>Contacto:</strong> {selectedEvent.contact}</p>
                {selectedEvent.tipo === "actividad" ? (
                  <p><strong>Solicitante:</strong> {selectedEvent.applicant}</p>
                ) : (
                  <p><strong>Creado por:</strong> {selectedEvent.applicant}</p>
                )}
                <p>{selectedEvent.description}</p>

                {showFeedback && (
                  <div className="cal-modal-overlay">
                    <div className="cal-event-modal-container">
                      <button className="cal-modal-close" onClick={() => setShowFeedback(false)}>&times;</button>
                      <h2 className="cal-event-modal-title">Feedback del evento</h2>
                      <div className="cal-event-modal-content">
                        <label>Calificación (1-5):</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                        />
                        <label>Comentario:</label>
                        <textarea
                          rows="4"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            const nuevosEventos = events.map(ev =>
                              ev.id === selectedEvent.id ? { ...ev, feedbackDado: true } : ev
                            );
                            setEvents(nuevosEventos);
                            setSelectedEvent((prev) => ({ ...prev, feedbackDado: true }));
                            setShowFeedback(false);
                            setFeedbackText("");
                            setFeedbackRating(5);
                          }}
                        >
                          Enviar feedback
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioAp;
