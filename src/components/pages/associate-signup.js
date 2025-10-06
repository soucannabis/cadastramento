import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import apiRequest from "../../modules/apiRequest";
import { useUser } from "../../contexts/UserContext";
import GenderInput from "../forms/GenderInput";
import NationalityInput from "../forms/NationalityInput";
import LabelInfo from "../pages/elements/labelInfo";
import AlertError from "../forms/AlertError";
import Modal from "react-bootstrap/Modal";
import PhoneInputs from "../forms/PhoneNumberInput";
import Ciap2Select from "../forms/CIAP2Select";
import { useFormLocalStorage } from "../../hooks/useLocalStorage";

const AssociateSignUp = () => {
  const { user } = useUser();
  const [inputError, setInputError] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const [validateForm, setValidateForm] = useState();
  const [cpfError, setCpfError] = useState(false);
  const [cpfNotValid, setCpfNotValid] = useState(false);
  const [cepError, setcepError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);
  const handleCloseTreatmentModal = () => setShowTreatmentModal(false);
  const handleShowTreatmentModal = () => setShowTreatmentModal(true);
  const [passError, setPassError] = useState(false);
  const [ciapError, setCiapError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  // Dados iniciais do formulário
  const initialFormData = {
    responsable_type: null,
    name_associate: null,
    lastname_associate: null,
    birthday_associate: null,
    gender: null,
    nationality: null,
    cpf_associate: null,
    rg_associate: null,
    emiiter_rg_associate: null,
    marital_status: null,
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    cep: null,
    reason_treatment: null,
    mobile_number: null,
    reason_treatment_text: null,
    pass_account: null,
    met_us: null,
  };

  // Hook para gerenciar o localStorage do formulário
  const [
    formData,
    setFormData,
    updateField,
    updateMultipleFields,
    resetForm,
    clearFormData
  ] = useFormLocalStorage("associate_signup", initialFormData);
  const [counterTratmentOptions, setCounterTratment] = useState(false);
  const [counterCheck, setCounterCheck] = useState(false);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (formData.reason_treatment && formData.reason_treatment.length > 10) {
      setCounterCheck(true);
    } else {
      setCounterCheck(false);
    }
  }, [formData]);

  if (user.associate_status > 3) {
    window.location.assign("/");
  }

  const [phone, setPhone] = useState("");

  const handleOnChange = (value, country) => {
    setPhone(value);
  };

  const handleChangeInput = (event) => {
    // Atualiza o campo específico no localStorage
    updateField(event.target.name, event.target.value);
  };

  const handleSelectionChange = (event) => {
    // Atualiza o campo reason_treatment no localStorage
    // Se for um array (seleção múltipla), usa diretamente
    // Se for um evento, extrai o valor
    const value = Array.isArray(event) ? event : event.target?.value || event;
    updateField("reason_treatment", value);
  };

  function counter() {
    setCounterTratment(true);
  }

  const handleChangeInputPhone = (event) => {
    // Extrai apenas o valor do evento, não o evento completo
    const value =
      typeof event === "string" ? event : event.target?.value || event;
    updateField("mobile_number", value);
    setInputError(false);
  };
  const handleChoice = (choice) => {
    handleClose();
  };

  const responsable_himself = (event) => {
    var responsableType = event.target.value;
    updateField("responsable_type", responsableType);
  };

  const responsable_another = (event) => {
    var responsableType = event.target.value;
    updateField("responsable_type", responsableType);
  };

  const responsable_pet = (event) => {
    var responsableType = event.target.value;
    updateField("responsable_type", responsableType);
  };

  const statesData = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  const updateUser = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    var emptyFields = [];
    var fieldsNames = [];   

    for (let key in formData) {      
      if (formData.hasOwnProperty(key)) {
        if (
          formData[key] == null ||
          formData[key] == undefined ||
          formData[key] == "" ||
          formData[key] == []
        ) {
          if (key != "complement" && key != "associate_status") {
            emptyFields.push(key);
            fieldsNames.push(key);
          }
          if (
            key != "mobile_number" &&
            key != "status" &&
            key != "associate_status" &&
            key != "reason_treatment" &&
            key != "complement" &&
            key != "log"
          ) {
            document.querySelector("#" + key).className =
              "form-input input-login input-empty";
          }
        } else {
          if (
            key != "mobile_number" &&
            key != "status" &&
            key != "associate_status" &&
            key != "reason_treatment" &&
            key != "complement" &&
            key != "log"
          ) {
            document.querySelector("#" + key).className =
              "form-input input-login";
          }
        }

        if (
          !formData.reason_treatment ||
          formData.reason_treatment.length < 1
        ) {
          document.querySelector(".select-treatment").className =
            "form-input input-login select-treatment input-empty";
          // Mostra o modal para o campo de motivo do tratamento apenas se for o único campo vazio
          if (emptyFields.length === 1 && emptyFields.includes("reason_treatment")) {
            setShowTreatmentModal(true);
          }
        } else {
          document.querySelector(".select-treatment").className =
            "select-treatment form-input input-login";
        }
      }
    }

    const translations = {
      responsable_type: "Tipo de responsável",
      name_associate: "Nome do associado",
      lastname_associate: "Sobrenome do associado",
      birthday_associate: "Data de nascimento",
      gender: "Gênero",
      nationality: "Nacionalidade",
      cpf_associate: "CPF",
      rg_associate: "RG",
      emiiter_rg_associate: "Órgão emissor",
      marital_status: "Estado civil",
      mobile_number: "Telefone",
      pass_account: "Senha da conta",
      street: "Rua",
      number: "Número",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "Estado",
      cep: "CEP",
      reason_treatment: "Motivo do tratamento",
      reason_treatment_text: "Motivo do tratamento com suas palavras",
      met_us: "Como nos conheceu",
    };

    let translatedFields = [];

    fieldsNames.map((field) => {
      if (translations[field]) {
        translatedFields.push(translations[field]);
      }
    });

    let translatedFieldsString = translatedFields.join(", ");

    setEmptyFieldsMessage(translatedFieldsString);
    if (emptyFields != []) {
      setValidateForm(true);
    } else {
      setValidateForm(false);
    }

    const validateCPF = formData.cpf_associate;
    if (validateCPF && validateCPF.includes("_")) {
      setCpfError(true);
      setTimeout(() => {
        setCpfError(false);
      }, 6000);

      emptyFields.push("cpf_associate");
    } else {
      function realCPF(cpf) {
        if (formData.cpf_associate) {
          cpf = cpf.replace(/[^\d]+/g, "");
          if (cpf.length !== 11) return false;

          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let resto = 11 - (soma % 11);
          let digito1 = resto === 10 || resto === 11 ? 0 : resto;

          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
          }
          resto = 11 - (soma % 11);
          let digito2 = resto === 10 || resto === 11 ? 0 : resto;

          return (
            parseInt(cpf.charAt(9)) === digito1 &&
            parseInt(cpf.charAt(10)) === digito2
          );
        }
      }

      if (!realCPF(validateCPF)) {
        if (formData.cpf_associate) {
          emptyFields.push("cpf_associate");
          setCpfNotValid(true);
          setTimeout(() => {
            setCpfNotValid(false);
          }, 6000);
        }
      }
    }

    const pass = formData.pass_account;
    if (formData.pass_account && pass.length <= 5) {
      setPassError(true);
      setTimeout(() => {
        setPassError(false);
      }, 6000);

      emptyFields.push("pass");
    }

    // Validação do telefone
    const validatePhone = formData.mobile_number;
    if (validatePhone && typeof validatePhone === "string") {
      const phoneDigits = validatePhone.replace(/\D/g, "");
      if (phoneDigits.length !== 13) {
        setPhoneError(true);
        setTimeout(() => {
          setPhoneError(false);
        }, 6000);

        emptyFields.push("mobile_number");
      }
    }

    // Validação do CEP
    const validateCEP = formData.cep;
    if (validateCEP && validateCEP.includes("_")) {
      setcepError(true);
      setTimeout(() => {
        setcepError(false);
      }, 6000);

      emptyFields.push("cep");
    }

    setFieldsError(true);
    setTimeout(() => {
      setFieldsError(false);
    }, 6000);

    // Move a página para o primeiro campo vazio
    if (emptyFields.length > 0) {
      const firstEmptyField = emptyFields[0];
      const element = document.getElementById(firstEmptyField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (emptyFields == "" || emptyFields == []) {
      setFieldsError(false);
      // Cria uma cópia limpa do formData para envio
      const cleanFormData = {
        ...formData,
        status: "registered",
        log: "Registered OK",
      };

      if (
        cleanFormData.reason_treatment &&
        cleanFormData.reason_treatment.length > 10
      ) {
        setCiapError(true);
        setTimeout(() => {
          setCiapError(false);
        }, 6000);
        setIsSubmitting(false);
        return;
      } else {
        // ✅ Verificar se userId existe antes de fazer update
        if (!user?.id) {
          console.error('❌ AssociateSignUp: User ID não encontrado, não é possível fazer update');
          setInputError(true);
          setIsSubmitting(false);
          return;
        }

        try {
          cleanFormData.associate_status = 3;
          
          const response = await apiRequest(
            "/api/directus/update",
            { userId: user.id, formData: cleanFormData },
            "POST"
          );
          
        } catch (error) {
          console.error("API Error (success case):", error);
          console.error("Error details:", {
            message: error.message,
            status: error.status,
            response: error.response,
          });
        }

        if (formData.responsable_type == "another") {
          window.location.assign("/cadastro-paciente");
        } else {
          window.location.assign("/documentos");
        }
      }
    } else {
      // ✅ Verificar se userId existe antes de fazer update
      if (!user?.id) {
        console.error('❌ AssociateSignUp: User ID não encontrado para update de erro');
        setInputError(true);
        setIsSubmitting(false);
        return;
      }

      try {
        formData.associate_status = 0;
        const cleanFormDataWithError = {
          ...formData, // Inclui todos os dados do formulário
          status: "formerror",
          log: { formError: { emptyFields: emptyFields } },
        };

        const response = await apiRequest(
          "/api/directus/update",
          {
            userId: user.id,
            formData: cleanFormDataWithError,
          },
          "POST"
        );
        
      } catch (error) {
        console.error("API Error (form error case):", error);
        console.error("Error details:", {
          message: error.message,
          status: error.status,
          response: error.response,
        });
      }
      setIsSubmitting(false);
      return;
    }

    // Sempre desabilita o estado de envio no final
    setIsSubmitting(false);
  };

  function scrollDown() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  return (
    <div>
      {counterTratmentOptions && (
        <div
          className="fixed-div"
          style={
            !counterCheck
              ? { backgroundColor: "" }
              : { backgroundColor: "red", color: "white" }
          }
        >
          <div style={{ textAlign: "center" }}>
            Você pode selecionar até <b>10</b> motivos
            {formData.reason_treatment ? (
              <h5 style={{ marginTop: "7px" }}>
                {formData.reason_treatment.length}/10
              </h5>
            ) : (
              <h5>0/10</h5>
            )}
            <a className="btn btn-primary btn-sm" onClick={scrollDown}>
              Continuar{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-down-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <form onSubmit={updateUser} className="form-container ">
        <h1>Você é responsável pelo seu próprio tratamento?</h1>
        <h6
          style={{
            color: "#fff",
            marginBottom: "30px",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          Selecione a baixo a opção que se enquadra em sua situação.
        </h6>
        <br></br>
        <div className="form-input input-login" id="responsable_type">
          <input
            type="radio"
            className="btn-check"
            onChange={responsable_himself}
            name="responsable_type"
            id="btnradio1"
            value="himself"
            checked={formData.responsable_type === "himself"}
          />
          <label
            className="btn btn-outline-primary radio-input"
            htmlFor="btnradio1"
          >
            <span
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "18px", marginTop: "20px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <mask id="ipSPeople0">
                    <path
                      fill="#fff"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M24 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14ZM6 40.8V42h36v-1.2c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C35.92 28 33.68 28 29.2 28H18.8c-4.48 0-6.72 0-8.432.872a8 8 0 0 0-3.496 3.496C6 34.08 6 36.32 6 40.8Z"
                    />
                  </mask>
                  <path                   
                    d="M0 0h48v48H0z"
                    mask="url(#ipSPeople0)"
                  />
                </svg>
              </span>
              <p style={{ marginLeft: "15px", marginTop: "10px" }}>
                Sim, sou responsável pelo MEU PRÓPRIO tratamento
              </p>
            </span>
          </label>
          <input
            type="radio"
            className="btn-check"
            onChange={responsable_another}
            name="responsable_type"
            id="btnradio2"
            value="another"
            checked={formData.responsable_type === "another"}
          />
          <label
            className="btn btn-outline-primary radio-input"
            htmlFor="btnradio2"
          >
            <span
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "18px", marginTop: "20px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                  fill="#000000"
                >
                  <path
                    fill="#000000"
                    d="M17 24c3.867 0 7-3.133 7-7s-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7Zm22-3.5c0 3.039-2.461 5.5-5.5 5.5a5.499 5.499 0 0 1-5.5-5.5c0-3.039 2.461-5.5 5.5-5.5s5.5 2.461 5.5 5.5ZM17 26c2.734 0 7.183.851 10.101 2.545C28.293 29.758 29 31.081 29 32.4V38H4v-5.6c0-4.256 8.661-6.4 13-6.4Zm27 12H31v-5.6c0-1.416-.511-2.72-1.324-3.883c1.541-.345 3.058-.517 4.217-.517C37.62 28 44 29.787 44 33.333V38Z"
                  />
                </svg>
              </span>
              <p style={{ marginLeft: "15px", marginTop: "10px" }}>
                Sou responsável pelo tratamento de OUTRA PESSOA
              </p>
            </span>
          </label>
          <input
            type="radio"
            className="btn-check"
            name="responsable_type"
            id="btnradio3"
            value="pet"
            checked={formData.responsable_type === "pet"}
            onChange={responsable_pet}
          />
          <label
            className="btn btn-outline-primary radio-input"
            htmlFor="btnradio3"
          >
            <span
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "18px", marginTop: "10px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 1022 1024"
                  fill="#000000"
                >
                  <path
                    fill="#000000"
                    d="M896.423 1024q-29 0-56.5-12t-40.5-23t-31-29q-64 64-192 64h-480q-13 0-22.5-9.5t-9.5-22.5t9.5-22.5t22.5-9.5q12 0 28.5-22.5t31.5-57t25.5-82.5t10.5-94q0-26-6.5-44t-16-31t-19-28.5t-16-46t-6.5-74.5q0-26 6.5-42.5t16-25t19-17.5t16-27.5t6.5-47.5q0-64-64-64q-45 0-86.5-34.5T.423 160q0-23 21.5-43.5t42.5-20.5q17 0 31.5-10t27.5-24t28.5-28t42-24t62.5-10q47 0 76.5 11t44 28.5t23.5 49t12.5 62.5t12.5 79t23 90q19 57 89.5 145.5t102.5 110.5q128 85 128 256q0 49 57 88.5t135 39.5q26 0 61-10q-9 35-44 54.5t-81 19.5zm-576-320q-3 16-8 41.5t-21.5 77.5t-34.5 73h128q0-43-10-74.5t-22-45.5t-22-32.5t-10-39.5z"
                  />
                </svg>
              </span>
              <p style={{ marginLeft: "15px", marginTop: "5px" }}>
                Sou responsável por um PET
              </p>
            </span>
          </label>
        </div>

        <br></br>
        <div>
          <p style={{ color: "white", textAlign: "center" }}>
            {formData.responsable_type == "another"
              ? "Informe primeiro os dados do Responsável pelo Paciente"
              : ""}
          </p>

          <div className="mb-3">
            <label className="form-label" htmlFor="name_associate">
              Primeiro nome
            </label>
            <input
              className="form-input input-login"
              placeholder="Digite seu primeiro nome"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.name_associate}
              type="text"
              id="name_associate"
              name="name_associate"
            ></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="lastname_associate">
              Sobrenome
            </label>
            <input
              className="form-input input-login"
              placeholder="Digite seu sobrenome"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.lastname_associate}
              type="text"
              id="lastname_associate"
              name="lastname_associate"
            ></input>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="birthday_associate">
              Data de nascimento
            </label>
            <InputMask
              mask="99/99/9999"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.birthday_associate || ""}
              type="text"
              id="birthday_associate"
              name="birthday_associate"
            >
              {(inputProps) => (
                <input
                  placeholder="__/__/____"
                  className="form-input input-login"
                  {...inputProps}
                />
              )}
            </InputMask>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="gender">
              Identidade de gênero{" "}
              <LabelInfo
                message="Escolha o gênero ou digite com qual você se identifica"
                id="gen"
              />
            </label>
            <GenderInput
              className="form-input"
              name="gender"
              value={formData.gender}
              handleChangeInput={handleChangeInput}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="nationality">
              Nacionalidade{" "}
              <LabelInfo message="Escolha o país onde nasceu" id="nac" />
            </label>
            <NationalityInput
              name="nationality"
              value={formData.nationality}
              handleChangeInput={handleChangeInput}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cpf_associate">
              CPF{" "}
              <LabelInfo
                message="Necessário para a geração doo termo de responsabilidade do associado"
                id="cpf"
              />
            </label>
            <InputMask
              mask="999.999.999-99"
              value={formData.cpf_associate || ""}
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
            >
              {(inputProps) => (
                <input
                  placeholder="Digite seu CPF"
                  type="text"
                  id="cpf_associate"
                  name="cpf_associate"
                  className="form-input"
                  {...inputProps}
                />
              )}
            </InputMask>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="rg_associate">
              RG{" "}
              <LabelInfo
                message="Necessário para a geração doo termo de responsabilidade do associado"
                id="rg"
              />
            </label>
            <input
              placeholder="Digite seu RG"
              type="text"
              value={formData.rg_associate || ""}
              id="rg_associate"
              name="rg_associate"
              className="form-input"
              onChange={handleChangeInput}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="emiiter_rg_associate">
              Orgão emissor{" "}
              <LabelInfo message="Informe o orgão emissor do seu rg" id="org" />
            </label>
            <input
              placeholder="Digite o orgão emissor do seu RG"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.emiiter_rg_associate || ""}
              type="text"
              id="emiiter_rg_associate"
              name="emiiter_rg_associate"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="marital_status">
              Estado civil
            </label>
            <select
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.marital_status || ""}
              type="text"
              id="marital_status"
              name="marital_status"
            >
              <option value="">Selecione...</option>
              <option value="Solteiro">Solteiro(a)</option>
              <option value="Casado">Casado(a)</option>
              <option value="União-Estável">União Estável</option>
              <option value="Viúvo">Viúvo(a)</option>
              <option value="Divorciado">Divorciado(a)</option>
            </select>
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Defina uma senha para sua conta{" "}
              <LabelInfo
                message="Criar uma senha é necessário para poder acessar o sistema novamente e poder editar seus dados"
                id="pass"
              />
            </label>
            <input
              placeholder="Digite uma senha para sua conta"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.pass_account || ""}
              type="password"
              id="pass_account"
              name="pass_account"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Telefone
            </label>
            <PhoneInputs
              id="mobile_number"
              value={formData.mobile_number}
              onChange={handleChangeInputPhone}
              onBlur={handleChangeInputPhone}
              handleChangeInput={handleChangeInputPhone}
              name="mobile_number"
            />
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="street">
              Rua
            </label>
            <input
              placeholder="Digite o nome da sua rua"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.street || ""}
              type="text"
              id="street"
              name="street"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="number">
              Número
            </label>
            <input
              placeholder="Digite o número da sua casa ou ap"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.number || ""}
              type="text"
              id="number"
              name="number"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="complement">
              Complemento
            </label>
            <input
              placeholder="Digite um complemento para seu endereço"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.complement || ""}
              type="text"
              id="complement"
              name="complement"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="neighborhood">
              Bairro
            </label>
            <input
              placeholder="Digite seu bairro"
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.neighborhood || ""}
              type="text"
              id="neighborhood"
              name="neighborhood"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="city">
              Cidade
            </label>
            <input
              placeholder="Digite sua cidade"
              className="form-input input-login"
              onChange={handleChangeInput}
              value={formData.city || ""}
              type="text"
              id="city"
              name="city"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="state">
              Estado
            </label>
            <select
              className="form-input input-login"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.state || ""}
              type="text"
              id="state"
              name="state"
            >
              <option value="">Selecione...</option>
              {statesData.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <label className="form-label" htmlFor="cep">
            CEP
          </label>
          <div className="mb-3">
            <InputMask
              mask="99999-999"
              value={formData.cep || ""}
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
            >
              {(inputProps) => (
                <input
                  placeholder="Informe seu CEP"
                  className="form-input input-login"
                  type="text"
                  id="cep"
                  name="cep"
                  {...inputProps}
                />
              )}
            </InputMask>
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="reason_treatment">
              Motivo principal para o tratamento
            </label>
            <p style={{ color: "#fff", fontStyle: "italic" }}>
              Os dados deste campo são de acordo com o CIAP2 (Classificação
              Internacional de Atenção Primária){" "}
              <a
                style={{ color: "#fff", fontWeight: "bold" }}
                href="https://saude.campinas.sp.gov.br/sistemas/esus/guia_CIAP2.pdf"
                target="_blank"
              >
                Saiba Mais
              </a>
            </p>
            <p style={{ color: "#fff", fontStyle: "italic" }}>
              No campo abaixo, pesquise pelo motivo do tratamento e selecione
              uma ou mais opções.
            </p>
            <Ciap2Select
              handleChange={handleSelectionChange}
              id="reason_treatment"
              className="form-input input-login select-treatment"
              value={formData.reason_treatment}
              name="reason_treatment"
              counterCheck={counter}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="reason_treatment_text">
              Descreva com suas palavras o motivo do seu tratamento{" "}
              <LabelInfo
                message="Informe com suas palavras os motivos do seu tratamento"
                id="trattxt"
              />
            </label>
            <textarea
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.reason_treatment_text || ""}
              id="reason_treatment_text"
              name="reason_treatment_text"
            />
          </div>

          <div>
            <label className="form-label">Como você chegou até nós?</label>
            <select
              className="form-input input-login"
              id="met_us"
              name="met_us"
              onChange={handleChangeInput}
              onBlur={handleChangeInput}
              value={formData.met_us || ""}
            >
              <option value="">Selecione...</option>
              <option value="Indicação de profissionais">
                Indicação de profissionais
              </option>
              <option value="Indicação de amigos ou familiares">
                Indicação de amigos ou familiares
              </option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Busca no google">Busca no Google</option>
              <option value="Outra">Outra</option>
            </select>
          </div>
          <br></br>
          <br></br>

          <button
            className="btn btn-success btn-lg btn-float-right"
            type="submit"
            disabled={isSubmitting}
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              padding: "15px 30px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              minWidth: "200px",
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Enviando...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 16 16"
                  fill="#ffffff"
                >
                  <path
                    fill="#ffffff"
                    d="M5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 12.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5.5 3a.5.5 0 0 0 0 1H8V3z"
                  />
                  <path
                    fill="#ffffff"
                    fillRule="evenodd"
                    d="M14 4.57a.5.5 0 0 0-.024-.235l-.013-.063a1.5 1.5 0 0 0-.18-.434c-.092-.15-.222-.28-.482-.54l-2.59-2.59c-.259-.26-.389-.39-.54-.483a1.5 1.5 0 0 0-.496-.193a.5.5 0 0 0-.235-.024C9.329.004 9.194.004 9.015.004h-2.21c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3.02 3.02 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.99c0-.178 0-.313-.005-.425zm-2.91 10.4c-.45.037-1.03.038-1.89.038H6.8c-.857 0-1.44-.001-1.89-.038c-.438-.036-.663-.101-.819-.18a2 2 0 0 1-.874-.874c-.08-.156-.145-.381-.18-.819c-.037-.45-.038-1.03-.038-1.89v-6.4c0-.857.001-1.44.038-1.89c.036-.438.101-.663.18-.819c.192-.376.498-.682.874-.874c.156-.08.381-.145.819-.18c.45-.037 1.03-.038 1.89-.038H9v3.5a.5.5 0 0 0 .5.5H13v6.2c0 .857 0 1.44-.038 1.89c-.035.438-.1.663-.18.82a2 2 0 0 1-.874.873c-.156.08-.38.145-.819.18zM10 1.47l2.59 2.59H10z"
                    clipRule="evenodd"
                  />
                </svg>
                <span style={{ marginLeft: "10px" }}>Enviar dados</span>
              </>
            )}
          </button>
          <br></br>
          <br></br>
          <br></br>
        </div>

        {fieldsError && !ciapError && !cpfError && !cepError && !cpfNotValid && !passError && !phoneError && (
          <AlertError
            message="Você precisa preencher os seguintes campos: "
            emptyFields={emptyFieldsMessage}
          />
        )}
        {ciapError && (
          <div className="alert2">
            <AlertError message="Você marcou mais que 10 motivos para seu tratamento." />
          </div>
        )}
        {cpfError && (
          <div className="alert2">
            <AlertError message="O CPF precisa estar completo" />
          </div>
        )}
        {cepError && (
          <div className="alert2">
            <AlertError message="O CEP está incompleto" />
          </div>
        )}
        {cpfNotValid && (
          <div className="alert2">
            <AlertError message="O CPF digitado não é válido" />
          </div>
        )}
        {passError && (
          <div className="alert2">
            <AlertError message="A senha precisa ter pelo menos 6 dígitos" />
          </div>
        )}
        {phoneError && (
          <div className="alert2">
            <AlertError message="O telefone precisa ter 13 dígitos" />
          </div>
        )}
      </form>

      {/* Modal para Motivo do Tratamento */}
      <Modal show={showTreatmentModal} onHide={handleCloseTreatmentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Campo Obrigatório</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src="/Screenshot_4.png" width="90%" />
          <br></br>
          <br></br>
          <p>O campo <strong>"Motivo principal para o tratamento"</strong> é obrigatório.</p>
          <p>Você pode pesquisar por um motivo ou clicar em uma das Opções Gerais para escolher uma ou mais opções.</p>
          <p>Esse campo é padronizado com o CIAP2 (Classificação Internacional de Atenção Primária) e nos ajuda a padronizar os motivos de tratamento de nossos associados.</p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-primary" 
            onClick={handleCloseTreatmentModal}
          >
            Entendi
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssociateSignUp;
