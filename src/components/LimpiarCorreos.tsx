import React, { useState } from "react";
import stringSimilarity from "string-similarity";
import style from "./LimpiarCorreos.module.css";

function LimpiarCorreos() {
  const [correos, setCorreos] = useState<string>("");
  const [correosLimpios, setCorreosLimpios] = useState<string[]>([]);
  const [correosEliminados, setCorreosEliminados] = useState<string[]>([]);
  const [umbral, setUmbral] = useState<number>(0.8);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCorreos(event.target.value);
  };

  const handleUmbralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUmbral(parseFloat(event.target.value));
  };

  const limpiarCorreos = () => {
    const correosArray = correos
      .split("\n")
      .map((correo) => correo.toLowerCase());
    const correosLimpiosArray: string[] = [];
    const correosEliminadosArray: string[] = [];
    correosArray.forEach((correo) => {
      if (
        !correosLimpiosArray.some(
          (correoLimpio) =>
            stringSimilarity.compareTwoStrings(correo, correoLimpio) > umbral
        )
      ) {
        correosLimpiosArray.push(correo);
      } else {
        correosEliminadosArray.push(correo);
      }
    });
    setCorreosLimpios(correosLimpiosArray);
    setCorreosEliminados(correosEliminadosArray);
  };

  const copiarCorreosLimpios = () => {
    const texto = correosLimpios.join("\n");
    navigator.clipboard.writeText(texto);
  };

  const copiarCorreosEliminados = () => {
    const texto = correosEliminados.join("\n");
    navigator.clipboard.writeText(texto);
  };

  return (
    <div className={style.container}>
      <h1>Utilidad para limpiar correos electrónicos</h1>
      <div className={style.container__utility}>
        <div className={style.input}>
          <textarea
            className={style.input__textarea}
            value={correos}
            onChange={handleInputChange}
          />
          <button className={style.input__button} onClick={limpiarCorreos}>
            Limpiar
          </button>
          <p className={style.input__notice}>
            Mientras mayor sea el valor es probable que se filtren menos correos
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={umbral}
            onChange={handleUmbralChange}
            className={style.input__umbral}
          />
        </div>
        <div className={style.emails}>
          {correosLimpios.length > 0 && (
            <div className={style.emails__filtered}>
              <h2>Correos electrónicos filtrados:</h2>
              <button
                className={style.emails__button}
                onClick={copiarCorreosLimpios}
              >
                Copiar
              </button>
              <ul>
                {correosLimpios.map((correo, index) => (
                  <li key={index}>{correo}</li>
                ))}
              </ul>
            </div>
          )}
          {correosEliminados.length > 0 && (
            <div className={style.emails__erased}>
              <h2>Correos electrónicos eliminados por similitud:</h2>
              <button
                className={style.emails__button}
                onClick={copiarCorreosEliminados}
              >
                Copiar
              </button>
              <ul>
                {correosEliminados.map((correo, index) => (
                  <li key={index}>{correo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LimpiarCorreos;
