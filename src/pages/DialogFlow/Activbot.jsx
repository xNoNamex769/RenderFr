import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Genera un sessionId único por usuario
  const sessionId = "user-session-1";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("actividad")) {
        const res = await axios.get("https://render-hhyo.onrender.com/api/actividad");

        const cards = res.data.map((a) => ({
          NombreActi: a.NombreActi,
          FechaInicio: a.FechaInicio,
          HoraInicio: a.HoraInicio,
          HoraFin: a.HoraFin,
          Ubicacion: a.Ubicacion,
          Imagen: a.Imagen,
        }));

        setMessages(prev => [...prev, { from: "bot", type: "cards", cards }]);
        setInput("");
        return;
      }

      // 2️⃣ Eventos
      if (lowerInput.includes("evento")) {
        const res = await axios.get("https://render-hhyo.onrender.com/api/evento");

        const cards = res.data.map((e) => ({
          NombreEvento: e.NombreEvento,
          FechaInicio: e.FechaInicio,
          FechaFin: e.FechaFin,
          HoraInicio: e.HoraInicio,
          HoraFin: e.HoraFin,
          UbicacionEvento: e.UbicacionEvento,
          ImagenEvento: e.PlanificacionEvento?.ImagenUrl,
          
        }));

        setMessages(prev => [...prev, { from: "bot", type: "eventCards", cards }]);
        setInput("");
        return;
      }

      // 3️⃣ Dialogflow para todo lo demás
      const res = await axios.post("https://render-hhyo.onrender.com/api/dialogflow", {
        message: input,
        sessionId,
      });

      const msgs = res.data?.fulfillmentMessages;
      if (!msgs || msgs.length === 0) {
        setMessages(prev => [...prev, { from: "bot", text: "🤖 No recibí respuesta del servidor." }]);
        setInput("");
        return;
      }

      const botMsgs = msgs.map((m) => {
        if (m.text) return { from: "bot", text: m.text.text[0] };
        if (m.card) return { from: "bot", text: `${m.card.title}\n${m.card.subtitle}` };
        return { from: "bot", text: "🤖 (sin respuesta reconocida)" };
      });

      setMessages(prev => [...prev, ...botMsgs]);
      setInput("");

    } catch (error) {
      console.error("⚠️ Error al conectar:", error);
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Error al conectar con el bot" }]);
      setInput("");
    }
  };

  return (
    <div className="chatdf-container">
      <div className="chatdf-box">
        {messages.map((m, i) => (
          <div key={i} className={`msgdf ${m.from}`}>
            {m.type === "cards" ? (
              <div className="cards-container">
                {m.cards.map((c, index) => (
                  <div key={index} className="card">
                    <img src={c.Imagen} alt={c.NombreActi} className="card-img"/>
                    <h4>{c.NombreActi}</h4>
                    <p>📅 {c.FechaInicio}</p>
                    <p>⏰ {c.HoraInicio} - {c.HoraFin}</p>
                    <p>📍 {c.Ubicacion || "No especificado"}</p>
                  </div>
                ))}
              </div>
            ) : m.type === "eventCards" ? (
              <div className="cards-container">
                {m.cards.map((c, index) => (
                  <div key={index} className="card">
                    <img src={c.ImagenEvento} alt={c.NombreEvento} className="card-img"/>
                    <h4>{c.NombreEvento}</h4>
                    <p>📅 {c.FechaInicio} - {c.FechaFin}</p>
                    <p>⏰ {c.HoraInicio} - {c.HoraFin}</p>
                    <p>📍 {c.UbicacionEvento}</p>
                  </div>
                ))}
              </div>
            ) : (
              <span>{m.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="chatdf-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatBot;
