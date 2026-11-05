import React, { useEffect, useState } from "react";
import apiRequest from "../../modules/apiRequest";
import PetDataInputs, {
  PET_REQUIRED_FIELDS,
  getMissingPetFields,
  getMissingTreatmentReason,
  PET_TREATMENT_REASON_LABEL,
  buildPetDataPayload,
} from "../forms/PetDataInputs";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Página pública: /atualizar-dados-pet?ac=<uuid>
// Sem um parâmetro ac válido (UUID que exista em Users) o formulário não é exibido.
const UpdatePetData = () => {
  const associateCode = new URLSearchParams(window.location.search)
    .get("ac")
    ?.trim();
  const validFormat = !!associateCode && UUID_REGEX.test(associateCode);

  // loading | invalid | form | success
  const [status, setStatus] = useState(validFormat ? "loading" : "invalid");
  const [ownerName, setOwnerName] = useState(null);
  const [petData, setPetData] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!validFormat) return;
    let cancelled = false;
    apiRequest(`/api/pet-data/${associateCode}`, "", "GET")
      .then((res) => {
        if (cancelled) return;
        setOwnerName(res?.data?.name || null);
        setPetData(res?.data?.pet_data || {});
        setStatus("form");
      })
      .catch(() => {
        if (!cancelled) setStatus("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [associateCode, validFormat]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const missing = [
      ...getMissingPetFields(petData),
      ...getMissingTreatmentReason(petData),
    ];
    setMissingFields(missing);
    if (missing.length > 0) {
      const el = document.getElementById(`pet_${missing[0]}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setSubmitError(
        "Preencha os campos obrigatórios: " +
          missing.map((k) =>
          k === "motivo_tratamento"
            ? PET_TREATMENT_REASON_LABEL
            : PET_REQUIRED_FIELDS[k]
        ).join(", ")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(
        `/api/pet-data/${associateCode}`,
        { pet_data: buildPetDataPayload(petData) },
        "POST"
      );
      setStatus("success");
    } catch (error) {
      setSubmitError(
        error?.response?.status === 404
          ? "Link inválido."
          : "Não foi possível salvar os dados. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Página centralizada, só com o bloco do formulário (sem o layout dividido do sistema)
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        maxWidth: "none",
        margin: 0,
        minHeight: "100vh",
      }}
    >
      <div
        className="text-center"
        style={{ width: "100%", maxWidth: "500px", padding: "40px 20px" }}
      >
        <img
          src={import.meta.env.VITE_ASSOCIATION_LOGO}
          alt={import.meta.env.VITE_ASSOCIATION_NAME}
          style={{ width: "150px", marginBottom: "20px" }}
        />

        {status === "loading" && (
          <p style={{ color: "#fff" }}>carregando...</p>
        )}

        {status === "invalid" && (
          <div className="alert alert-danger" role="alert">
            Link inválido. Use o link enviado para o seu e-mail.
          </div>
        )}

        {status === "success" && (
          <div className="alert alert-success" role="alert">
            Dados do pet atualizados com sucesso. Obrigado!
          </div>
        )}

        {status === "form" && (
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <h1
              className="sub-title"
              style={{ color: "#fff", textAlign: "center" }}
            >
              Atualizar dados do pet
            </h1>
            {ownerName && (
              <h6 style={{ color: "#fff", textAlign: "center" }}>
                Olá, {ownerName}! Informe os dados do seu pet abaixo.
              </h6>
            )}

            <PetDataInputs
              value={petData}
              onChange={setPetData}
              missingFields={missingFields}
              showTreatmentReason
            />

            {submitError && (
              <div className="alert alert-danger" role="alert">
                {submitError}
              </div>
            )}

            <button
              className="btn btn-success btn-lg"
              type="submit"
              disabled={isSubmitting}
              style={{ width: "100%", fontWeight: "bold", marginTop: "10px" }}
            >
              {isSubmitting ? "Enviando..." : "Enviar dados"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePetData;
