import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import apiRequest from "../../modules/apiRequest";
import User from "../../modules/User";
import GenderInput from "../forms/GenderInput";
import NationalityInput from "../forms/NationalityInput";
import AlertError from "../forms/AlertError";
import LabelInfo from "../pages/elements/labelInfo";
import { useFormLocalStorage } from "../../hooks/useLocalStorage";

const AssociateSignUp = () => {
  const [user, setUser] = useState({});
  const [inputError, setInputError] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const [validateForm, setValidateForm] = useState();
  const [cpfError, setCpfError] = useState(false);
  const [rgError, setRgError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [cpfNotValid, setCpfNotValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);

  // ✅ Remover referência ao localStorage - usar dados do usuário autenticado
  const codeUser = user?.user_code;

  useEffect(() => {
    (async () => {
      const userData = await User();
      setUser(userData);
    })();

    const timer = setTimeout(() => { }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (user.associate_status > 3) {
    window.location.assign("/");
  }

  // Dados iniciais do formulário
  const initialFormData = {
    status: "patient",
    responsable_type: "patient",
    name_associate: null,
    lastname_associate: null,
    birthday_associate: null,
    gender: null,
    nationality: null,
    cpf_associate: null,
    rg_associate: null,
    emiiter_rg_associate: null,
    marital_status: null,
    email: null,
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    cep: null,
    mobile_number: null,
    associate_status: 9,
  };

  // Hook para gerenciar o localStorage do formulário
  const [
    formData, 
    setFormData, 
    updateField, 
    updateMultipleFields, 
    resetForm, 
    clearFormData
  ] = useFormLocalStorage("patient_signup", initialFormData);

  formData.email = user.email_account;
  formData.mobile_number = user.mobile_number;

  const handleChangeInput = event => {
    // Atualiza o campo específico no localStorage
    updateField(event.target.name, event.target.value);
  };



  const handleChoice = choice => {
    handleClose();
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

  const updateUser = async event => {
    event.preventDefault();
    setIsSubmitting(true);

    var emptyFieldsArray = [];

    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (formData[key] == null || formData[key] == undefined || formData[key] == "" || formData[key] == []) {
                     if (key != "complement") {
             emptyFieldsArray.push(key);
           }
          if (key != "mobile_number" && key != "status" && key != "responsable_type" && key != "associate_status" && key != "email" && key != "complement" && key != "mobile_number") {
            document.querySelector("#" + key).className = "form-input input-login input-empty";
          }
        } else {
          if (key != "mobile_number" && key != "status" && key != "responsable_type" && key != "associate_status" && key != "email" && key != "mobile_number" && key != "complement") {
            document.querySelector("#" + key).className = "form-input input-login";
          }
        }


      }
    }



    if (emptyFieldsArray != []) {
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

      emptyFieldsArray.push("cpf");
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

          return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
        }
      }

      // Validação matemática do CPF
      if (!realCPF(validateCPF)) {
        if (formData.cpf_associate) {
          emptyFieldsArray.push("cpf");
          setCpfNotValid(true);
          setTimeout(() => {
            setCpfNotValid(false);
          }, 6000);
        }
      }
    }



    // Se há campos vazios, mostra erro e move para o primeiro campo
    if (emptyFieldsArray.length > 0) {
      setEmptyFields(emptyFieldsArray);
      
      // Cria a mensagem traduzida dos campos vazios
      const translations = {
        name_associate: "primeiro nome",
        lastname_associate: "sobrenome",
        birthday_associate: "data de nascimento",
        gender: "identidade de gênero",
        nationality: "nacionalidade",
        cpf_associate: "CPF",
        rg_associate: "RG",
        emiiter_rg_associate: "órgão emissor",
        marital_status: "estado civil",
        street: "rua",
        number: "número",
        neighborhood: "bairro",
        city: "cidade",
        state: "estado",
        cep: "CEP"
      };

      let translatedFields = [];
      emptyFieldsArray.map(field => {
        if (translations[field]) {
          translatedFields.push(translations[field]);
        }
      });

      let translatedFieldsString = translatedFields.join(", ");
      setEmptyFieldsMessage(translatedFieldsString);
      
      setFieldsError(true);
      setTimeout(() => {
        setFieldsError(false);
      }, 6000);
      
      // Move a página para o primeiro campo vazio
      const firstEmptyField = emptyFieldsArray[0];
      const element = document.getElementById(firstEmptyField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setIsSubmitting(false);
      return; // Para a execução aqui
    }

    // Se não há campos vazios, continua com o envio
    setFieldsError(false);
    formData.responsable_code = codeUser;

    await apiRequest("/api/directus/create-user", formData, "POST")

    const searchUser = await apiRequest("/api/directus/search", { query: "/items/Users?filter[responsable_code][_eq]=" + codeUser }, "POST")
    await apiRequest("/api/directus/update", { userId: user.id, formData: { responsible_for: searchUser.data.user_code } }, "POST")
    
    // Sempre desabilita o estado de envio no final
    setIsSubmitting(false);
    
    window.location.assign("/documentos");
  };

  return (
    <div>  
      <form onSubmit={updateUser} className="form-container ">
        <h1 className="sub-title">Cadastro do Paciente</h1>
        <p style={{ color: 'white', textAlign: 'center', fontSize: '18px', padding: '0 10px' }} >
          Informe abaixo os dados do paciente no qual você é responsável
        </p>       
        <br></br>
        <div>
          <div className="mb-3">
            <label className="form-label" htmlFor="name_associate">
              Primeiro nome
            </label>
            <input 
              placeholder="Digite o primeiro nome do paciente" 
              className="form-input input-login" 
              onChange={handleChangeInput} 
              onBlur={handleChangeInput} 
              value={formData.name_associate || ""} 
              type="text" 
              id="name_associate" 
              name="name_associate"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="lastname_associate">
              Sobrenome
            </label>
            <input placeholder="Digite o sobrenome do paciente" className="form-input input-login" onChange={handleChangeInput} onBlur={handleChangeInput} value={formData.lastname_associate} type="text" id="lastname_associate" name="lastname_associate"></input>
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
              {inputProps =>  <input placeholder="__/__/____" className="form-input input-login" {...inputProps}  />}
            </InputMask>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="gender">
              Identidade de gênero <LabelInfo message="Escolha o gênero ou digite com qual você se identifica" id="gen" />
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
              Nacionalidade <LabelInfo message="Escolha o país onde nasceu" id="nac" />
            </label>
            <NationalityInput 
              name="nationality" 
              value={formData.nationality}
              handleChangeInput={handleChangeInput} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cpf_associate">
              CPF <LabelInfo message="Necessário para a geração doo termo de responsabilidade do associado" id="cpf" />
            </label>
            <InputMask 
              mask="999.999.999-99" 
              value={formData.cpf_associate || ""} 
              onChange={handleChangeInput} 
              onBlur={handleChangeInput}
            >
              {inputProps => <input placeholder="Digite o CPF do paciente" type="text" id="cpf_associate" name="cpf_associate" className="form-input" {...inputProps} />}
            </InputMask>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="rg_associate">
              RG <LabelInfo message="Necessário para a geração doo termo de responsabilidade do associado" id="rg" />
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
              Orgão emissor <LabelInfo message="Informe o orgão emissor do seu rg" id="org" />
            </label>
            <input 
              placeholder="Digite orgão emissor do documento" 
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
              <option value="Viúvo">Viúvo(a)</option>
              <option value="Divorciado">Divorciado(a)</option>
            </select>
          </div>
          <br></br>
          <br></br>
          <div className="mb-3">
            <label className="form-label" htmlFor="street">
              Rua
            </label>
            <input 
              placeholder="Digite a rua do endereço" 
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
              placeholder="Digite o número ou bloco" 
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
              placeholder="Digite um complemento se necessário" 
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
              placeholder="Digite o bairro" 
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
              placeholder="Digite a cidade" 
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
              {statesData.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cep">
              CEP
            </label>
            <input 
              placeholder="Digite o CEP" 
              className="form-input input-login" 
              onChange={handleChangeInput} 
              onBlur={handleChangeInput} 
              value={formData.cep || ""} 
              type="text" 
              id="cep" 
              name="cep"
            />
          </div>     
          
          <button 
            className="btn btn-success btn-lg btn-float-right" 
            type="submit"
            disabled={isSubmitting}
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              padding: '15px 30px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : (
              <>
             <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16" fill="#ffffff"><path fill="#ffffff" d="M5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 12.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5.5 3a.5.5 0 0 0 0 1H8V3z"/><path fill="#ffffff" fill-rule="evenodd" d="M14 4.57a.5.5 0 0 0-.024-.235l-.013-.063a1.5 1.5 0 0 0-.18-.434c-.092-.15-.222-.28-.482-.54l-2.59-2.59c-.259-.26-.389-.39-.54-.483a1.5 1.5 0 0 0-.496-.193a.5.5 0 0 0-.235-.024C9.329.004 9.194.004 9.015.004h-2.21c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3.02 3.02 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.99c0-.178 0-.313-.005-.425zm-2.91 10.4c-.45.037-1.03.038-1.89.038H6.8c-.857 0-1.44-.001-1.89-.038c-.438-.036-.663-.101-.819-.18a2 2 0 0 1-.874-.874c-.08-.156-.145-.381-.18-.819c-.037-.45-.038-1.03-.038-1.89v-6.4c0-.857.001-1.44.038-1.89c.036-.438.101-.663.18-.819c.192-.376.498-.682.874-.874c.156-.08.381-.145.819-.18c.45-.037 1.03-.038 1.89-.038H9v3.5a.5.5 0 0 0 .5.5H13v6.2c0 .857 0 1.44-.038 1.89c-.035.438-.1.663-.18.82a2 2 0 0 1-.874.873c-.156.08-.38.145-.819.18zM10 1.47l2.59 2.59H10z" clip-rule="evenodd"/></svg>
             <span style={{marginLeft: '10px'}}>Enviar dados</span>
             </> 
            )}
          </button>

          <br></br>
          <br></br>
        </div>
        
        {fieldsError && !cpfError && !cpfNotValid && 
         <AlertError message="Você precisa preencher os seguintes campos: " emptyFields={emptyFieldsMessage} />}
        {cpfError && (
          <div className="alert2">
            <AlertError message="O CPF precisa estar completo" />
          </div>
        )}
        {rgError && (
          <div className="alert2">
            <AlertError message="O RG precisa estar completo" />
          </div>
        )}
        {cpfNotValid && (
          <div className="alert2">
            <AlertError message="O CPF digitado não é válido" />
          </div>
        )}
      </form>
    </div>
  );
};

export default AssociateSignUp;
