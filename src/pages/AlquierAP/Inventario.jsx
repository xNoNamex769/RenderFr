import React from "react";
import "./style/Inventario.css"


//  Esta función agrupa los elementos por tipo y cuenta los disponibles
const agruparPorTipo = (elementos) => {
  const resumen = {};

  elementos.forEach((el) => {
    if (el.disponible) {
      const tipo = el.tipo || "Otros";
      resumen[tipo] = (resumen[tipo] || 0) + 1;
    }
  });

  return resumen;
};

const InventarioResumen = ({ elementos = [] }) => {
  const resumen = agruparPorTipo(elementos);

  return (
    <section className="inventario-resumen">
      <h2>📋 Inventario actual</h2>
      <ul>
        {Object.entries(resumen).map(([tipo, cantidad], index) => (
          <li key={index}>
            <strong>{tipo}:</strong> {cantidad} disponibles
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InventarioResumen;
