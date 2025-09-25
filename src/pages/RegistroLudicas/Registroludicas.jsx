import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./style/RegistroLudicas.css";
import cuadradoImg from "../RegistroActividades/img/cuadrado.jpg";

const RegistroLudica = () => {
  const [form, setForm] = useState({
    NombreActi: "",
    Descripcion: "",
    Fecha: "",
    HoraInicio: "",
    HoraFin: "",
    TipoLudica: "Recreativa",
    Ubicacion: "",
    HorarioContinuo: false,
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(cuadradoImg);
  const [showModal, setShowModal] = useState(false);
  const [actividadCreada, setActividadCreada] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.HoraInicio >= form.HoraFin) {
      alert("La hora de inicio debe ser menor que la de fin.");
      return;
    }

    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);

    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const IdUsuario = decoded?.IdUsuario;

    const formData = new FormData();
    formData.append("NombreActi", form.NombreActi);
    formData.append("Descripcion", form.Descripcion);
    formData.append("FechaInicio", form.Fecha);
    formData.append("FechaFin", form.Fecha);
    formData.append("HoraInicio", form.HoraInicio);
    formData.append("HoraFin", form.HoraFin);
    formData.append("TipoLudica", form.TipoLudica);
    formData.append("Ubicacion", form.Ubicacion);
    formData.append("IdUsuario", IdUsuario);
    formData.append("HorarioContinuo", form.HorarioContinuo ? "true" : "false");

    // 👇 este nombre debe coincidir con upload.single("Imagen")
    if (imagen) {
      formData.append("Imagen", imagen);
    }

    try {
      const response = await axios.post("https://render-hhyo.onrender.com/api/ludica", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Lúdica registrada con éxito");
      setActividadCreada(response.data.actividad);
    } catch (error) {
      console.error("❌ Error al registrar lúdica:", error);
      alert("Hubo un error al registrar la lúdica.");
    }
  };

  return (
    <div className="activity-wrapper">
      <div className="activity-container">
        <h2>Registro de Lúdica</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre
            <input type="text" name="NombreActi" value={form.NombreActi} onChange={handleChange} required />
          </label>

          <label>
            Descripción
            <textarea name="Descripcion" value={form.Descripcion} onChange={handleChange} required />
          </label>

          <label>
            Fecha
            <input type="date" name="Fecha" value={form.Fecha} onChange={handleChange} required />
          </label>

          <div className="registro-checkbox-unico">
            <input
              type="checkbox"
              name="HorarioContinuo"
              checked={form.HorarioContinuo}
              onChange={handleChange}
            />
            <span>¿Es un horario continuo?</span>
          </div>

          <div className="time-container">
            <label>
              Hora de inicio
              <input type="time" name="HoraInicio" value={form.HoraInicio} onChange={handleChange} required />
            </label>
            <label>
              Hora de fin
              <input type="time" name="HoraFin" value={form.HoraFin} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Tipo de lúdica
            <select name="TipoLudica" value={form.TipoLudica} onChange={handleChange}>
              <option value="Recreativa">Recreativa</option>
              <option value="Cultural">Cultural</option>
              <option value="Deportiva">Deportiva</option>
            </select>
          </label>

          <label>
            Ubicación
            <input type="text" name="Ubicacion" value={form.Ubicacion} onChange={handleChange} required />
          </label>

          {/* Sección de imagen */}
          <div className="image-container" style={{ marginTop: "20px", textAlign: "center" }}>
            <img
              src={preview}
              alt="Vista previa"
              className="preview-image"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            {/* 👇 name corregido a "Imagen" */}
            <input type="file" name="Imagen" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit">Registrar Lúdica</button>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirma los datos</h3>
            <p><strong>Nombre:</strong> {form.NombreActi}</p>
            <p><strong>Descripción:</strong> {form.Descripcion}</p>
            <p><strong>Fecha:</strong> {form.Fecha}</p>
            <p><strong>Hora:</strong> {form.HoraInicio} - {form.HoraFin}</p>
            <p><strong>Ubicación:</strong> {form.Ubicacion}</p>
            <p><strong>Tipo:</strong> {form.TipoLudica}</p>
            <p><strong>Horario continuo:</strong> {form.HorarioContinuo ? "Sí" : "No"}</p>
            <button onClick={handleConfirm}>Aceptar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {actividadCreada && (
        <div className="qr-section">
          <h3>Código QR de Entrada</h3>
          <QRCodeCanvas value={actividadCreada.CodigoQR} size={200} />

          <h3>Código QR de Salida</h3>
          <QRCodeCanvas value={actividadCreada.CodigoQRSalida} size={200} />

          {/* 👇 aquí puedes mostrar la imagen subida */}
          {actividadCreada.ImagenUrl && (
            <div style={{ marginTop: "20px" }}>
              <h3>Imagen de la Lúdica</h3>
              <img
                src={actividadCreada.ImagenUrl}
                alt="Lúdica subida"
                style={{ width: "200px", borderRadius: "10px" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistroLudica;
