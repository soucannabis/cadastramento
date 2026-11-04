import React from "react";

// Campos obrigatórios do pet (chave em pet_data -> rótulo exibido na mensagem de erro)
export const PET_REQUIRED_FIELDS = {
  especie: "Espécie do pet",
  raca: "Raça do pet",
  idade: "Idade do pet",
  sexo: "Sexo do pet",
};

// Retorna a lista de chaves obrigatórias vazias/inválidas em pet_data
export const getMissingPetFields = (petData) => {
  const data = petData || {};
  return Object.keys(PET_REQUIRED_FIELDS).filter((key) => {
    const value = data[key];
    if (key === "idade") {
      if (value === null || value === undefined || value === "") return true;
      const n = Number(value);
      return !Number.isInteger(n) || n < 0;
    }
    return value === null || value === undefined || String(value).trim() === "";
  });
};

// Monta o JSON final que será gravado em Users.pet_data
export const buildPetDataPayload = (petData) => {
  const data = petData || {};
  const text = (v) => {
    const s = v === null || v === undefined ? "" : String(v).trim();
    return s === "" ? null : s;
  };
  return {
    especie: text(data.especie),
    raca: text(data.raca),
    idade:
      data.idade === null || data.idade === undefined || data.idade === ""
        ? null
        : Number(data.idade),
    sexo: text(data.sexo),
    tipo_produto: text(data.tipo_produto),
    dosagem: text(data.dosagem),
  };
};

const PetDataInputs = ({ value, onChange, missingFields = [] }) => {
  const data = value || {};

  const setField = (key, newValue) => {
    onChange({ ...data, [key]: newValue });
  };

  const errClass = (key) =>
    missingFields.includes(key)
      ? "form-input input-login input-empty"
      : "form-input input-login";

  const radioGroup = (key, options) => (
    <div
      className={errClass(key)}
      id={`pet_${key}`}
      style={{ display: "flex", flexDirection: "row", gap: "10px" }}
    >
      {options.map((opt) => (
        <React.Fragment key={opt.value}>
          <input
            type="radio"
            className="btn-check"
            name={`pet_${key}`}
            id={`pet_${key}_${opt.value}`}
            value={opt.value}
            checked={data[key] === opt.value}
            onChange={() => setField(key, opt.value)}
          />
          <label
            className="btn btn-outline-primary radio-input"
            htmlFor={`pet_${key}_${opt.value}`}
            style={{ flex: 1, margin: 0 }}
          >
            <p style={{ margin: "10px" }}>{opt.label}</p>
          </label>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div>
      <h5 style={{ color: "#fff", textAlign: "center", margin: "20px 0" }}>
        Dados do pet
      </h5>

      <div className="mb-3">
        <label className="form-label">Espécie</label>
        {radioGroup("especie", [
          { value: "felino", label: "Felino" },
          { value: "canino", label: "Canino" },
        ])}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="pet_raca">
          Raça
        </label>
        <input
          className={errClass("raca")}
          placeholder="Digite a raça do pet"
          type="text"
          id="pet_raca"
          name="pet_raca"
          value={data.raca || ""}
          onChange={(e) => setField("raca", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="pet_idade">
          Idade (em anos)
        </label>
        <input
          className={errClass("idade")}
          placeholder="Somente o número"
          type="number"
          min="0"
          step="1"
          id="pet_idade"
          name="pet_idade"
          value={data.idade ?? ""}
          onChange={(e) => setField("idade", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Sexo</label>
        {radioGroup("sexo", [
          { value: "macho", label: "Macho" },
          { value: "femea", label: "Fêmea" },
        ])}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="pet_tipo_produto">
          Tipo de produto (opcional)
        </label>
        <input
          className="form-input input-login"
          placeholder="Ex.: óleo"
          type="text"
          id="pet_tipo_produto"
          name="pet_tipo_produto"
          value={data.tipo_produto || ""}
          onChange={(e) => setField("tipo_produto", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="pet_dosagem">
          Dosagem (opcional)
        </label>
        <input
          className="form-input input-login"
          placeholder="Ex.: 0,5 ml 2x ao dia"
          type="text"
          id="pet_dosagem"
          name="pet_dosagem"
          value={data.dosagem || ""}
          onChange={(e) => setField("dosagem", e.target.value)}
        />
      </div>
    </div>
  );
};

export default PetDataInputs;
